"use server";

import { Octokit } from "@octokit/rest";
import { getServerSession } from "next-auth";
import { authOptions, getUserAccessToken } from "@/lib/auth";
import { setUserRole, revokeUserAccess, getAllPermissions, type Role } from "@/lib/permissions";
import { appendAuditEntry } from "@/lib/audit-log";
import { enforceRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

// GitHub username rules: 1-39 chars, alphanumerics + single hyphens, no leading
// or trailing hyphen, no consecutive hyphens. Source: https://github.com/join
const GH_USERNAME_RE = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/;

/**
 * Validates that the current caller is a Super Admin
 */
async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
        throw new Error("Unauthorized: Super Admin access required.");
    }
    return session;
}

async function assertGithubUserExists(username: string) {
    const token = await getUserAccessToken();
    const octokit = new Octokit({ auth: token ?? undefined });
    try {
        await octokit.users.getByUsername({ username });
    } catch (err: any) {
        if (err?.status === 404) {
            throw new Error(`GitHub user '${username}' does not exist.`);
        }
        throw new Error("Could not verify GitHub user. Try again later.");
    }
}

export async function fetchAllUsers() {
    const session = await requireAdmin();
    await enforceRateLimit("admin.fetchAllUsers", session.user.login);
    return await getAllPermissions();
}

export async function addUserRole(githubUsername: string, role: Role) {
    const session = await requireAdmin();
    await enforceRateLimit("admin.addUserRole", session.user.login);

    if (!githubUsername || !GH_USERNAME_RE.test(githubUsername)) {
        throw new Error("Invalid GitHub username format.");
    }
    await assertGithubUserExists(githubUsername);

    try {
        await setUserRole(githubUsername, role, session.user.login);
    } catch {
        throw new Error("Failed to modify user access.");
    }
    await appendAuditEntry({
        actor: session.user.login,
        action: "user.grant",
        target: `@${githubUsername}`,
        details: { role },
    });
    revalidatePath("/admin");
}

export async function removeUserAccess(githubUsername: string) {
    const session = await requireAdmin();
    await enforceRateLimit("admin.removeUserAccess", session.user.login);

    if (!githubUsername || !GH_USERNAME_RE.test(githubUsername)) {
        throw new Error("Invalid GitHub username format.");
    }
    const superAdmin = process.env.SUPER_ADMIN?.toLowerCase();
    if (superAdmin && githubUsername.toLowerCase() === superAdmin) {
        throw new Error("Cannot revoke Super Admin root account.");
    }

    try {
        await revokeUserAccess(githubUsername);
    } catch {
        throw new Error("Failed to modify user access.");
    }
    await appendAuditEntry({
        actor: session.user.login,
        action: "user.revoke",
        target: `@${githubUsername}`,
    });
    revalidatePath("/admin");
}
