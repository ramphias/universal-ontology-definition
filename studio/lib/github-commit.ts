import { Octokit } from "@octokit/rest";
import type { EditableClassFields } from "./pending-edits";

const REPO_OWNER = process.env.GITHUB_REPO_OWNER as string;
const REPO_NAME = process.env.GITHUB_REPO_NAME as string;

/**
 * Apply metadata changes to a class entry in an ontology JSON file,
 * then push to a new branch and open a pull request.
 *
 * The caller (admin) supplies their own OAuth access token so the commit
 * is attributed to their GitHub identity.
 *
 * @param accessToken Admin's GitHub OAuth token (public_repo scope)
 * @param layerFile Repo-relative path to the ontology JSON file
 * @param classId The class ID being edited
 * @param changes The new field values to apply
 * @param submitter GitHub login of the original editor (for PR body credit)
 * @returns URL of the opened pull request
 */
export async function commitMetadataEdit(
    accessToken: string,
    layerFile: string,
    classId: string,
    changes: EditableClassFields,
    submitter: string
): Promise<string> {
    const octokit = new Octokit({ auth: accessToken });

    // 1. Resolve the default branch SHA (source for the new branch)
    const { data: repo } = await octokit.repos.get({ owner: REPO_OWNER, repo: REPO_NAME });
    const defaultBranch = repo.default_branch;
    const { data: ref } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `heads/${defaultBranch}`,
    });
    const baseSha = ref.object.sha;

    // 2. Fetch the current file content + blob SHA
    const { data: fileData } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: layerFile,
        ref: defaultBranch,
    });
    if (Array.isArray(fileData) || fileData.type !== "file") {
        throw new Error(`Target is not a file: ${layerFile}`);
    }
    const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
    const currentBlobSha = fileData.sha;

    // 3. Apply the class metadata patch
    const json = JSON.parse(currentContent);
    if (!Array.isArray(json.classes)) {
        throw new Error(`No classes array found in ${layerFile}`);
    }
    const target = json.classes.find((c: any) => c.id === classId);
    if (!target) {
        throw new Error(`Class '${classId}' not found in ${layerFile}`);
    }
    applyFieldChanges(target, changes);

    // 4. Serialise back with 2-space indent (matching repo convention) + trailing newline
    const newContent = JSON.stringify(json, null, 2) + "\n";
    if (newContent === currentContent) {
        throw new Error("No-op: content unchanged after applying edit");
    }

    // 5. Create a branch and commit the updated file
    const branchName = `edit/${classId.toLowerCase()}-${Date.now()}`;
    await octokit.git.createRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `refs/heads/${branchName}`,
        sha: baseSha,
    });

    await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: layerFile,
        branch: branchName,
        message: `edit(${classId}): update metadata via Studio`,
        content: Buffer.from(newContent, "utf-8").toString("base64"),
        sha: currentBlobSha,
    });

    // 6. Open a PR
    const fieldList = Object.keys(changes).filter((k) => changes[k as keyof EditableClassFields] !== undefined);
    const { data: pr } = await octokit.pulls.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title: `edit(${classId}): update ${fieldList.join(", ")}`,
        head: branchName,
        base: defaultBranch,
        body: [
            `Submitted by **@${submitter}** via Ontology Studio.`,
            "",
            `**Target**: \`${layerFile}\` → class \`${classId}\``,
            `**Fields changed**: ${fieldList.map((f) => `\`${f}\``).join(", ")}`,
            "",
            "Review and merge to apply.",
        ].join("\n"),
    });

    return pr.html_url;
}

function applyFieldChanges(target: any, changes: EditableClassFields) {
    if (changes.label_en !== undefined) target.label_en = changes.label_en;
    if (changes.label_zh !== undefined) target.label_zh = changes.label_zh;
    if (changes.definition_en !== undefined) target.definition_en = changes.definition_en;
    if (changes.definition_zh !== undefined) target.definition_zh = changes.definition_zh;
    if (changes.abstract !== undefined) target.abstract = changes.abstract;
}

/**
 * Read the current metadata values for a class (used to capture "before" state
 * at submission time, so admin can see the diff even if source changes later).
 */
export async function readClassMetadata(
    layerFile: string,
    classId: string
): Promise<EditableClassFields | null> {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    try {
        const { data } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: layerFile,
        });
        if (Array.isArray(data) || data.type !== "file") return null;
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const json = JSON.parse(content);
        const target = (json.classes || []).find((c: any) => c.id === classId);
        if (!target) return null;
        return {
            label_en: target.label_en,
            label_zh: target.label_zh,
            definition_en: target.definition_en,
            definition_zh: target.definition_zh,
            abstract: target.abstract ?? false,
        };
    } catch {
        return null;
    }
}
