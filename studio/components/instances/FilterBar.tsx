/**
 * URL-driven filter bar — no client JS state. Each option is a `<Link>`
 * to the same page with mutated search params, so SSR handles everything.
 *
 * Why no client state? PR-1 is the first cross-service integration; the
 * fewer moving parts the better. We can upgrade to a client component
 * with debounced search later if list grows large.
 */
import Link from "next/link";

type SearchParams = {
    layer?: string;
    type?: string;
    status?: string;
    q?: string;
};

const LAYERS: { id: string; label: string }[] = [
    { id: "", label: "All layers" },
    { id: "L1_universal_organization_ontology", label: "L1 Core" },
    { id: "L2_consulting_industry_extension", label: "L2 Consulting" },
    { id: "L2_financial_services_extension", label: "L2 Financial" },
    { id: "L2_fnb_industry_extension", label: "L2 F&B" },
    { id: "L2_healthcare_extension", label: "L2 Healthcare" },
    { id: "L2_luxury_goods_extension", label: "L2 Luxury" },
    { id: "L2_manufacturing_extension", label: "L2 Manufacturing" },
    { id: "L2_technology_extension", label: "L2 Technology" },
    { id: "L3_enterprise_customization", label: "L3 Enterprise" },
];

const STATUSES: { id: string; label: string }[] = [
    { id: "", label: "Any status" },
    { id: "candidate", label: "Candidate" },
    { id: "accepted", label: "Accepted" },
    { id: "rejected", label: "Rejected" },
    { id: "archived", label: "Archived" },
];

function buildHref(base: SearchParams, override: Partial<SearchParams>): string {
    const merged = { ...base, ...override };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
        if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/instances?${qs}` : "/instances";
}

export function FilterBar({ current }: { current: SearchParams }) {
    return (
        <div className="space-y-4 mb-6">
            {/* Layer filter */}
            <div>
                <div className="text-xs uppercase tracking-wider text-[#666] mb-2">Layer</div>
                <div className="flex flex-wrap gap-2">
                    {LAYERS.map((l) => {
                        const active = (current.layer ?? "") === l.id;
                        return (
                            <Link
                                key={l.id}
                                href={buildHref(current, { layer: l.id || undefined })}
                                className={`px-3 py-1 rounded-md border text-xs transition-colors ${
                                    active
                                        ? "bg-deloitte-green text-black border-deloitte-green font-medium"
                                        : "bg-[#111] border-[#333] text-[#A0A0A0] hover:border-deloitte-green/50 hover:text-white"
                                }`}
                            >
                                {l.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Status filter */}
            <div>
                <div className="text-xs uppercase tracking-wider text-[#666] mb-2">Status</div>
                <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => {
                        const active = (current.status ?? "") === s.id;
                        return (
                            <Link
                                key={s.id}
                                href={buildHref(current, { status: s.id || undefined })}
                                className={`px-3 py-1 rounded-md border text-xs transition-colors ${
                                    active
                                        ? "bg-deloitte-green text-black border-deloitte-green font-medium"
                                        : "bg-[#111] border-[#333] text-[#A0A0A0] hover:border-deloitte-green/50 hover:text-white"
                                }`}
                            >
                                {s.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Search box — uses GET form so it stays SSR */}
            <form action="/instances" method="GET" className="flex gap-2">
                {/* Preserve other filters as hidden inputs */}
                {current.layer && <input type="hidden" name="layer" value={current.layer} />}
                {current.status && <input type="hidden" name="status" value={current.status} />}
                {current.type && <input type="hidden" name="type" value={current.type} />}
                <input
                    type="search"
                    name="q"
                    defaultValue={current.q ?? ""}
                    placeholder="Search labels (English / 中文)…"
                    className="flex-1 bg-[#111] border border-[#333] rounded-md px-3 py-2 text-sm text-white placeholder-[#666] focus:outline-none focus:border-deloitte-green"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#222] border border-[#333] rounded-md text-sm text-white hover:bg-[#2a2a2a] hover:border-deloitte-green/50 transition-colors"
                >
                    Search
                </button>
                {(current.q || current.layer || current.status || current.type) && (
                    <Link
                        href="/instances"
                        className="px-4 py-2 bg-transparent border border-[#333] rounded-md text-sm text-[#A0A0A0] hover:text-red-400 hover:border-red-900 transition-colors"
                    >
                        Clear
                    </Link>
                )}
            </form>
        </div>
    );
}
