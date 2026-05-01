"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions, getUserAccessToken } from "./auth";
import {
    createPendingEdit,
    listPendingEdits,
    getPendingEdit,
    updatePendingEdit,
    type EditableClassFields,
    type PendingEdit,
} from "./pending-edits";
import { commitMetadataEdit, readClassMetadata } from "./github-commit";
import { validateLayerFile } from "./domain-registry";
import { appendAuditEntry } from "./audit-log";
import { enforceRateLimit } from "./rate-limit";

const ALLOWED_CLASS_ID = /^[A-Z][a-zA-Z0-9]*$/;

// OWL/RDFS terms we refuse to let users co-opt as a label, in any case.
const RESERVED_WORDS = new Set(["thing", "class", "property", "resource", "datatype"]);

const FIELD_LIMITS: Record<keyof EditableClassFields, { max: number; minTrim?: number }> = {
    label_en:      { max: 200 },
    label_zh:      { max: 200 },
    definition_en: { max: 2000 },
    definition_zh: { max: 2000 },
    abstract:      { max: 0 }, // unused
};

function sanitiseFields(input: EditableClassFields): EditableClassFields {
    const out: EditableClassFields = {};
    if (typeof input.label_en === "string") out.label_en = input.label_en.trim().slice(0, FIELD_LIMITS.label_en.max);
    if (typeof input.label_zh === "string") out.label_zh = input.label_zh.trim().slice(0, FIELD_LIMITS.label_zh.max);
    if (typeof input.definition_en === "string") out.definition_en = input.definition_en.trim().slice(0, FIELD_LIMITS.definition_en.max);
    if (typeof input.definition_zh === "string") out.definition_zh = input.definition_zh.trim().slice(0, FIELD_LIMITS.definition_zh.max);
    if (typeof input.abstract === "boolean") out.abstract = input.abstract;
    return out;
}

/**
 * Validate that the patched class entry would still satisfy the structural
 * constraints we care about: required strings non-empty, labels not equal to
 * reserved OWL/RDFS terms.
 *
 * This is JSON-Schema-style validation tailored to the metadata fields the
 * Studio actually edits — full ajv validation against extension_schema is
 * deferred until we let users edit non-metadata fields (parent, id, etc).
 */
function validateAfterFields(
    after: EditableClassFields,
    merged: EditableClassFields
): string | null {
    const labelLike: (keyof EditableClassFields)[] = ["label_en", "label_zh"];
    for (const key of labelLike) {
        const v = merged[key];
        if (typeof v === "string" && RESERVED_WORDS.has(v.trim().toLowerCase())) {
            return `Field '${key}' cannot equal a reserved OWL/RDFS term ('${v.trim()}')`;
        }
    }

    if (typeof merged.label_zh === "string" && merged.label_zh.length === 0) {
        return "Field 'label_zh' must not be empty";
    }
    if (typeof merged.definition_zh === "string" && merged.definition_zh.length === 0) {
        return "Field 'definition_zh' must not be empty";
    }
    if (typeof merged.definition_zh === "string" && merged.definition_zh.length < 5 && merged.definition_zh.length > 0) {
        return "Field 'definition_zh' must be at least 5 characters";
    }

    void after;
    return null;
}

function fieldsEqual(a: EditableClassFields, b: EditableClassFields): boolean {
    const keys: (keyof EditableClassFields)[] = ["label_en", "label_zh", "definition_en", "definition_zh", "abstract"];
    return keys.every((k) => (a[k] ?? "") === (b[k] ?? ""));
}

/**
 * Editor/Admin submits a metadata edit; it lands in Netlify Blobs as "pending".
 */
export async function submitEdit(params: {
    layerFile: string;
    classId: string;
    changes: EditableClassFields;
}): Promise<{ success: boolean; error?: string; editId?: string }> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.login) return { success: false, error: "Not authenticated" };
    const role = session.user.role;
    if (role !== "editor" && role !== "admin") {
        return { success: false, error: "Editor or Admin role required" };
    }
    await enforceRateLimit("edit.submit", session.user.login);

    const layerErr = validateLayerFile(params.layerFile);
    if (layerErr) return { success: false, error: layerErr };
    if (!ALLOWED_CLASS_ID.test(params.classId)) {
        return { success: false, error: "Invalid class ID" };
    }

    const sanitised = sanitiseFields(params.changes);
    if (Object.keys(sanitised).length === 0) {
        return { success: false, error: "No valid fields provided" };
    }

    // Capture "before" snapshot from the live source-of-truth
    const before = await readClassMetadata(params.layerFile, params.classId);
    if (!before) {
        return { success: false, error: `Class '${params.classId}' not found in ${params.layerFile}` };
    }

    // Ownership check: if the class declares an `owner` list, only its
    // members or admins may submit. Otherwise any editor/admin can submit.
    const owners = before.owner ?? [];
    if (owners.length > 0 && role !== "admin") {
        const submitter = session.user.login.toLowerCase();
        const allowed = owners.map((o) => o.toLowerCase()).includes(submitter);
        if (!allowed) {
            return {
                success: false,
                error: `Class '${params.classId}' is owned by [${owners.join(", ")}]; you are not in the owner list.`,
            };
        }
    }

    // L1 edits are admin-only — L1 is the universal core, no per-class owners.
    if (params.layerFile.startsWith("l1-core/") && role !== "admin") {
        return { success: false, error: "L1 Core edits require admin role." };
    }

    // Strip fields that weren't actually changed from what's on master
    const after: EditableClassFields = {};
    for (const key of Object.keys(sanitised) as (keyof EditableClassFields)[]) {
        if ((before[key] ?? "") !== (sanitised[key] ?? "")) {
            after[key] = sanitised[key] as any;
        }
    }
    if (Object.keys(after).length === 0) {
        return { success: false, error: "No effective changes (values match current state)" };
    }

    // Schema-style validation against the merged post-patch class entry.
    const merged: EditableClassFields = {
        label_en: after.label_en ?? before.label_en,
        label_zh: after.label_zh ?? before.label_zh,
        definition_en: after.definition_en ?? before.definition_en,
        definition_zh: after.definition_zh ?? before.definition_zh,
        abstract: after.abstract ?? before.abstract,
    };
    const schemaErr = validateAfterFields(after, merged);
    if (schemaErr) return { success: false, error: schemaErr };

    // Strip the owner field from the snapshot we persist — it's authorization
    // metadata, not part of the editable surface.
    const beforeForRecord: EditableClassFields = {
        label_en: before.label_en,
        label_zh: before.label_zh,
        definition_en: before.definition_en,
        definition_zh: before.definition_zh,
        abstract: before.abstract,
    };

    const edit = await createPendingEdit({
        submittedBy: session.user.login,
        layerFile: params.layerFile,
        targetType: "class",
        targetId: params.classId,
        before: beforeForRecord,
        after,
    });

    await appendAuditEntry({
        actor: session.user.login,
        action: "edit.submit",
        target: `class ${params.classId} in ${params.layerFile}`,
        details: { editId: edit.id, fields: Object.keys(after) },
    });

    revalidatePath("/admin/review");
    return { success: true, editId: edit.id };
}

/**
 * Admin lists pending edits awaiting review.
 */
export async function fetchPendingEdits(): Promise<PendingEdit[]> {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") throw new Error("Admin access required");
    return listPendingEdits({ status: "pending" });
}

/**
 * Lightweight count of pending edits. Returns 0 for non-admins (no error)
 * so the sidebar badge can safely render without surfacing auth errors.
 */
export async function getPendingEditCount(): Promise<number> {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") return 0;
    const edits = await listPendingEdits({ status: "pending" });
    return edits.length;
}

/**
 * Admin approves a pending edit. Uses the admin's own OAuth token to create a branch,
 * commit, and open a PR against the default branch.
 */
export async function approveEdit(editId: string): Promise<{ success: boolean; error?: string; prUrl?: string }> {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") return { success: false, error: "Admin access required" };
    if (!session.user.login) return { success: false, error: "Not authenticated" };
    await enforceRateLimit("edit.approve", session.user.login);

    const accessToken = await getUserAccessToken();
    if (!accessToken) {
        return {
            success: false,
            error: "Your GitHub token is unavailable. Please sign out and sign in again to grant commit access.",
        };
    }

    const edit = await getPendingEdit(editId);
    if (!edit) return { success: false, error: "Edit not found" };
    if (edit.status !== "pending") return { success: false, error: `Edit already ${edit.status}` };

    try {
        const prUrl = await commitMetadataEdit(
            accessToken,
            edit.layerFile,
            edit.targetId,
            edit.after,
            edit.submittedBy
        );
        await updatePendingEdit(editId, {
            status: "approved",
            reviewedBy: session.user.login,
            reviewedAt: new Date().toISOString(),
            prUrl,
        });
        await appendAuditEntry({
            actor: session.user.login,
            action: "edit.approve",
            target: `class ${edit.targetId} in ${edit.layerFile}`,
            details: { editId, prUrl, submittedBy: edit.submittedBy },
        });
        revalidatePath("/admin/review");
        return { success: true, prUrl };
    } catch (err: any) {
        console.error("Approval failed:", err);
        return { success: false, error: err?.message || "Commit failed" };
    }
}

/**
 * Admin rejects a pending edit.
 */
export async function rejectEdit(
    editId: string,
    reason?: string
): Promise<{ success: boolean; error?: string }> {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") return { success: false, error: "Admin access required" };
    if (!session.user.login) return { success: false, error: "Not authenticated" };
    await enforceRateLimit("edit.reject", session.user.login);

    const edit = await getPendingEdit(editId);
    if (!edit) return { success: false, error: "Edit not found" };
    if (edit.status !== "pending") return { success: false, error: `Edit already ${edit.status}` };

    const trimmedReason = reason?.slice(0, 500);
    await updatePendingEdit(editId, {
        status: "rejected",
        reviewedBy: session.user.login,
        reviewedAt: new Date().toISOString(),
        rejectionReason: trimmedReason,
    });
    await appendAuditEntry({
        actor: session.user.login,
        action: "edit.reject",
        target: `class ${edit.targetId} in ${edit.layerFile}`,
        details: { editId, submittedBy: edit.submittedBy, reason: trimmedReason },
    });
    revalidatePath("/admin/review");
    return { success: true };
}

// Keep `fieldsEqual` exported-shape-stable in case callers rely on it.
void fieldsEqual;
