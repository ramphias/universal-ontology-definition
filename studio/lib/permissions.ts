import { getStore } from "@netlify/blobs";

export type Role = "admin" | "editor" | "viewer";

/**
 * Persisted role record. `version` increments every time `setUserRole` /
 * `revokeUserAccess` runs against the same username — JWT callbacks compare
 * this against the version baked into the session token to invalidate stale
 * sessions when an admin changes someone's role.
 */
export type RoleRecord = {
    role: Role;
    version: number;
    updatedBy: string;
    updatedAt: string;
};

// In local dev without `netlify dev`, Blobs API will throw since it lacks a context token.
// We provide a fallback for the superadmin to always work locally.
const DEV_FALLBACK_ROLES: Record<string, Role> = {
    // Only used locally fallback
};

function getPermissionStore() {
    return getStore("ontology-permissions");
}

function isRole(x: unknown): x is Role {
    return x === "admin" || x === "editor" || x === "viewer";
}

/**
 * Internal: parse a blob value that may be either the legacy plain-text role
 * string ("admin"/"editor"/"viewer") or the JSON RoleRecord introduced for
 * roleVersion invalidation. Legacy values are mapped to `version: 0`.
 */
function parseRoleBlob(raw: string | null): RoleRecord | null {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (isRole(trimmed)) {
        return { role: trimmed, version: 0, updatedBy: "", updatedAt: "" };
    }
    try {
        const parsed = JSON.parse(trimmed);
        if (parsed && isRole(parsed.role) && typeof parsed.version === "number") {
            return {
                role: parsed.role,
                version: parsed.version,
                updatedBy: typeof parsed.updatedBy === "string" ? parsed.updatedBy : "",
                updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
            };
        }
    } catch {
        // fall through
    }
    return null;
}

/**
 * Public: full role record for `username`, used by the JWT callback to
 * compare against the token's stored `roleVersion`. Returns null if the
 * user is not provisioned.
 */
export async function getUserRoleRecord(githubUsername: string): Promise<RoleRecord | null> {
    const username = githubUsername.toLowerCase();

    if (process.env.SUPER_ADMIN && username === process.env.SUPER_ADMIN.toLowerCase()) {
        // Root admin is configured at deploy time; treat its version as "always current"
        // so it never gets invalidated through the roleVersion mechanism.
        return { role: "admin", version: 0, updatedBy: "env:SUPER_ADMIN", updatedAt: "" };
    }

    try {
        const store = getPermissionStore();
        const raw = await store.get(username, { type: "text" });
        return parseRoleBlob(raw);
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            const fallback = DEV_FALLBACK_ROLES[username];
            return fallback ? { role: fallback, version: 0, updatedBy: "dev-fallback", updatedAt: "" } : null;
        }
        console.error("[FATAL] Netlify Blobs read failed in production:", err);
        throw new Error("Permission store unavailable.");
    }
}

export async function getUserRole(githubUsername: string): Promise<Role | null> {
    const record = await getUserRoleRecord(githubUsername);
    return record ? record.role : null;
}

export async function setUserRole(githubUsername: string, role: Role, updatedBy = "system") {
    const username = githubUsername.toLowerCase();
    const previous = await getUserRoleRecord(username).catch(() => null);
    const next: RoleRecord = {
        role,
        version: (previous?.version ?? 0) + 1,
        updatedBy,
        updatedAt: new Date().toISOString(),
    };
    try {
        const store = getPermissionStore();
        await store.set(username, JSON.stringify(next));
    } catch (err) {
       console.error("Netlify Blobs Set Error:", err);
       throw new Error("Could not save to Netlify Blobs.");
    }
}

export async function revokeUserAccess(githubUsername: string) {
    const username = githubUsername.toLowerCase();
    try {
        const store = getPermissionStore();
        await store.delete(username);
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
            const raw = await store.get(b.key, { type: "text" });
            const record = parseRoleBlob(raw);
            if (record) {
                result[b.key] = record.role;
            }
        }));

        return result;
    } catch (err) {
         if (process.env.NODE_ENV === 'development') {
             return DEV_FALLBACK_ROLES;
         }
         // Production: surface the failure so the admin UI shows an explicit
         // error instead of an empty list that looks like "no users granted".
         console.error("[FATAL] Netlify Blobs list failed in production:", err);
         throw new Error("Permission store unavailable.");
    }
}
