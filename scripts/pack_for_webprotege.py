#!/usr/bin/env python3
"""
pack_for_webprotege.py — Package ontology files for WebProtégé import

WebProtégé requires a ZIP archive with:
  - root-ontology.owl  (renamed top-level ontology)
  - imported .owl/.ttl files

Usage:
    python scripts/pack_for_webprotege.py l1-core/universal_ontology_v1.ttl
    python scripts/pack_for_webprotege.py private_enterprise/chanel-china/chanel_china_ontology_v1.ttl
    python scripts/pack_for_webprotege.py --all
"""

import sys
import os
import zipfile
import glob
import json
from pathlib import Path

import uod_core



def build_uri_to_file_map(project_root):
    """Dynamically build the imported URI to local TTL file map."""
    uri_to_file = {}
    files = uod_core.discover_ontology_files(project_root)
    # We need the global registry to get the exact URI for each layer
    registry = uod_core.build_global_registry(project_root)
    
    for json_path in files:
        ttl_path = json_path.replace(".json", ".ttl")
        if not os.path.isfile(ttl_path):
            continue
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                d = json.load(f)
            layer = d.get("layer") or d.get("metadata", {}).get("layer", "")
            ns = registry["layers"].get(layer)
            if ns:
                uri_to_file[ns[1]] = ttl_path
        except:
            pass
    return uri_to_file

def collect_imports(ttl_path, uri_to_file):
    """Read a .ttl file and find all owl:imports URIs, then map to local files."""
    import_uris = []
    with open(ttl_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if "owl:imports" in line:
                start = line.find("<")
                end = line.find(">")
                if start >= 0 and end > start:
                    uri = line[start + 1:end]
                    import_uris.append(uri)

    local_files = []
    for uri in import_uris:
        if uri in uri_to_file:
            fpath = uri_to_file[uri]
            if fpath not in local_files:
                local_files.append(fpath)
        else:
            print(f"  [WARN] Unknown import URI: {uri}")

    more_files = []
    for f in local_files:
        sub = collect_imports(f, uri_to_file)
        for sf in sub:
            if sf not in local_files and sf not in more_files:
                more_files.append(sf)

    return local_files + more_files


def pack_zip(ttl_path, project_root, uri_to_file):
    """Create a WebProtégé-compatible ZIP from a .ttl file and its imports."""
    ttl_path = os.path.abspath(ttl_path)
    basename = Path(ttl_path).stem
    zip_dir = os.path.dirname(ttl_path)
    zip_name = os.path.join(zip_dir, f"{basename}_webprotege.zip")

    imports = collect_imports(ttl_path, uri_to_file)

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zf:
        # Root ontology must be named root-ontology.owl
        zf.write(ttl_path, "root-ontology.owl")

        # Add imported files with their basename
        added = set()
        for imp_path in imports:
            name = os.path.basename(imp_path)
            if name in added:
                # Avoid collisions
                name = Path(imp_path).parent.name + "_" + name
            zf.write(imp_path, name)
            added.add(name)

    rel_zip = os.path.relpath(zip_name, project_root)
    print(f"  [OK] {rel_zip}")
    print(f"       Root: {os.path.basename(ttl_path)}")
    print(f"       Imports: {len(imports)} file(s)")
    for imp in imports:
        print(f"         - {os.path.relpath(imp, project_root)}")
    return zip_name


def main():
    project_root = uod_core.find_project_root(os.getcwd())
    uri_to_file = build_uri_to_file_map(project_root)

    if len(sys.argv) > 1 and sys.argv[1] != "--all":
        for fpath in sys.argv[1:]:
            if not os.path.isfile(fpath):
                print(f"  [ERR] File not found: {fpath}")
                continue
            pack_zip(fpath, project_root, uri_to_file)
    else:
        # Pack all non-core ontologies (L2 + L3)
        json_files = uod_core.discover_ontology_files(project_root)
        ttl_files = [f.replace(".json", ".ttl") for f in json_files if os.path.isfile(f.replace(".json", ".ttl"))]

        print(f"Packaging {len(ttl_files)} ontology file(s) for WebProtege...\n")
        for fpath in ttl_files:
            try:
                pack_zip(fpath, project_root, uri_to_file)
                print()
            except Exception as e:
                print(f"  [ERR] {os.path.relpath(fpath, project_root)}: {e}\n")

        print("Done. Upload any .zip file to WebProtege via 'Upload Project'.")


if __name__ == "__main__":
    main()
