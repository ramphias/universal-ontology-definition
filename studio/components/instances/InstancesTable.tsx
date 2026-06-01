/**
 * Server-rendered instances table. No client JS — keeps PR-1 minimal.
 */
import Link from "next/link";
import type { InstanceList, InstanceStatus } from "@/lib/backend";

const STATUS_CLASS: Record<InstanceStatus, string> = {
    candidate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    accepted: "bg-deloitte-green/15 text-deloitte-green border-deloitte-green/30",
    rejected: "bg-red-500/10 text-red-400 border-red-500/30",
    archived: "bg-[#222] text-[#666] border-[#444]",
};

const SOURCE_CLASS: Record<string, string> = {
    manual: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    wikidata: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    dbpedia: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    sec_edgar: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    openalex: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    llm_extracted: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30",
    other: "bg-[#222] text-[#A0A0A0] border-[#444]",
};

function StatusBadge({ status }: { status: InstanceStatus }) {
    return (
        <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] border font-medium ${STATUS_CLASS[status]}`}
        >
            {status}
        </span>
    );
}

function SourceBadge({ source }: { source: string }) {
    const cls = SOURCE_CLASS[source] ?? SOURCE_CLASS.other;
    return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] border font-mono ${cls}`}>
            {source}
        </span>
    );
}

function ConfidenceMeter({ value }: { value: number | null }) {
    if (value === null) return <span className="text-[#666] text-xs">—</span>;
    const pct = Math.round(value * 100);
    const tone =
        pct >= 90 ? "bg-deloitte-green" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
    return (
        <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-[#222] rounded-full overflow-hidden">
                <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-[#A0A0A0] tabular-nums">{pct}%</span>
        </div>
    );
}

export function InstancesTable({ result }: { result: InstanceList }) {
    const { items, total, limit, offset } = result;

    if (items.length === 0) {
        return (
            <div className="text-center py-16 border border-[#333] rounded-lg bg-surface">
                <div className="text-[#666] text-sm">
                    No instances match the current filters.
                </div>
                <Link
                    href="/instances"
                    className="inline-block mt-4 text-xs text-deloitte-green hover:underline"
                >
                    Clear filters →
                </Link>
            </div>
        );
    }

    return (
        <div className="border border-[#333] rounded-lg bg-surface overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-[#0f0f0f] text-left border-b border-[#333]">
                        <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                            Instance
                        </th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                            Type
                        </th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                            Layer
                        </th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                            Status
                        </th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                            Source
                        </th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                            Confidence
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-[#161616] transition-colors">
                            <td className="px-4 py-3">
                                <div className="text-white font-medium">
                                    {item.label_en ?? item.label_zh ?? item.id}
                                </div>
                                {item.label_zh && item.label_en && (
                                    <div className="text-xs text-[#A0A0A0] mt-0.5">
                                        {item.label_zh}
                                    </div>
                                )}
                                <div className="text-[10px] text-[#666] font-mono mt-1">
                                    {item.id}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <code className="text-xs text-[#A0A0A0] bg-[#111] px-2 py-0.5 rounded">
                                    {item.type}
                                </code>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-[#A0A0A0] font-mono">
                                    {item.layer.replace(/^L\d_/, "").replace(/_extension$/, "").replace(/_/g, " ")}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={item.status} />
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                    <SourceBadge source={item.source} />
                                    {item.source_url && (
                                        <a
                                            href={item.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-deloitte-green hover:underline truncate max-w-[180px]"
                                        >
                                            citation ↗
                                        </a>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <ConfidenceMeter value={item.confidence} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination footer */}
            <div className="px-4 py-3 border-t border-[#333] bg-[#0f0f0f] flex justify-between items-center text-xs text-[#A0A0A0]">
                <span>
                    Showing {offset + 1}–{Math.min(offset + items.length, total)} of {total}
                </span>
                <span className="text-[#666]">
                    {limit} per page · Phase A.3 PR-1 (read-only)
                </span>
            </div>
        </div>
    );
}
