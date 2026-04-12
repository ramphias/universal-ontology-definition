import { getStore } from "@netlify/blobs";

export type Role = "admin" | "editor" | "viewer";

// In local dev without `netlify dev`, Blobs API will throw since it lacks a context token.
// We provide a fallback for the superadmin to always work locally.
const DEV_FALLBACK_ROLES: Record<string, Role> = {
    // Only used locally fallback
};

/**
 * Get the Netlify Blob Store safely
 */
function getPermissionStore() {
    return getStore("ontology-permissions");
}

export async function getUserRole(githubUsername: string): Promise<Role | null> {
    const username = githubUsername.toLowerCase();
    
    // Root Admin configured via Environment Variable
    if (process.env.SUPER_ADMIN && username === process.env.SUPER_ADMIN.toLowerCase()) return "admin";
    
    try {
        const store = getPermissionStore();
        const role = await store.get(username, { type: "text" });
        if (!role || !["admin", "editor", "viewer"].includes(role)) return null;
        return role as Role;
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            return DEV_FALLBACK_ROLES[username] || null;
        }
        console.error("Netlify Blobs Fetch Error:", err);
        return null;
    }
}

export async function setUserRole(githubUsername: string, role: Role) {
    try {
        const store = getPermissionStore();
        await store.set(githubUsername.toLowerCase(), role);
    } catch (err) {
       console.error("Netlify Blobs Set Error:", err);
       throw new Error("Could not save to Netlify Blobs.");
    }
}

export async function revokeUserAccess(githubUsername: string) {
    try {
        const store = getPermissionStore();
        await store.delete(githubUsername.toLowerCase());
    } catch (err) {
       console.error("Netlify Blobs Delete Error:", err);
       throw new Error("Could not delete from Netlify Blobs.");
    }
}

export async function getAllPermissions(): Promise<Record<string, Role>> {
    try {
        const store = getPermissionStore();
        // Get metadata and unroll it. (Assumes <1000 users for now, list() gets all)
        const list = await store.list();
        const result: Record<string, Role> = {};
        
        // Blobs don't return values in `list()`, so we must fetch them concurrently
        await Promise.all(list.blobs.map(async b => {
            const role = await store.get(b.key, { type: "text" });
            if (role && ["admin", "editor", "viewer"].includes(role)) {
                result[b.key] = role as Role;
            }
        }));
        
        return result;
    } catch (err) {
         if (process.env.NODE_ENV === 'development') {
             return DEV_FALLBACK_ROLES;
         }
         console.warn("Could not list Netlify Blobs, returning empty roles array");
         return {};
    }
}
