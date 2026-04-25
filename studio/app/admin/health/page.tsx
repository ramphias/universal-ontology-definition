import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { computeHealthReport, type FileReport } from "@/lib/health";

export const dynamic = "force-dynamic";

export default async function HealthPage() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
                <p className="text-[#888]">Admin role required.</p>
            </div>
        );
    }

    const report = computeHealthReport();
    const a = report.aggregate;

    const cards: { label: string; value: number; tone?: "warn" | "ok" }[] = [
        { label: "Total classes",            value: a.total_classes,           tone: "ok" },
        { label: "Total relations",          value: a.total_relations,         tone: "ok" },
        { label: "Orphan classes",           value: a.total_orphans,           tone: a.total_orphans > 0 ? "warn" : "ok" },
        { label: "Unreferenced relations",   value: a.total_unused_relations,  tone: a.total_unused_relations > 0 ? "warn" : "ok" },
        { label: "Max inheritance depth",    value: a.max_inheritance_depth,   tone: "ok" },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8 border-b border-[#333] pb-6">
                <h1 className="text-2xl font-bold mb-2">Ontology Health</h1>
                <p className="text-sm text-[#888]">
                    Snapshot of every ontology file in the repository. Same data shape as{" "}
                    <code className="text-[#aaa]">scripts/health_report.py</code>; computed at request time.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {cards.map((c) => (
                    <div
                        key={c.label}
                        className={`bg-[#111] border rounded p-4 ${
                            c.tone === "warn" ? "border-yellow-500/40" : "border-[#333]"
                        }`}
                    >
                        <div className="text-xs text-[#888] mb-1">{c.label}</div>
                        <div className={`text-2xl font-bold ${c.tone === "warn" ? "text-yellow-400" : "text-white"}`}>
                            {c.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#111] border border-[#333] rounded">
                <div className="border-b border-[#333] px-4 py-3 text-sm font-semibold">
                    Per-file breakdown ({a.files} files)
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="text-[#888]">
                            <tr className="border-b border-[#222]">
                                <th className="text-left px-3 py-2 font-medium">File</th>
                                <th className="text-right px-3 py-2 font-medium">Classes</th>
                                <th className="text-right px-3 py-2 font-medium">Abstract</th>
                                <th className="text-right px-3 py-2 font-medium">Relations</th>
                                <th className="text-right px-3 py-2 font-medium">Axioms</th>
                                <th className="text-right px-3 py-2 font-medium">Instances</th>
                                <th className="text-right px-3 py-2 font-medium">Orphans</th>
                                <th className="text-right px-3 py-2 font-medium">Unused rel.</th>
                                <th className="text-right px-3 py-2 font-medium">Max depth</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono">
                            {report.files.map((f) => (
                                <FileRow key={f.file} f={f} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <details className="mt-6">
                <summary className="text-xs text-[#666] cursor-pointer hover:text-[#aaa]">
                    Raw JSON
                </summary>
                <pre className="mt-2 bg-[#0A0A0A] border border-[#222] rounded p-3 text-xs overflow-x-auto text-[#aaa]">
                    {JSON.stringify(report, null, 2)}
                </pre>
            </details>
        </div>
    );
}

function FileRow({ f }: { f: FileReport }) {
    const warn = f.orphans.length > 0;
    return (
        <tr className="border-b border-[#1a1a1a]">
            <td className="px-3 py-2 text-[#aaa]">{f.file}</td>
            <td className="px-3 py-2 text-right">{f.class_count}</td>
            <td className="px-3 py-2 text-right text-[#888]">{f.abstract_count}</td>
            <td className="px-3 py-2 text-right">{f.relation_count}</td>
            <td className="px-3 py-2 text-right text-[#888]">{f.axiom_count}</td>
            <td className="px-3 py-2 text-right text-[#888]">{f.instance_count}</td>
            <td className={`px-3 py-2 text-right ${warn ? "text-yellow-400" : "text-[#666]"}`}>{f.orphans.length}</td>
            <td className="px-3 py-2 text-right text-[#666]">{f.unused_relations.length}</td>
            <td className="px-3 py-2 text-right text-[#888]">{f.max_inheritance_depth}</td>
        </tr>
    );
}
