"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { fetchPendingEdits, approveEdit, rejectEdit } from "@/lib/edit-actions";
import type { PendingEdit, EditableClassFields } from "@/lib/pending-edits";
import { Check, X, ExternalLink, Loader } from "lucide-react";
import JsonDiffViewer from "@/components/admin/JsonDiffViewer";

const FIELD_ORDER: (keyof EditableClassFields)[] = [
    "label_en",
    "label_zh",
    "definition_en",
    "definition_zh",
    "abstract",
];

export default function ReviewPage() {
    const { data: session } = useSession();
    const [edits, setEdits] = useState<PendingEdit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();
    const [actionResult, setActionResult] = useState<{ id: string; kind: "success" | "error"; message: string; prUrl?: string } | null>(null);

    const loadEdits = () => {
        setLoading(true);
        fetchPendingEdits()
            .then((rows) => {
                setEdits(rows);
                setError("");
            })
            .catch((err: any) => setError(err?.message || "Failed to load"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadEdits();
    }, []);

    if (session?.user?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
                <p className="text-[#888]">You must be a Super Admin to view this page.</p>
            </div>
        );
    }

    const handleApprove = (editId: string) => {
        startTransition(async () => {
            const res = await approveEdit(editId);
            if (res.success) {
                setActionResult({ id: editId, kind: "success", message: "Approved & PR opened", prUrl: res.prUrl });
                loadEdits();
            } else {
                setActionResult({ id: editId, kind: "error", message: res.error || "Approval failed" });
            }
        });
    };

    const handleReject = (editId: string) => {
        const reason = window.prompt("Reject reason (optional):") || undefined;
        startTransition(async () => {
            const res = await rejectEdit(editId, reason);
            if (res.success) {
                setActionResult({ id: editId, kind: "success", message: "Rejected" });
                loadEdits();
            } else {
                setActionResult({ id: editId, kind: "error", message: res.error || "Rejection failed" });
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8 border-b border-[#333] pb-6">
                <h1 className="text-2xl font-bold mb-2">Review Queue</h1>
                <p className="text-sm text-[#888]">
                    Pending metadata edits submitted by editors. Approving commits on your behalf to a new branch and opens a pull request.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6 text-sm">
                    {error}
                </div>
            )}

            {actionResult && (
                <div
                    className={`border p-4 rounded mb-6 text-sm ${
                        actionResult.kind === "success"
                            ? "bg-deloitte-green/10 border-deloitte-green/40 text-deloitte-green"
                            : "bg-red-500/10 border-red-500 text-red-500"
                    }`}
                >
                    {actionResult.message}
                    {actionResult.prUrl && (
                        <a
                            href={actionResult.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 underline inline-flex items-center gap-1"
                        >
                            View PR <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            )}

            {loading ? (
                <div className="text-center text-[#888] py-12">Loading review queue…</div>
            ) : edits.length === 0 ? (
                <div className="text-center text-[#888] py-12 border border-[#333] rounded bg-[#111]">
                    No pending edits. 🎉
                </div>
            ) : (
                <div className="space-y-4">
                    {edits.map((edit) => (
                        <ReviewCard
                            key={edit.id}
                            edit={edit}
                            onApprove={() => handleApprove(edit.id)}
                            onReject={() => handleReject(edit.id)}
                            disabled={pending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ReviewCard({
    edit,
    onApprove,
    onReject,
    disabled,
}: {
    edit: PendingEdit;
    onApprove: () => void;
    onReject: () => void;
    disabled: boolean;
}) {
    return (
        <div className="bg-[#111] border border-[#333] rounded p-5">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="text-xs text-[#888] mb-1 font-mono">{edit.layerFile}</div>
                    <h3 className="text-lg font-semibold text-white">
                        <span className="text-deloitte-green">class</span> {edit.targetId}
                    </h3>
                    <div className="text-xs text-[#666] mt-1">
                        Submitted by <span className="text-white">@{edit.submittedBy}</span> · {new Date(edit.submittedAt).toLocaleString()}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onApprove}
                        disabled={disabled}
                        className="px-4 py-2 bg-deloitte-green text-black font-semibold rounded text-sm hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
                    >
                        {disabled ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Approve
                    </button>
                    <button
                        onClick={onReject}
                        disabled={disabled}
                        className="px-4 py-2 bg-transparent border border-red-500/50 text-red-500 rounded text-sm hover:bg-red-500/10 disabled:opacity-50 flex items-center gap-2"
                    >
                        <X className="w-3.5 h-3.5" /> Reject
                    </button>
                </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#222] rounded p-4 space-y-2">
                {FIELD_ORDER.filter((f) => edit.after[f] !== undefined).map((field) => (
                    <DiffRow
                        key={field}
                        field={field}
                        before={edit.before[field]}
                        after={edit.after[field]}
                    />
                ))}
            </div>

            <details className="mt-3">
                <summary className="text-xs text-[#666] cursor-pointer hover:text-[#aaa]">
                    Structural JSON diff
                </summary>
                <div className="mt-2">
                    <JsonDiffViewer
                        before={edit.before}
                        after={mergedAfter(edit.before, edit.after)}
                    />
                </div>
            </details>
        </div>
    );
}

function mergedAfter(before: EditableClassFields, after: EditableClassFields): EditableClassFields {
    return { ...before, ...after };
}

function DiffRow({ field, before, after }: { field: string; before: any; after: any }) {
    const renderValue = (v: any) =>
        typeof v === "boolean" ? (v ? "true" : "false") : v || <span className="text-[#555] italic">empty</span>;
    return (
        <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
            <div className="text-xs text-[#666] font-mono pt-1">{field}</div>
            <div className="space-y-1">
                <div className="bg-red-500/10 border-l-2 border-red-500/40 px-3 py-1.5 rounded text-red-300 line-through decoration-red-500/30">
                    {renderValue(before)}
                </div>
                <div className="bg-deloitte-green/10 border-l-2 border-deloitte-green/40 px-3 py-1.5 rounded text-deloitte-green">
                    {renderValue(after)}
                </div>
            </div>
        </div>
    );
}
