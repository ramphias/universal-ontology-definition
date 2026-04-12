"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setUserRole, revokeUserAccess, getAllPermissions, type Role } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

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

export async function fetchAllUsers() {
    await requireAdmin();
    return await getAllPermissions();
}

export async function addUserRole(githubUsername: string, role: Role) {
    const session = await requireAdmin();
    if (!githubUsername || !/^[a-zA-Z0-9-]+$/.test(githubUsername)) {
        throw new Error("Invalid GitHub username format.");
    }
    
    try {
        await setUserRole(githubUsername, role);
        console.log(`[AUDIT] User '${session.user.login}' granted '${role}' role to '@${githubUsername}'.`);
    } catch {
        throw new Error("Failed to modify user access.");
    }
    revalidatePath("/admin");
}

export async function removeUserAccess(githubUsername: string) {
    const session = await requireAdmin();
    if (!githubUsername || !/^[a-zA-Z0-9-]+$/.test(githubUsername)) {
        throw new Error("Invalid GitHub username format.");
    }
    const superAdmin = process.env.SUPER_ADMIN?.toLowerCase();
    if (superAdmin && githubUsername.toLowerCase() === superAdmin) {
        throw new Error("Cannot revoke Super Admin root account.");
    }

    try {
        await revokeUserAccess(githubUsername);
        console.log(`[AUDIT] User '${session.user.login}' revoked access from '@${githubUsername}'.`);
    } catch {
        throw new Error("Failed to modify user access.");
    }
    revalidatePath("/admin");
}
