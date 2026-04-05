#!/usr/bin/env python3
"""
pack_for_webprotege.py — Package ontology files for WebProtégé import

WebProtégé requires a ZIP archive with:
  - root-ontology.owl  (renamed top-level ontology)
  - imported .owl/.ttl files

Usage:
    python scripts/pack_for_webprotege.py core/universal_ontology_v1.ttl
    python scripts/pack_for_webprotege.py private_enterprise/chanel-china/chanel_china_ontology_v1.ttl
    python scripts/pack_for_webprotege.py --all
"""

import sys
import os
import zipfile
import glob
from pathlib import Path


def find_project_root(start_path):
    p = Path(start_path).resolve()
    for _ in range(10):
        if (p / "core").is_dir() and (p / "addons").is_dir():
            return str(p)
        p = p.parent
    return str(Path(start_path).resolve())


def collect_imports(ttl_path, project_root):
    """Read a .ttl file and find all owl:imports URIs, then map to local files."""
    import_uris = []
    with open(ttl_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if "owl:imports" in line:
                # Extract URI from: owl:imports <https://...> ;
                start = line.find("<")
                end = line.find(">")
                if start >= 0 and end > start:
                    uri = line[start + 1:end]
                    import_uris.append(uri)

    # Map URIs to local .ttl files
    uri_to_file = {
        "https://w3id.org/uod/core/": os.path.join(project_root, "core", "universal_ontology_v1.ttl"),
        "https://w3id.org/uod/addon/luxury-goods/": os.path.join(project_root, "addons", "luxury-goods", "luxury_goods_addon_v1.ttl"),
        "https://w3id.org/uod/addon/consulting/": os.path.join(project_root, "addons", "consulting", "consulting_addon_v1.ttl"),
        "https://w3id.org/uod/addon/common/": os.path.join(project_root, "addons", "common", "common_enterprise_addon_v1.ttl"),
    }

    local_files = []
    for uri in import_uris:
        if uri in uri_to_file:
            fpath = uri_to_file[uri]
            if os.path.isfile(fpath):
                local_files.append(fpath)
            else:
                print(f"  [WARN] Import file not found: {fpath}")
        else:
            print(f"  [WARN] Unknown import URI: {uri}")

    # Recursively collect imports of imports
    more_files = []
    for f in local_files:
        sub = collect_imports(f, project_root)
        for sf in sub:
            if sf not in local_files and sf not in more_files:
                more_files.append(sf)

    return local_files + more_files


def pack_zip(ttl_path, project_root):
    """Create a WebProtégé-compatible ZIP from a .ttl file and its imports."""
    ttl_path = os.path.abspath(ttl_path)
    basename = Path(ttl_path).stem
    zip_dir = os.path.dirname(ttl_path)
    zip_name = os.path.join(zip_dir, f"{basename}_webprotege.zip")

    imports = collect_imports(ttl_path, project_root)

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
    project_root = find_project_root(os.getcwd())

    if len(sys.argv) > 1 and sys.argv[1] != "--all":
        for fpath in sys.argv[1:]:
            if not os.path.isfile(fpath):
                print(f"  [ERR] File not found: {fpath}")
                continue
            pack_zip(fpath, project_root)
    else:
        # Pack all non-core ontologies (L2 + L3)
        patterns = [
            os.path.join(project_root, "core", "*.ttl"),
            os.path.join(project_root, "addons", "*", "*.ttl"),
            os.path.join(project_root, "enterprise", "*", "*.ttl"),
            os.path.join(project_root, "private_enterprise", "*", "*.ttl"),
        ]
        ttl_files = []
        for pat in patterns:
            ttl_files.extend(sorted(glob.glob(pat)))

        print(f"Packaging {len(ttl_files)} ontology file(s) for WebProtege...\n")
        for fpath in ttl_files:
            try:
                pack_zip(fpath, project_root)
                print()
            except Exception as e:
                print(f"  [ERR] {os.path.relpath(fpath, project_root)}: {e}\n")

        print("Done. Upload any .zip file to WebProtege via 'Upload Project'.")


if __name__ == "__main__":
    main()
