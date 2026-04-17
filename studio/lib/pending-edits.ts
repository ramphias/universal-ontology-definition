import { getStore } from "@netlify/blobs";

/**
 * Editable fields on a class node. Phase 1 is metadata-only — structural
 * changes (id, parent, abstract transitions affecting children) are out of scope.
 */
export type EditableClassFields = {
    label_en?: string;
    label_zh?: string;
    definition_en?: string;
    definition_zh?: string;
    abstract?: boolean;
};

export type PendingEditStatus = "pending" | "approved" | "rejected";

export type PendingEdit = {
    id: string;
    submittedBy: string;
    submittedAt: string;
    layerFile: string;
    targetType: "class";
    targetId: string;
    before: EditableClassFields;
    after: EditableClassFields;
    status: PendingEditStatus;
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    prUrl?: string;
};

function getPendingEditStore() {
    return getStore("ontology-pending-edits");
}

export async function createPendingEdit(
    edit: Omit<PendingEdit, "id" | "submittedAt" | "status">
): Promise<PendingEdit> {
    const id = crypto.randomUUID();
    const full: PendingEdit = {
        ...edit,
        id,
        submittedAt: new Date().toISOString(),
        status: "pending",
    };
    const store = getPendingEditStore();
    await store.setJSON(id, full);
    return full;
}

export async function getPendingEdit(id: string): Promise<PendingEdit | null> {
    try {
        const store = getPendingEditStore();
        const data = await store.get(id, { type: "json" });
        return (data as PendingEdit) || null;
    } catch {
        return null;
    }
}

export async function listPendingEdits(
    filter?: { status?: PendingEditStatus; submittedBy?: string }
): Promise<PendingEdit[]> {
    try {
        const store = getPendingEditStore();
        const listResult = await store.list();
        const items = await Promise.all(
            listResult.blobs.map(async (b) => {
                const data = await store.get(b.key, { type: "json" });
                return data as PendingEdit | null;
            })
        );
        const edits = items.filter((x): x is PendingEdit => !!x);
        return edits
            .filter((e) => (filter?.status ? e.status === filter.status : true))
            .filter((e) => (filter?.submittedBy ? e.submittedBy === filter.submittedBy : true))
            .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    } catch (err) {
        console.warn("Failed to list pending edits:", err);
        return [];
    }
}

export async function updatePendingEdit(
    id: string,
    patch: Partial<Omit<PendingEdit, "id">>
): Promise<PendingEdit | null> {
    const current = await getPendingEdit(id);
    if (!current) return null;
    const updated: PendingEdit = { ...current, ...patch };
    const store = getPendingEditStore();
    await store.setJSON(id, updated);
    return updated;
}

export async function deletePendingEdit(id: string): Promise<void> {
    const store = getPendingEditStore();
    await store.delete(id);
}
