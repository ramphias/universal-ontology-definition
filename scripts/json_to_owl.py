#!/usr/bin/env python3
"""
json_to_owl.py — Universal Ontology JSON → OWL/RDF Turtle Converter

Converts any L1/L2/L3 JSON ontology file to OWL 2 Turtle (.ttl) format.
Generated .ttl files can be directly imported into Protégé, TopBraid, Stardog, etc.

Usage:
    python scripts/json_to_owl.py                          # Convert ALL ontology JSONs
    python scripts/json_to_owl.py core/universal_ontology_v1.json   # Convert single file
"""

import json
import sys
import os
import glob
import io
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ─── Namespace Registry ──────────────────────────────────────────────────────

BASE_URI = "https://w3id.org/uod"

LAYER_NS = {
    "L1_universal_organization_ontology": ("uod", f"{BASE_URI}/core/"),
    "L2_luxury_goods_addon": ("uod-lux", f"{BASE_URI}/addon/luxury-goods/"),
    "L2_consulting_industry_addon": ("uod-con", f"{BASE_URI}/addon/consulting/"),
    "L2_common_enterprise_addon": ("uod-cmn", f"{BASE_URI}/addon/common/"),
}

STANDARD_PREFIXES = [
    ("owl", "http://www.w3.org/2002/07/owl#"),
    ("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    ("rdfs", "http://www.w3.org/2000/01/rdf-schema#"),
    ("xsd", "http://www.w3.org/2001/XMLSchema#"),
    ("skos", "http://www.w3.org/2004/02/skos/core#"),
]

# L1 Core class IDs (used for cross-layer reference resolution)
L1_CLASSES = {
    "Entity", "Party", "Person", "Organization", "OrgUnit",
    "Resource", "ProductService", "Asset", "DataObject", "Document",
    "SystemApplication", "Governance", "Policy", "Rule", "Control", "Risk",
    "Operational", "Role", "Capability", "Process", "Event",
    "Measurement", "Goal", "KPI",
}

L1_RELATIONS = {
    "plays_role", "part_of", "owns", "accountable_for", "realized_by",
    "consumes", "produces", "recorded_in", "governed_by", "mitigated_by",
    "triggered_by", "measured_by",
}


# ─── Layer Detection ─────────────────────────────────────────────────────────

def detect_layer(data):
    """Detect ontology layer from JSON content."""
    layer = data.get("layer")
    if not layer:
        meta = data.get("metadata", {})
        layer = meta.get("layer", "")
    return layer or ""


def get_namespace_for_layer(layer, data=None):
    """Get (prefix, uri) for a given layer identifier."""
    if layer in LAYER_NS:
        return LAYER_NS[layer]
    if layer == "L3_enterprise_customization" and data:
        ent = data.get("enterprise", {})
        eid = ent.get("id", "unknown").lower().replace("_", "-")
        return (f"ent", f"{BASE_URI}/enterprise/{eid}/")
    return ("uod", f"{BASE_URI}/core/")


def get_extends_namespaces(data):
    """Get namespace prefixes for all extended layers."""
    import re as _re
    extends = data.get("extends", [])
    if isinstance(extends, str):
        extends = [extends]
    result = []
    for ext in extends:
        # Step 1: exact match
        if ext in LAYER_NS:
            result.append(LAYER_NS[ext])
            continue
        # Step 2: strip trailing version suffix (_v1, _v2, _v1.0, etc.) then exact match
        ext_stripped = _re.sub(r'[_\-]v\d+(\.\d+)*$', '', ext)
        if ext_stripped in LAYER_NS:
            result.append(LAYER_NS[ext_stripped])
            continue
        # Step 3: find the LAYER_NS key that is a prefix of ext (longest match wins)
        best = None
        best_len = 0
        for layer_id in LAYER_NS:
            if ext.startswith(layer_id) and len(layer_id) > best_len:
                best = layer_id
                best_len = len(layer_id)
        if best:
            result.append(LAYER_NS[best])
            continue
        # Step 4: fallback guess from L-level prefix
        ext_key = ext
        if ext_key in LAYER_NS:
            result.append(LAYER_NS[ext_key])
        else:
            # Guess from layer prefix
            if ext.startswith("L1"):
                result.append(("uod", f"{BASE_URI}/core/"))
            elif ext.startswith("L2"):
                slug = ext.replace("L2_", "").replace("_addon", "").replace("_", "-")
                result.append((f"uod-{slug[:6]}", f"{BASE_URI}/addon/{slug}/"))
    return result


# ─── Class Registry (cross-layer resolution) ────────────────────────────────

def build_class_registry(project_root):
    """Scan all JSON ontology files to build a class→namespace registry."""
    registry = {}
    # L1 core
    for cls_id in L1_CLASSES:
        registry[cls_id] = ("uod", f"{BASE_URI}/core/")

    # Scan addon files
    addon_pattern = os.path.join(project_root, "extensions", "*", "*.json")
    for fpath in glob.glob(addon_pattern):
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                d = json.load(f)
            layer = detect_layer(d)
            ns = get_namespace_for_layer(layer, d)
            for cls in d.get("classes", []):
                registry[cls["id"]] = ns
        except Exception:
            pass

    return registry


# ─── Turtle Generation ───────────────────────────────────────────────────────

def escape_turtle(s):
    """Escape special characters for Turtle string literals."""
    if not s:
        return ""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def resolve_class_ref(cls_id, local_classes, local_ns, registry):
    """Resolve a class ID to its prefixed name (e.g. uod:Entity)."""
    if cls_id in local_classes:
        return f"{local_ns[0]}:{cls_id}"
    if cls_id in registry:
        ns = registry[cls_id]
        return f"{ns[0]}:{cls_id}"
    # Fallback: assume core
    return f"uod:{cls_id}"


def generate_turtle(data, project_root):
    """Generate OWL 2 Turtle string from JSON ontology data."""
    layer = detect_layer(data)
    local_ns = get_namespace_for_layer(layer, data)
    extends_ns = get_extends_namespaces(data)
    registry = build_class_registry(project_root)

    # Collect local class IDs
    local_classes = {c["id"] for c in data.get("classes", [])}

    # Also register local classes for self-reference
    for cls_id in local_classes:
        registry[cls_id] = local_ns

    lines = []

    # ── Prefixes ──
    all_ns = dict(STANDARD_PREFIXES)
    all_ns[local_ns[0]] = local_ns[1]
    all_ns["uod"] = f"{BASE_URI}/core/"  # always include core
    for prefix, uri in extends_ns:
        all_ns[prefix] = uri

    for prefix, uri in sorted(all_ns.items()):
        lines.append(f"@prefix {prefix}: <{uri}> .")
    lines.append("")

    # ── Ontology Header ──
    meta = data.get("metadata", {})
    version = data.get("version", meta.get("version", "1.0.0"))
    name = ""
    if "enterprise" in data:
        name = data["enterprise"].get("name", "Enterprise Ontology")
    elif "metadata" in data:
        name = meta.get("name", "Ontology")
    else:
        desc = data.get("description_en", data.get("description", ""))
        name = desc[:60] if desc else "Ontology"

    lines.append("# " + "═" * 76)
    lines.append(f"# {name} — OWL 2 / RDF Turtle")
    lines.append(f"# Auto-generated from JSON by json_to_owl.py on {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("# " + "═" * 76)
    lines.append("")

    lines.append(f"{local_ns[0]}:Ontology a owl:Ontology ;")
    lines.append(f'    rdfs:label "{escape_turtle(name)}"@en ;')
    desc_zh = data.get("description", meta.get("description", ""))
    if desc_zh:
        lines.append(f'    rdfs:label "{escape_turtle(desc_zh)}"@zh ;')

    # owl:imports
    for prefix, uri in extends_ns:
        lines.append(f"    owl:imports <{uri}> ;")

    lines.append(f'    owl:versionInfo "{version}" .')
    lines.append("")

    # ── Classes ──
    classes = data.get("classes", [])
    if classes:
        lines.append("# " + "─" * 40)
        lines.append("# CLASSES")
        lines.append("# " + "─" * 40)
        lines.append("")

    for cls in classes:
        cid = cls["id"]
        full_id = f"{local_ns[0]}:{cid}"
        lines.append(f"{full_id} a owl:Class ;")

        parent = cls.get("parent")
        if parent:
            parent_ref = resolve_class_ref(parent, local_classes, local_ns, registry)
            lines.append(f"    rdfs:subClassOf {parent_ref} ;")

        label_en = cls.get("label_en", cid)
        label_zh = cls.get("label_zh", "")
        lines.append(f'    rdfs:label "{escape_turtle(label_en)}"@en ;')
        if label_zh:
            lines.append(f'    rdfs:label "{escape_turtle(label_zh)}"@zh ;')

        def_en = cls.get("definition_en", "")
        def_zh = cls.get("definition", "")
        if def_en:
            lines.append(f'    rdfs:comment "{escape_turtle(def_en)}"@en ;')
        if def_zh:
            lines.append(f'    rdfs:comment "{escape_turtle(def_zh)}"@zh ;')

        if cls.get("abstract"):
            lines.append(f'    uod:abstract "true"^^xsd:boolean ;')

        # Remove trailing semicolon, add period
        lines[-1] = lines[-1].rstrip(" ;") + " ."
        lines.append("")

    # ── Deprecated Classes ──
    deprecated = data.get("deprecated_classes", [])
    if deprecated:
        lines.append("# " + "─" * 40)
        lines.append("# DEPRECATED CLASSES")
        lines.append("# " + "─" * 40)
        lines.append("")
        for dep in deprecated:
            full_id = f"{local_ns[0]}:{dep['id']}"
            lines.append(f"{full_id} a owl:Class ;")
            lines.append(f"    owl:deprecated true ;")
            replaced = dep.get("replaced_by")
            if replaced:
                rep_ref = resolve_class_ref(replaced, local_classes, local_ns, registry)
                lines.append(f'    rdfs:comment "Replaced by {rep_ref}"@en ;')
            note = dep.get("note", "")
            if note:
                lines.append(f'    rdfs:comment "{escape_turtle(note)}"@en ;')
            lines[-1] = lines[-1].rstrip(" ;") + " ."
            lines.append("")

    # ── Object Properties (Relations) ──
    relations = data.get("relations", [])
    if relations:
        lines.append("# " + "─" * 40)
        lines.append("# OBJECT PROPERTIES (Relations)")
        lines.append("# " + "─" * 40)
        lines.append("")

    for rel in relations:
        rid = rel["id"]
        full_id = f"{local_ns[0]}:{rid}"
        lines.append(f"{full_id} a owl:ObjectProperty ;")

        # rdfs:subPropertyOf (specializes)
        spec = rel.get("specializes")
        if spec and spec != "null":
            # Parse "relation_name (L1)" or "relation_name (L2)" format
            spec_name = spec.split("(")[0].strip().split(" ")[0]
            if spec_name in L1_RELATIONS:
                lines.append(f"    rdfs:subPropertyOf uod:{spec_name} ;")
            else:
                # Try to find in extends namespaces
                for prefix, _ in extends_ns:
                    lines.append(f"    rdfs:subPropertyOf {prefix}:{spec_name} ;")
                    break

        label_en = rel.get("label_en", rid.replace("_", " "))
        label_zh = rel.get("label_zh", "")
        lines.append(f'    rdfs:label "{escape_turtle(label_en)}"@en ;')
        if label_zh:
            lines.append(f'    rdfs:label "{escape_turtle(label_zh)}"@zh ;')

        domain = rel.get("domain")
        if domain:
            domain_ref = resolve_class_ref(domain, local_classes, local_ns, registry)
            lines.append(f"    rdfs:domain {domain_ref} ;")

        rng = rel.get("range")
        if rng:
            range_ref = resolve_class_ref(rng, local_classes, local_ns, registry)
            lines.append(f"    rdfs:range {range_ref} ;")

        def_en = rel.get("definition_en", "")
        def_zh = rel.get("definition", "")
        if def_en:
            lines.append(f'    rdfs:comment "{escape_turtle(def_en)}"@en ;')
        if def_zh:
            lines.append(f'    rdfs:comment "{escape_turtle(def_zh)}"@zh ;')

        lines[-1] = lines[-1].rstrip(" ;") + " ."
        lines.append("")

    # ── Axioms ──
    axioms = data.get("axioms", [])
    if axioms:
        lines.append("# " + "─" * 40)
        lines.append("# AXIOMS (OWL 2 Semantic Constraints)")
        lines.append("# " + "─" * 40)
        lines.append("")

        # Collect disjoint pairs for potential AllDisjointClasses grouping
        disjoint_pairs = []

        for ax in axioms:
            ax_id = ax.get("id", "")
            ax_type = ax.get("type", "")
            comment = ax.get("definition_en", ax.get("definition", ""))

            if ax_type == "disjoint":
                cls_list = ax.get("classes", [])
                if len(cls_list) == 2:
                    c1 = resolve_class_ref(cls_list[0], local_classes, local_ns, registry)
                    c2 = resolve_class_ref(cls_list[1], local_classes, local_ns, registry)
                    lines.append(f"# {ax_id}: {comment}")
                    lines.append(f"{c1} owl:disjointWith {c2} .")
                    lines.append("")
                elif len(cls_list) > 2:
                    refs = " ".join(resolve_class_ref(c, local_classes, local_ns, registry) for c in cls_list)
                    lines.append(f"# {ax_id}: {comment}")
                    lines.append(f"[] a owl:AllDisjointClasses ;")
                    lines.append(f"    owl:members ( {refs} ) .")
                    lines.append("")

            elif ax_type == "transitive":
                rel = ax.get("relation", "")
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{rel_ref} a owl:TransitiveProperty .")
                lines.append("")

            elif ax_type == "asymmetric":
                rel = ax.get("relation", "")
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{rel_ref} a owl:AsymmetricProperty .")
                lines.append("")

            elif ax_type == "symmetric":
                rel = ax.get("relation", "")
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{rel_ref} a owl:SymmetricProperty .")
                lines.append("")

            elif ax_type == "functional":
                rel = ax.get("relation", "")
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{rel_ref} a owl:FunctionalProperty .")
                lines.append("")

            elif ax_type == "inverse_functional":
                rel = ax.get("relation", "")
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{rel_ref} a owl:InverseFunctionalProperty .")
                lines.append("")

            elif ax_type == "existential":
                subj = ax.get("subject_class", "")
                rel = ax.get("relation", "")
                obj = ax.get("object_class", "")
                subj_ref = resolve_class_ref(subj, local_classes, local_ns, registry)
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                obj_ref = resolve_class_ref(obj, local_classes, local_ns, registry)
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{subj_ref} rdfs:subClassOf [")
                lines.append(f"    a owl:Restriction ;")
                lines.append(f"    owl:onProperty {rel_ref} ;")
                lines.append(f"    owl:someValuesFrom {obj_ref}")
                lines.append(f"] .")
                lines.append("")

            elif ax_type == "universal":
                subj = ax.get("subject_class", "")
                rel = ax.get("relation", "")
                obj = ax.get("object_class", "")
                subj_ref = resolve_class_ref(subj, local_classes, local_ns, registry)
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                obj_ref = resolve_class_ref(obj, local_classes, local_ns, registry)
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{subj_ref} rdfs:subClassOf [")
                lines.append(f"    a owl:Restriction ;")
                lines.append(f"    owl:onProperty {rel_ref} ;")
                lines.append(f"    owl:allValuesFrom {obj_ref}")
                lines.append(f"] .")
                lines.append("")

            elif ax_type in ("cardinality_min", "cardinality_max", "cardinality_exact"):
                subj = ax.get("subject_class", "")
                rel = ax.get("relation", "")
                val = ax.get("value", 0)
                subj_ref = resolve_class_ref(subj, local_classes, local_ns, registry)
                rel_ref = f"{local_ns[0]}:{rel}" if rel in {r["id"] for r in data.get("relations", [])} else f"uod:{rel}"
                owl_pred = {
                    "cardinality_min": "owl:minCardinality",
                    "cardinality_max": "owl:maxCardinality",
                    "cardinality_exact": "owl:cardinality",
                }[ax_type]
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{subj_ref} rdfs:subClassOf [")
                lines.append(f"    a owl:Restriction ;")
                lines.append(f"    owl:onProperty {rel_ref} ;")
                lines.append(f'    {owl_pred} "{val}"^^xsd:nonNegativeInteger')
                lines.append(f"] .")
                lines.append("")

            elif ax_type == "subproperty":
                rel = ax.get("relation", "")
                parent_rel = ax.get("parent_relation", "")
                local_rels = {r["id"] for r in data.get("relations", [])}
                rel_ref = f"{local_ns[0]}:{rel}" if rel in local_rels else f"uod:{rel}"
                parent_ref = f"{local_ns[0]}:{parent_rel}" if parent_rel in local_rels else f"uod:{parent_rel}"
                lines.append(f"# {ax_id}: {comment}")
                lines.append(f"{rel_ref} rdfs:subPropertyOf {parent_ref} .")
                lines.append("")

    # ── Named Individuals (Sample Instances) ──
    instances = data.get("sample_instances", [])
    if instances:
        lines.append("# " + "─" * 40)
        lines.append("# NAMED INDIVIDUALS (Instances)")
        lines.append("# " + "─" * 40)
        lines.append("")

    for inst in instances:
        iid = inst["id"]
        full_id = f"{local_ns[0]}:{iid}"
        inst_type = inst.get("type", "Entity")
        type_ref = resolve_class_ref(inst_type, local_classes, local_ns, registry)

        lines.append(f"{full_id} a owl:NamedIndividual, {type_ref} ;")

        label = inst.get("label", iid)
        label_zh = inst.get("label_zh", "")
        lines.append(f'    rdfs:label "{escape_turtle(label)}"@en ;')
        if label_zh:
            lines.append(f'    rdfs:label "{escape_turtle(label_zh)}"@zh ;')

        lines[-1] = lines[-1].rstrip(" ;") + " ."
        lines.append("")

    return "\n".join(lines)


# ─── File Discovery ──────────────────────────────────────────────────────────

def find_project_root(start_path):
    """Find project root by looking for core/ and extensions/ directories."""
    p = Path(start_path).resolve()
    for _ in range(10):
        if (p / "core").is_dir() and (p / "extensions").is_dir():
            return str(p)
        p = p.parent
    return str(Path(start_path).resolve())


def find_all_ontology_jsons(project_root):
    """Find all JSON ontology files in the project."""
    patterns = [
        os.path.join(project_root, "core", "*.json"),
        os.path.join(project_root, "extensions", "*", "*.json"),
        os.path.join(project_root, "enterprise", "*", "*.json"),
        os.path.join(project_root, "private_enterprise", "*", "*.json"),
    ]
    results = []
    for pat in patterns:
        for fpath in sorted(glob.glob(pat)):
            # Skip schema files and templates
            basename = os.path.basename(fpath)
            if basename.startswith("_") or "schema" in basename or "template" in basename.lower():
                continue
            results.append(fpath)
    return results


# ─── Main ─────────────────────────────────────────────────────────────────────

def convert_file(json_path, project_root=None):
    """Convert a single JSON ontology file to OWL Turtle."""
    json_path = os.path.abspath(json_path)
    if not project_root:
        project_root = find_project_root(json_path)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    turtle = generate_turtle(data, project_root)

    # Output path: same directory, .ttl extension
    ttl_path = os.path.splitext(json_path)[0] + ".ttl"
    with open(ttl_path, "w", encoding="utf-8") as f:
        f.write(turtle)

    rel_json = os.path.relpath(json_path, project_root)
    rel_ttl = os.path.relpath(ttl_path, project_root)
    print(f"  [OK] {rel_json} -> {rel_ttl}")
    return ttl_path


def main():
    if len(sys.argv) > 1:
        # Convert specified file(s)
        for fpath in sys.argv[1:]:
            if not os.path.isfile(fpath):
                print(f"  [ERR] File not found: {fpath}")
                continue
            convert_file(fpath)
    else:
        # Convert all ontology files
        project_root = find_project_root(os.getcwd())
        files = find_all_ontology_jsons(project_root)

        if not files:
            print("No ontology JSON files found.")
            sys.exit(1)

        print(f"Converting {len(files)} ontology file(s) to OWL/RDF Turtle...\n")
        for fpath in files:
            try:
                convert_file(fpath, project_root)
            except Exception as e:
                rel = os.path.relpath(fpath, project_root)
                print(f"  [ERR] {rel}: {e}")

        print(f"\nDone. Generated .ttl files alongside each .json source.")


if __name__ == "__main__":
    main()
