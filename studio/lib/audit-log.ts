import { getStore } from "@netlify/blobs";

export type AuditAction =
    | "edit.submit"
    | "edit.approve"
    | "edit.reject"
    | "user.grant"
    | "user.revoke";

export type AuditEntry = {
    /** UUID. */
    id: string;
    /** ISO-8601 timestamp the action occurred. */
    timestamp: string;
    /** GitHub login of the user that performed the action. */
    actor: string;
    /** What happened. */
    action: AuditAction;
    /** Free-form human-readable summary, e.g. `class Asset in l2-extensions/...`. */
    target: string;
    /** Optional structured metadata (edit id, PR url, granted role, etc.). */
    details?: Record<string, unknown>;
};

function getAuditStore() {
    return getStore("ontology-audit-log");
}

/**
 * Append an immutable entry to the audit log. Failures throw — losing audit
 * records silently is worse than failing the user-facing operation.
 *
 * Keys are time-ordered: `YYYY-MM-DDTHH:MM:SS.sssZ-<uuid>` so `list()`
 * returns chronological order and we can trim by date prefix later.
 */
export async function appendAuditEntry(
    entry: Omit<AuditEntry, "id" | "timestamp"> & { timestamp?: string }
): Promise<AuditEntry> {
    const id = crypto.randomUUID();
    const timestamp = entry.timestamp || new Date().toISOString();
    const full: AuditEntry = {
        id,
        timestamp,
        actor: entry.actor,
        action: entry.action,
        target: entry.target,
        details: entry.details,
    };

    const key = `${timestamp}-${id}`;
    const store = getAuditStore();
    await store.setJSON(key, full);
    // Mirror to console so platform log aggregators still capture it.
    console.log(`[AUDIT] ${timestamp} ${entry.actor} ${entry.action} ${entry.target}`);
    return full;
}

/**
 * List recent audit entries (most-recent-first). `limit` defaults to 100;
 * the underlying store's `list()` returns all keys but we sort + slice.
 */
export async function listAuditEntries(limit = 100): Promise<AuditEntry[]> {
    const store = getAuditStore();
    const result = await store.list();
    const keys = result.blobs
        .map((b) => b.key)
        .sort()
        .reverse()
        .slice(0, limit);

    const entries = await Promise.all(
        keys.map(async (key) => {
            const data = await store.get(key, { type: "json" });
            return data as AuditEntry | null;
        })
    );
    return entries.filter((e): e is AuditEntry => !!e);
}
