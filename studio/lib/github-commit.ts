import { Octokit } from "@octokit/rest";
import type { EditableClassFields } from "./pending-edits";

const REPO_OWNER = process.env.GITHUB_REPO_OWNER as string;
const REPO_NAME = process.env.GITHUB_REPO_NAME as string;

const JSON_MAX_BYTES = 5 * 1024 * 1024;

/**
 * Escape backticks (and adjacent backslashes) so a malicious or accidental
 * backtick in user-controlled text can't break out of an inline-code span
 * in the PR body. Identifiers we currently emit are all regex-validated
 * upstream, so this is defense in depth.
 */
function escapeMd(s: string): string {
    return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
}

/**
 * Apply metadata changes to a class entry in an ontology JSON file,
 * then push to a new branch and open a pull request.
 *
 * The caller (admin) supplies their own OAuth access token so the commit
 * is attributed to their GitHub identity.
 *
 * @param accessToken GitHub token with `public_repo` (or repo) scope. Note: as of
 *                    Phase 1 the user OAuth flow no longer requests `public_repo`,
 *                    so this must come from a server-side GitHub App or fine-grained
 *                    PAT, not the admin's session token.
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
    if (typeof fileData.size === "number" && fileData.size > JSON_MAX_BYTES) {
        throw new Error(`Refusing to edit ${layerFile}: ${fileData.size} bytes exceeds ${JSON_MAX_BYTES}`);
    }
    const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
    if (Buffer.byteLength(currentContent, "utf-8") > JSON_MAX_BYTES) {
        throw new Error(`Refusing to edit ${layerFile}: decoded content exceeds ${JSON_MAX_BYTES} bytes`);
    }
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
    if (Buffer.byteLength(newContent, "utf-8") > JSON_MAX_BYTES) {
        throw new Error(`Refusing to write ${layerFile}: result would exceed ${JSON_MAX_BYTES} bytes`);
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
            `Submitted by **@${escapeMd(submitter)}** via Ontology Studio.`,
            "",
            `**Target**: \`${escapeMd(layerFile)}\` → class \`${escapeMd(classId)}\``,
            `**Fields changed**: ${fieldList.map((f) => `\`${escapeMd(f)}\``).join(", ")}`,
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
 * Also returns the class's `owner` array so callers can enforce ownership.
 */
export async function readClassMetadata(
    layerFile: string,
    classId: string
): Promise<(EditableClassFields & { owner?: string[] }) | null> {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    try {
        const { data } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: layerFile,
        });
        if (Array.isArray(data) || data.type !== "file") return null;
        if (typeof data.size === "number" && data.size > JSON_MAX_BYTES) return null;
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        if (Buffer.byteLength(content, "utf-8") > JSON_MAX_BYTES) return null;
        const json = JSON.parse(content);
        const target = (json.classes || []).find((c: any) => c.id === classId);
        if (!target) return null;
        const ownerRaw = target.owner;
        const owner = Array.isArray(ownerRaw)
            ? ownerRaw.filter((s: unknown): s is string => typeof s === "string")
            : typeof ownerRaw === "string" ? [ownerRaw] : undefined;
        return {
            label_en: target.label_en,
            label_zh: target.label_zh,
            definition_en: target.definition_en,
            definition_zh: target.definition_zh,
            abstract: target.abstract ?? false,
            ...(owner !== undefined ? { owner } : {}),
        };
    } catch {
        return null;
    }
}
