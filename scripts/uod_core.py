"""
uod_core.py — Centralized utilities for ontology scripts

Extracts common logic such as path finding, json file discovery,
and namespace mapping generation across the entire ontology project.
"""

import os
import glob
import json
from pathlib import Path

BASE_URI = "https://w3id.org/uod"

def find_project_root(start_path):
    """Find project root by looking for core/ and extensions/ directories."""
    p = Path(start_path).resolve()
    for _ in range(10):
        if (p / "core").is_dir() and (p / "extensions").is_dir():
            return str(p)
        p = p.parent
    return str(Path(start_path).resolve())

def discover_ontology_files(project_root):
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

def get_namespace_for_layer(layer, data=None):
    """Get (prefix, uri) for a given layer identifier by dynamically parsing it."""
    if not layer:
        return ("uod", f"{BASE_URI}/core/")
        
    if layer == "L1_universal_organization_ontology":
        return ("uod", f"{BASE_URI}/core/")
        
    if layer.startswith("L2"):
        slug = layer.replace("L2_", "").replace("_addon", "").replace("_extension", "").replace("_industry", "").replace("_", "-")
        prefix = f"uod-{slug[:6]}"
        if slug == "common-enterprise":
            prefix = "uod-cmn"
            slug = "common"
        elif slug == "luxury-goods":
            prefix = "uod-lux"
            slug = "luxury"
        elif slug == "consulting":
            prefix = "uod-con"
        return (prefix, f"{BASE_URI}/addon/{slug}/")
        
    if layer == "L3_enterprise_customization" and data:
        ent = data.get("enterprise", {})
        eid = ent.get("id", "unknown").lower().replace("_", "-")
        return ("ent", f"{BASE_URI}/enterprise/{eid}/")
        
    return ("uod", f"{BASE_URI}/core/")

def build_global_registry(project_root):
    """Scan all JSON ontology files to build class, relation, and layer registries."""
    files = discover_ontology_files(project_root)
    
    registry = {
        "classes": {},
        "relations": {},
        "layers": {}
    }

    for fpath in files:
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                d = json.load(f)
            
            layer = d.get("layer") or d.get("metadata", {}).get("layer", "")
            ns = get_namespace_for_layer(layer, d)
            registry["layers"][layer] = ns

            for cls in d.get("classes", []):
                registry["classes"][cls["id"]] = ns
                
            for rel in d.get("relations", []):
                registry["relations"][rel["id"]] = ns
                
            for mig in d.get("migration_registry", []):
                if mig.get("kind") == "class":
                    registry["classes"][mig["id"]] = ns
                elif mig.get("kind") == "relation":
                    registry["relations"][mig["id"]] = ns
        except Exception:
            pass

    return registry
