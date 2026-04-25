import fs from "fs";
import path from "path";

/**
 * TS port of `scripts/health_report.py`. Both produce the same JSON shape
 * (see `HealthReport`). The Python script is the canonical CLI/CI tool;
 * this file lets the Studio render the same metrics at request time without
 * shelling out to Python or coupling to a build-time JSON file.
 *
 * If you change one, change the other. The JSON shape is the contract.
 */

const PROJECT_ROOT = path.resolve(process.cwd(), "..");

export type FileReport = {
    file: string;
    layer: string;
    class_count: number;
    abstract_count: number;
    concrete_count: number;
    relation_count: number;
    axiom_count: number;
    instance_count: number;
    orphans: { class: string; missing_parent: string }[];
    unused_relations: string[];
    max_inheritance_depth: number;
    depth_chain: string[];
};

export type HealthReport = {
    schema_version: 1;
    aggregate: {
        files: number;
        total_classes: number;
        total_abstract: number;
        total_concrete: number;
        total_relations: number;
        total_axioms: number;
        total_instances: number;
        total_orphans: number;
        total_unused_relations: number;
        max_inheritance_depth: number;
    };
    files: FileReport[];
};

type AnyClass = { id?: string; parent?: string; abstract?: boolean };
type AnyRel = { id?: string; inverse_of?: string; parent_relation?: string };
type AnyAxiom = { relation?: string; parent_relation?: string };
type Ontology = {
    layer?: string;
    metadata?: { layer?: string };
    extends?: string | string[];
    classes?: AnyClass[];
    relations?: AnyRel[];
    axioms?: AnyAxiom[];
    sample_instances?: unknown[];
};

const PATTERNS = [
    "l1-core",
    "l2-extensions",
    "l3-enterprise",
    "private_enterprise",
];

function listOntologyFiles(): string[] {
    const out: string[] = [];
    for (const dir of PATTERNS) {
        const root = path.join(PROJECT_ROOT, dir);
        if (!fs.existsSync(root)) continue;
        // single-level (l1-core) and two-level (l2-extensions/<dom>/) layouts
        for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
            if (entry.name.startsWith("_")) continue;
            const full = path.join(root, entry.name);
            if (entry.isFile() && entry.name.endsWith(".json")) {
                if (!entry.name.includes("schema") && !entry.name.toLowerCase().includes("template")) {
                    out.push(full);
                }
            } else if (entry.isDirectory()) {
                for (const inner of fs.readdirSync(full, { withFileTypes: true })) {
                    if (inner.isFile() && inner.name.endsWith(".json") &&
                        !inner.name.startsWith("_") && !inner.name.includes("schema") &&
                        !inner.name.toLowerCase().includes("template")) {
                        out.push(path.join(full, inner.name));
                    }
                }
            }
        }
    }
    return out;
}

function loadJson(p: string): Ontology | null {
    try {
        const raw = fs.readFileSync(p, "utf-8");
        return JSON.parse(raw) as Ontology;
    } catch {
        return null;
    }
}

function isOntology(d: Ontology | null): d is Ontology {
    if (!d || typeof d !== "object") return false;
    const layer = d.layer || d.metadata?.layer || "";
    return typeof layer === "string" && /^L[123]_/.test(layer);
}

function matchLayerRef(ref: string, keys: Iterable<string>): string | null {
    const arr = Array.from(keys);
    if (arr.includes(ref)) return ref;
    const refBase = ref.includes("_v") ? ref.split("_v").slice(0, -1).join("_v") : ref;
    for (const key of arr) {
        const keyBase = key.includes("_v") ? key.split("_v").slice(0, -1).join("_v") : key;
        if (refBase === keyBase || ref.startsWith(key.slice(0, 15)) || key.startsWith(ref.slice(0, 15))) {
            return key;
        }
    }
    return null;
}

function buildIndex(ontologies: Ontology[]): Map<string, Ontology> {
    const idx = new Map<string, Ontology>();
    for (const o of ontologies) {
        const layer = o.layer || o.metadata?.layer || "";
        if (layer) idx.set(layer, o);
    }
    return idx;
}

function visibleClasses(target: Ontology, index: Map<string, Ontology>): Map<string, AnyClass> {
    const classes = new Map<string, AnyClass>();
    const ext = target.extends;
    const queue: string[] = Array.isArray(ext) ? [...ext] : ext ? [ext] : [];
    const seen = new Set<string>();

    while (queue.length) {
        const ref = queue.shift()!;
        if (seen.has(ref)) continue;
        seen.add(ref);
        const matched = matchLayerRef(ref, index.keys());
        if (!matched) continue;
        const dep = index.get(matched)!;
        for (const c of dep.classes ?? []) {
            if (c.id && !classes.has(c.id)) classes.set(c.id, c);
        }
        const subExt = dep.extends;
        const subList = Array.isArray(subExt) ? subExt : subExt ? [subExt] : [];
        queue.push(...subList);
    }
    for (const c of target.classes ?? []) {
        if (c.id) classes.set(c.id, c);
    }
    return classes;
}

function computeFileReport(p: string, index: Map<string, Ontology>): FileReport | null {
    const data = loadJson(p);
    if (!isOntology(data)) return null;

    const layer = data.layer || data.metadata?.layer || "";
    const classes = data.classes ?? [];
    const abstract_count = classes.filter((c) => c.abstract).length;
    const concrete_count = classes.length - abstract_count;

    const visible = visibleClasses(data, index);

    const orphans: FileReport["orphans"] = [];
    for (const c of classes) {
        if (c.parent && !visible.has(c.parent)) {
            orphans.push({ class: c.id || "", missing_parent: c.parent });
        }
    }

    const relations = data.relations ?? [];
    const relIds = new Set(relations.map((r) => r.id).filter((x): x is string => !!x));
    const referenced = new Set<string>();
    for (const r of relations) {
        for (const k of ["inverse_of", "parent_relation"] as const) {
            const v = r[k];
            if (typeof v === "string" && relIds.has(v)) referenced.add(v);
        }
    }
    for (const ax of data.axioms ?? []) {
        for (const k of ["relation", "parent_relation"] as const) {
            const v = ax[k];
            if (typeof v === "string" && relIds.has(v)) referenced.add(v);
        }
    }
    const unused_relations = Array.from(relIds).filter((id) => !referenced.has(id)).sort();

    let bestLen = 0;
    let bestChain: string[] = [];
    for (const c of classes) {
        if (!c.id) continue;
        const chain = [c.id];
        const seen = new Set([c.id]);
        let cur = visible.get(c.id)?.parent;
        while (cur && visible.has(cur) && !seen.has(cur)) {
            chain.push(cur);
            seen.add(cur);
            cur = visible.get(cur)?.parent;
        }
        if (chain.length > bestLen) {
            bestLen = chain.length;
            bestChain = chain;
        }
    }

    return {
        file: path.relative(PROJECT_ROOT, p).split(path.sep).join("/"),
        layer,
        class_count: classes.length,
        abstract_count,
        concrete_count,
        relation_count: relations.length,
        axiom_count: (data.axioms ?? []).length,
        instance_count: (data.sample_instances ?? []).length,
        orphans,
        unused_relations,
        max_inheritance_depth: bestLen,
        depth_chain: bestChain,
    };
}

export function computeHealthReport(): HealthReport {
    const paths = listOntologyFiles();
    const ontologies = paths.map(loadJson).filter(isOntology);
    const index = buildIndex(ontologies);

    const fileReports: FileReport[] = [];
    for (const p of paths) {
        const r = computeFileReport(p, index);
        if (r) fileReports.push(r);
    }

    const aggregate = {
        files: fileReports.length,
        total_classes: fileReports.reduce((s, r) => s + r.class_count, 0),
        total_abstract: fileReports.reduce((s, r) => s + r.abstract_count, 0),
        total_concrete: fileReports.reduce((s, r) => s + r.concrete_count, 0),
        total_relations: fileReports.reduce((s, r) => s + r.relation_count, 0),
        total_axioms: fileReports.reduce((s, r) => s + r.axiom_count, 0),
        total_instances: fileReports.reduce((s, r) => s + r.instance_count, 0),
        total_orphans: fileReports.reduce((s, r) => s + r.orphans.length, 0),
        total_unused_relations: fileReports.reduce((s, r) => s + r.unused_relations.length, 0),
        max_inheritance_depth: fileReports.reduce((m, r) => Math.max(m, r.max_inheritance_depth), 0),
    };

    return { schema_version: 1, aggregate, files: fileReports };
}
