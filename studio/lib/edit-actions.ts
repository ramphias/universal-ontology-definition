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

const ALLOWED_LAYER_FILE = /^(l1-core|l2-extensions\/[a-z0-9-]+|l3-enterprise\/[a-z0-9-]+)\/[a-z0-9_]+\.json$/;
const ALLOWED_CLASS_ID = /^[A-Z][a-zA-Z0-9]*$/;

function sanitiseFields(input: EditableClassFields): EditableClassFields {
    const out: EditableClassFields = {};
    if (typeof input.label_en === "string") out.label_en = input.label_en.trim().slice(0, 200);
    if (typeof input.label_zh === "string") out.label_zh = input.label_zh.trim().slice(0, 200);
    if (typeof input.definition_en === "string") out.definition_en = input.definition_en.trim().slice(0, 2000);
    if (typeof input.definition_zh === "string") out.definition_zh = input.definition_zh.trim().slice(0, 2000);
    if (typeof input.abstract === "boolean") out.abstract = input.abstract;
    return out;
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
    if (session.user.role !== "editor" && session.user.role !== "admin") {
        return { success: false, error: "Editor or Admin role required" };
    }
    if (!ALLOWED_LAYER_FILE.test(params.layerFile)) {
        return { success: false, error: "Invalid layer file path" };
    }
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

    const edit = await createPendingEdit({
        submittedBy: session.user.login,
        layerFile: params.layerFile,
        targetType: "class",
        targetId: params.classId,
        before,
        after,
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
        console.log(`[AUDIT] Edit ${editId} approved by @${session.user.login} → PR ${prUrl}`);
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

    const edit = await getPendingEdit(editId);
    if (!edit) return { success: false, error: "Edit not found" };
    if (edit.status !== "pending") return { success: false, error: `Edit already ${edit.status}` };

    await updatePendingEdit(editId, {
        status: "rejected",
        reviewedBy: session.user.login,
        reviewedAt: new Date().toISOString(),
        rejectionReason: reason?.slice(0, 500),
    });
    console.log(`[AUDIT] Edit ${editId} rejected by @${session.user.login}`);
    revalidatePath("/admin/review");
    return { success: true };
}
