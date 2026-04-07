#!/usr/bin/env python3
"""
visualize_ontology.py — Interactive HTML Ontology Visualizer
=============================================================
Reads a merged ontology JSON and generates a self-contained interactive HTML
file with three distinct visualization views:

  View 1 — Force-Directed Relation Graph
           Nodes = classes (colored by layer), edges = relations + inheritance
  View 2 — Inheritance Hierarchy Tree
           Collapsible vertical tree, colored by domain
  View 3 — Layer & Domain Card Grid
           Structured grid grouped by L1/L2/L3 and domain

Usage:
    python scripts/visualize_ontology.py merged_ontology.json
    python scripts/visualize_ontology.py merged_ontology.json -o output/viz.html
    python scripts/visualize_ontology.py --all   # visualize all merged JSONs
"""

import json
import sys
import io
import argparse
import glob
from pathlib import Path
from datetime import datetime

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── Domain Classification ────────────────────────────────────────────────────

L1_DOMAIN_ROOTS = {
    "Entity": "entity", "Party": "entity", "Person": "entity",
    "Organization": "entity", "OrgUnit": "entity",
    "Resource": "resource", "ProductService": "resource", "Asset": "resource",
    "DataObject": "resource", "Document": "resource", "SystemApplication": "resource",
    "Governance": "governance", "Policy": "governance", "Rule": "governance",
    "Control": "governance", "Risk": "governance",
    "Operational": "operational", "Role": "operational", "Capability": "operational",
    "Process": "operational", "Event": "operational",
    "Measurement": "measurement", "Goal": "measurement", "KPI": "measurement",
}

DOMAIN_META = {
    "entity":      {"label": "Entity",      "color": "#5C6BC0", "bg": "#E8EAF6"},
    "resource":    {"label": "Resource",    "color": "#00897B", "bg": "#E0F2F1"},
    "governance":  {"label": "Governance",  "color": "#E53935", "bg": "#FFEBEE"},
    "operational": {"label": "Operational", "color": "#F57C00", "bg": "#FFF3E0"},
    "measurement": {"label": "Measurement", "color": "#7B1FA2", "bg": "#F3E5F5"},
    "unknown":     {"label": "Other",       "color": "#78909C", "bg": "#ECEFF1"},
}

LAYER_META = {
    "L1": {"label": "L1 Core",       "color": "#3949AB", "bg": "#E8EAF6"},
    "L2": {"label": "L2 Consulting", "color": "#00897B", "bg": "#E0F2F1"},
    "L3": {"label": "L3 Enterprise", "color": "#E65100", "bg": "#FFF3E0"},
}

LAYER_KEY = {
    "L1_universal_organization_ontology": "L1",
    "L2_consulting_industry_addon":       "L2",
    "L3_enterprise_customization":        "L3",
}


def assign_domains(classes):
    parent_map = {c["id"]: c.get("parent") for c in classes}
    cache = dict(L1_DOMAIN_ROOTS)

    def resolve(cid, seen=None):
        if cid in cache:
            return cache[cid]
        if seen and cid in seen:
            cache[cid] = "unknown"
            return "unknown"
        seen = (seen or set()) | {cid}
        parent = parent_map.get(cid)
        d = resolve(parent, seen) if parent else "unknown"
        cache[cid] = d
        return d

    for c in classes:
        c["domain"] = resolve(c["id"])
    return classes


def build_viz_data(merged):
    classes = assign_domains(merged["classes"])
    relations = merged.get("relations", [])
    instances = merged.get("sample_instances", [])
    axioms = merged.get("axioms", [])
    meta = merged.get("metadata", {})

    node_ids = {c["id"] for c in classes}

    nodes = []
    for c in classes:
        lr = c.get("source_layer", "")
        nodes.append({
            "id":           c["id"],
            "label_en":     c.get("label_en", c["id"]),
            "label_zh":     c.get("label_zh", ""),
            "parent":       c.get("parent"),
            "layer":        LAYER_KEY.get(lr, lr[:2] if lr else "?"),
            "domain":       c.get("domain", "unknown"),
            "abstract":     c.get("abstract", False),
            "status":       c.get("status", "stable"),
            "def_en":       c.get("definition_en", ""),
            "def_zh":       c.get("definition", ""),
        })

    links = []
    for c in classes:
        if c.get("parent") and c["parent"] in node_ids:
            links.append({
                "source": c["id"], "target": c["parent"],
                "type": "inheritance", "label": "subClassOf",
                "layer": LAYER_KEY.get(c.get("source_layer", ""), ""),
            })

    for r in relations:
        if r.get("domain") in node_ids and r.get("range") in node_ids:
            links.append({
                "source":      r["domain"],
                "target":      r["range"],
                "type":        "relation",
                "label":       r.get("label_en", r["id"]),
                "rid":         r["id"],
                "cardinality": r.get("cardinality", ""),
                "layer":       LAYER_KEY.get(r.get("source_layer", ""), ""),
                "def_en":      r.get("definition_en", ""),
            })

    inst_list = []
    for i in instances:
        inst_list.append({
            "id":       i["id"],
            "label":    i.get("label", i["id"]),
            "label_zh": i.get("label_zh", ""),
            "type":     i.get("type", ""),
            "layer":    LAYER_KEY.get(i.get("source_layer", ""), ""),
        })

    layer_counts = {}
    for n in nodes:
        layer_counts[n["layer"]] = layer_counts.get(n["layer"], 0) + 1

    return {
        "meta": {
            "name":       meta.get("name", "Ontology"),
            "generated":  meta.get("generated_at", ""),
            "layers":     meta.get("layers_merged", []),
        },
        "nodes":     nodes,
        "links":     links,
        "instances": inst_list,
        "axioms":    axioms,
        "stats": {
            "classes":    len(nodes),
            "relations":  sum(1 for l in links if l["type"] == "relation"),
            "instances":  len(inst_list),
            "axioms":     len(axioms),
            **{f"{k}_count": v for k, v in layer_counts.items()},
        },
        "domain_meta": DOMAIN_META,
        "layer_meta":  LAYER_META,
    }


# ── HTML Template ────────────────────────────────────────────────────────────

def generate_html(viz_data):
    data_json = json.dumps(viz_data, ensure_ascii=False, separators=(',', ':'))
    title = viz_data["meta"]["name"]
    generated = viz_data["meta"].get("generated", "")
    stats = viz_data["stats"]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} · Ontology Explorer</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
<style>
:root {{
  --l1: #3949AB; --l1-bg: #E8EAF6; --l1-light: #7986CB;
  --l2: #00897B; --l2-bg: #E0F2F1; --l2-light: #4DB6AC;
  --l3: #E65100; --l3-bg: #FFF3E0; --l3-light: #FFB74D;
  --entity: #5C6BC0; --resource: #00897B;
  --governance: #E53935; --operational: #F57C00; --measurement: #7B1FA2;
  --bg: #F8F9FA; --surface: #FFFFFF; --border: #E0E0E0;
  --text: #212121; --text-sec: #757575;
  --sidebar: 300px;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg);
        color: var(--text); display: flex; flex-direction: column; height: 100vh; overflow: hidden; }}

/* ── Header ── */
#header {{
  background: #1A237E; color: #fff; padding: 10px 20px;
  display: flex; align-items: center; gap: 16px; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
}}
#header h1 {{ font-size: 15px; font-weight: 600; flex: 1; white-space: nowrap;
               overflow: hidden; text-overflow: ellipsis; }}
.stat-pill {{ background: rgba(255,255,255,.15); border-radius: 12px;
              padding: 2px 10px; font-size: 12px; white-space: nowrap; }}
#search-box {{
  padding: 5px 12px; border-radius: 20px; border: none;
  background: rgba(255,255,255,.15); color: #fff; outline: none;
  font-size: 13px; width: 180px; transition: background .2s;
}}
#search-box::placeholder {{ color: rgba(255,255,255,.6); }}
#search-box:focus {{ background: rgba(255,255,255,.25); }}

/* ── View Tabs ── */
#tabs {{
  background: #283593; display: flex; gap: 0; flex-shrink: 0;
  border-bottom: 2px solid rgba(255,255,255,.1);
}}
.tab {{
  padding: 8px 20px; color: rgba(255,255,255,.7); cursor: pointer;
  font-size: 13px; font-weight: 500; transition: all .2s; border: none;
  background: transparent; position: relative;
}}
.tab:hover {{ color: #fff; background: rgba(255,255,255,.08); }}
.tab.active {{ color: #fff; }}
.tab.active::after {{
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 2px; background: #82B1FF;
}}

/* ── Layout ── */
#main {{ display: flex; flex: 1; overflow: hidden; }}
#viz-area {{ flex: 1; overflow: hidden; position: relative; }}
#sidebar {{
  width: var(--sidebar); background: var(--surface); border-left: 1px solid var(--border);
  display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;
}}

/* ── Views ── */
.view {{ width: 100%; height: 100%; display: none; }}
.view.active {{ display: flex; flex-direction: column; }}
#view-force {{ overflow: hidden; }}
#view-tree {{ overflow: hidden; }}
#view-grid {{ overflow-y: auto; padding: 20px; }}

/* ── Force Graph ── */
#force-svg {{ width: 100%; height: 100%; }}
.node circle {{ stroke-width: 1.5px; cursor: pointer; transition: r .15s; }}
.node circle:hover {{ stroke-width: 3px; }}
.node.abstract circle {{ stroke-dasharray: 4 2; }}
.node text {{ font-size: 10px; pointer-events: none; fill: #333; }}
.link {{ stroke-opacity: 0.6; }}
.link.inheritance {{ stroke: #9E9E9E; stroke-dasharray: 4 2; }}
.link.relation {{ stroke-opacity: 0.5; }}
.link-label {{ font-size: 9px; fill: #666; pointer-events: none; }}
.arrowhead {{ fill-opacity: 0.6; }}

/* ── Tree ── */
#tree-svg {{ width: 100%; height: 100%; }}
.tree-node circle {{ stroke-width: 1.5px; cursor: pointer; }}
.tree-node text {{ font-size: 11px; }}
.tree-link {{ fill: none; stroke: #BDBDBD; stroke-width: 1.5px; }}

/* ── Grid ── */
#view-grid h2 {{ font-size: 13px; color: var(--text-sec); margin-bottom: 16px; }}
.layer-section {{ margin-bottom: 28px; }}
.layer-header {{
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid;
}}
.layer-badge {{
  padding: 3px 10px; border-radius: 12px; font-size: 12px;
  font-weight: 700; color: #fff;
}}
.layer-title {{ font-size: 15px; font-weight: 600; }}
.layer-count {{ font-size: 12px; color: var(--text-sec); margin-left: auto; }}
.domain-group {{ margin-bottom: 16px; }}
.domain-label {{
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: .5px; margin-bottom: 8px; padding: 3px 8px;
  border-radius: 4px; display: inline-block;
}}
.cards {{ display: flex; flex-wrap: wrap; gap: 8px; }}
.card {{
  background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
  padding: 10px 12px; width: 220px; cursor: pointer;
  transition: box-shadow .15s, border-color .15s; border-left: 3px solid transparent;
}}
.card:hover {{ box-shadow: 0 2px 8px rgba(0,0,0,.12); }}
.card-title {{ font-size: 13px; font-weight: 600; margin-bottom: 2px; }}
.card-zh {{ font-size: 11px; color: var(--text-sec); margin-bottom: 6px; }}
.card-def {{ font-size: 11px; color: var(--text-sec); line-height: 1.5;
              display: -webkit-box; -webkit-line-clamp: 2;
              -webkit-box-orient: vertical; overflow: hidden; }}
.card-badges {{ display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap; }}
.badge {{
  font-size: 10px; padding: 1px 6px; border-radius: 8px;
  font-weight: 500; white-space: nowrap;
}}
.badge-abstract {{ background: #F5F5F5; color: #616161; border: 1px solid #E0E0E0; }}

/* ── Sidebar ── */
#filter-panel {{ padding: 12px; border-bottom: 1px solid var(--border); flex-shrink: 0; }}
#filter-panel h3 {{ font-size: 12px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: .5px; color: var(--text-sec); margin-bottom: 8px; }}
.filter-group {{ margin-bottom: 10px; }}
.filter-label {{ font-size: 11px; color: var(--text-sec); margin-bottom: 5px; }}
.filter-buttons {{ display: flex; flex-wrap: wrap; gap: 4px; }}
.filter-btn {{
  padding: 3px 10px; border-radius: 12px; border: 1.5px solid; cursor: pointer;
  font-size: 11px; font-weight: 600; background: transparent; transition: all .15s;
}}
.filter-btn.active {{ color: #fff !important; }}
.filter-btn[data-layer="L1"] {{ border-color: var(--l1); color: var(--l1); }}
.filter-btn[data-layer="L1"].active {{ background: var(--l1); }}
.filter-btn[data-layer="L2"] {{ border-color: var(--l2); color: var(--l2); }}
.filter-btn[data-layer="L2"].active {{ background: var(--l2); }}
.filter-btn[data-layer="L3"] {{ border-color: var(--l3); color: var(--l3); }}
.filter-btn[data-layer="L3"].active {{ background: var(--l3); }}
.filter-btn[data-domain="entity"] {{ border-color: var(--entity); color: var(--entity); }}
.filter-btn[data-domain="entity"].active {{ background: var(--entity); }}
.filter-btn[data-domain="resource"] {{ border-color: var(--resource); color: var(--resource); }}
.filter-btn[data-domain="resource"].active {{ background: var(--resource); }}
.filter-btn[data-domain="governance"] {{ border-color: var(--governance); color: var(--governance); }}
.filter-btn[data-domain="governance"].active {{ background: var(--governance); }}
.filter-btn[data-domain="operational"] {{ border-color: var(--operational); color: var(--operational); }}
.filter-btn[data-domain="operational"].active {{ background: var(--operational); }}
.filter-btn[data-domain="measurement"] {{ border-color: var(--measurement); color: var(--measurement); }}
.filter-btn[data-domain="measurement"].active {{ background: var(--measurement); }}
.toggle-row {{ display: flex; align-items: center; gap: 8px; margin-top: 4px; }}
.toggle {{ width: 32px; height: 18px; border-radius: 9px; background: #BDBDBD;
           cursor: pointer; position: relative; transition: background .2s; flex-shrink: 0; }}
.toggle.on {{ background: #3949AB; }}
.toggle::after {{
  content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px;
  border-radius: 50%; background: #fff; transition: left .2s;
}}
.toggle.on::after {{ left: 16px; }}
.toggle-label {{ font-size: 11px; color: var(--text-sec); }}

#detail-panel {{ flex: 1; padding: 12px; overflow-y: auto; }}
#detail-panel h3 {{ font-size: 12px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: .5px; color: var(--text-sec); margin-bottom: 10px; }}
#detail-empty {{ color: var(--text-sec); font-size: 12px; font-style: italic; }}
#detail-content {{ display: none; }}
.detail-id {{ font-size: 16px; font-weight: 700; margin-bottom: 2px; }}
.detail-zh {{ font-size: 13px; color: var(--text-sec); margin-bottom: 10px; }}
.detail-section {{ margin-bottom: 12px; }}
.detail-section-title {{
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; color: var(--text-sec); margin-bottom: 5px;
}}
.detail-def {{ font-size: 12px; line-height: 1.6; color: #424242; }}
.detail-tag {{
  display: inline-block; padding: 2px 8px; border-radius: 10px;
  font-size: 11px; font-weight: 600; color: #fff; margin-right: 4px; margin-bottom: 4px;
}}
.detail-rel {{ font-size: 11px; padding: 4px 0; border-bottom: 1px solid var(--border);
               color: #424242; }}
.detail-rel:last-child {{ border-bottom: none; }}
.detail-rel .rel-name {{ font-weight: 600; color: #1A237E; }}
.detail-inst {{ font-size: 11px; padding: 2px 0; color: #424242; }}
.chip {{
  display: inline-block; padding: 1px 8px; border-radius: 10px;
  font-size: 10px; font-weight: 600; margin: 1px; cursor: pointer;
  border: 1px solid; transition: all .15s;
}}
.chip:hover {{ opacity: .75; }}

/* ── Tooltip ── */
#tooltip {{
  position: fixed; background: rgba(0,0,0,.85); color: #fff; border-radius: 6px;
  padding: 8px 12px; font-size: 12px; pointer-events: none; z-index: 1000;
  max-width: 240px; display: none; line-height: 1.5;
}}

/* ── Zoom controls ── */
#zoom-controls {{
  position: absolute; bottom: 16px; right: 8px; display: flex;
  flex-direction: column; gap: 4px;
}}
.zoom-btn {{
  width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border);
  background: var(--surface); cursor: pointer; font-size: 16px; font-weight: 300;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,.15); transition: background .15s;
}}
.zoom-btn:hover {{ background: #F5F5F5; }}

/* ── Tree Title Bar ── */
#tree-title-bar {{
  position: absolute; top: 0; left: 0; right: 0; z-index: 10;
  padding: 10px 20px; display: flex; align-items: center; gap: 10px;
  background: linear-gradient(to bottom, rgba(248,249,250,0.97) 70%, transparent);
  pointer-events: none;
}}
#tree-title-name {{
  font-size: 15px; font-weight: 700; color: #1A237E;
}}
#tree-title-pills {{ display: flex; gap: 6px; }}
.tree-pill {{
  padding: 2px 10px; border-radius: 10px; font-size: 11px;
  font-weight: 600; color: #fff;
}}
#view-tree {{ position: relative; }}

/* ── Description Bar ── */
#desc-bar {{
  background: #E8EAF6; border-bottom: 1px solid #C5CAE9;
  padding: 5px 20px; font-size: 12px; color: #3949AB;
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  white-space: nowrap; overflow: hidden;
}}
#desc-name {{ font-weight: 600; }}
.desc-sep {{ color: #9FA8DA; }}
#desc-layers {{ color: #5C6BC0; }}
#desc-hint {{ color: #7986CB; font-style: italic; flex: 1; overflow: hidden; text-overflow: ellipsis; }}

/* ── Legend ── */
#legend {{
  position: absolute; bottom: 16px; left: 12px; background: rgba(255,255,255,.95);
  border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px;
  font-size: 11px; box-shadow: 0 1px 4px rgba(0,0,0,.1);
}}
#legend h4 {{ font-size: 10px; text-transform: uppercase; letter-spacing: .5px;
               color: var(--text-sec); margin-bottom: 6px; }}
.legend-row {{ display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }}
.legend-dot {{ width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }}
.legend-line {{ width: 20px; height: 2px; flex-shrink: 0; }}
</style>
</head>
<body>

<div id="header">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
    <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
    <line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/>
  </svg>
  <h1 id="header-title">{title}</h1>
  <span class="stat-pill">{stats.get('classes',0)} classes</span>
  <span class="stat-pill">{stats.get('relations',0)} relations</span>
  <span class="stat-pill">{stats.get('instances',0)} instances</span>
  <input id="search-box" type="text" placeholder="Search classes…">
</div>

<div id="tabs">
  <button class="tab active" onclick="switchView('force')">&#9737; Relation Graph</button>
  <button class="tab" onclick="switchView('tree')">&#9663; Hierarchy Tree</button>
  <button class="tab" onclick="switchView('grid')">&#9783; Layer Overview</button>
</div>

<div id="desc-bar">
  <span id="desc-name"></span>
  <span class="desc-sep">·</span>
  <span id="desc-layers"></span>
  <span class="desc-sep">·</span>
  <span id="desc-hint"></span>
</div>

<div id="main">
  <div id="viz-area">

    <!-- View 1: Force Graph -->
    <div id="view-force" class="view active">
      <svg id="force-svg"></svg>
      <div id="zoom-controls">
        <button class="zoom-btn" onclick="forceZoom(1.3)">+</button>
        <button class="zoom-btn" onclick="forceZoom(0.77)">−</button>
        <button class="zoom-btn" onclick="forceReset()" title="Reset">⤢</button>
      </div>
      <div id="legend">
        <h4>Legend</h4>
        <div class="legend-row"><div class="legend-dot" style="background:#3949AB"></div> L1 Core</div>
        <div class="legend-row"><div class="legend-dot" style="background:#00897B"></div> L2 Consulting</div>
        <div class="legend-row"><div class="legend-dot" style="background:#E65100"></div> L3 Enterprise</div>
        <div class="legend-row"><div class="legend-dot" style="background:#ccc;border:1.5px dashed #888"></div> Abstract</div>
        <div class="legend-row"><div class="legend-line" style="background:#9E9E9E;border-top:1.5px dashed #9E9E9E"></div> Inheritance</div>
        <div class="legend-row"><div class="legend-line" style="background:#5C6BC0"></div> Relation</div>
      </div>
    </div>

    <!-- View 2: Tree -->
    <div id="view-tree" class="view">
      <div id="tree-title-bar">
        <span id="tree-title-name"></span>
        <span id="tree-title-pills"></span>
      </div>
      <svg id="tree-svg"></svg>
    </div>

    <!-- View 3: Grid -->
    <div id="view-grid" class="view">
      <h2 id="grid-subtitle"></h2>
      <div id="grid-content"></div>
    </div>

  </div>

  <!-- Sidebar -->
  <div id="sidebar">
    <div id="filter-panel">
      <h3>Filters</h3>
      <div class="filter-group">
        <div class="filter-label">Layer</div>
        <div class="filter-buttons">
          <button class="filter-btn active" data-layer="L1" onclick="toggleLayer('L1',this)">L1</button>
          <button class="filter-btn active" data-layer="L2" onclick="toggleLayer('L2',this)">L2</button>
          <button class="filter-btn active" data-layer="L3" onclick="toggleLayer('L3',this)">L3</button>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-label">Domain</div>
        <div class="filter-buttons">
          <button class="filter-btn active" data-domain="entity" onclick="toggleDomain('entity',this)">Entity</button>
          <button class="filter-btn active" data-domain="resource" onclick="toggleDomain('resource',this)">Resource</button>
          <button class="filter-btn active" data-domain="governance" onclick="toggleDomain('governance',this)">Gov</button>
          <button class="filter-btn active" data-domain="operational" onclick="toggleDomain('operational',this)">Ops</button>
          <button class="filter-btn active" data-domain="measurement" onclick="toggleDomain('measurement',this)">Measure</button>
        </div>
      </div>
      <div class="filter-group">
        <div class="toggle-row">
          <div class="toggle on" id="toggle-relations" onclick="toggleRelations(this)"></div>
          <span class="toggle-label">Show relations</span>
        </div>
        <div class="toggle-row">
          <div class="toggle" id="toggle-instances" onclick="toggleInstances(this)"></div>
          <span class="toggle-label">Show instances</span>
        </div>
        <div class="toggle-row">
          <div class="toggle on" id="toggle-labels" onclick="toggleLabels(this)"></div>
          <span class="toggle-label">Show labels</span>
        </div>
      </div>
    </div>

    <div id="detail-panel">
      <h3>Details</h3>
      <div id="detail-empty">Click any node or card to inspect.</div>
      <div id="detail-content"></div>
    </div>
  </div>
</div>

<div id="tooltip"></div>

<script>
const D = {data_json};

// ── State ────────────────────────────────────────────────────────────────────
const state = {{
  activeLayers:  new Set(['L1','L2','L3']),
  activeDomains: new Set(['entity','resource','governance','operational','measurement','unknown']),
  showRelations: true,
  showInstances: false,
  showLabels:    true,
  searchQuery:   '',
  currentView:   'force',
}};

const LAYER_COLORS = {{ L1:'#3949AB', L2:'#00897B', L3:'#E65100' }};
const DOMAIN_COLORS = {{
  entity:'#5C6BC0', resource:'#00897B', governance:'#E53935',
  operational:'#F57C00', measurement:'#7B1FA2', unknown:'#78909C'
}};

// Build lookup maps
const nodeById    = Object.fromEntries(D.nodes.map(n => [n.id, n]));
const instancesByType = {{}};
D.instances.forEach(i => {{
  if (!instancesByType[i.type]) instancesByType[i.type] = [];
  instancesByType[i.type].push(i);
}});
const relsByDomain = {{}}, relsByRange = {{}};
D.links.filter(l=>l.type==='relation').forEach(l => {{
  if (!relsByDomain[l.source.id||l.source]) relsByDomain[l.source.id||l.source]=[];
  relsByDomain[l.source.id||l.source].push(l);
  if (!relsByRange[l.target.id||l.target]) relsByRange[l.target.id||l.target]=[];
  relsByRange[l.target.id||l.target].push(l);
}});

// ── View Switching ────────────────────────────────────────────────────────────
const HINTS = {{
  force: 'Drag nodes \u00b7 scroll to zoom \u00b7 click to inspect',
  tree:  'Scroll/pinch to zoom \u00b7 click any node to inspect',
  grid:  'All classes grouped by layer and domain \u00b7 search to filter',
}};
function switchView(name) {{
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelectorAll('.tab')[['force','tree','grid'].indexOf(name)].classList.add('active');
  state.currentView = name;
  if (name==='force' && !forceInitialized) initForce();
  if (name==='tree'  && !treeInitialized)  initTree();
  if (name==='grid')  renderGrid();
  // Update description hint
  const hintEl = document.getElementById('desc-hint');
  if (hintEl && typeof HINTS !== 'undefined') hintEl.textContent = HINTS[name] || '';
}}

// ── Filters ───────────────────────────────────────────────────────────────────
function toggleLayer(l, btn) {{
  btn.classList.toggle('active');
  if (state.activeLayers.has(l)) state.activeLayers.delete(l);
  else state.activeLayers.add(l);
  applyFilters();
}}
function toggleDomain(d, btn) {{
  btn.classList.toggle('active');
  if (state.activeDomains.has(d)) state.activeDomains.delete(d);
  else state.activeDomains.add(d);
  applyFilters();
}}
function toggleRelations(el) {{
  el.classList.toggle('on');
  state.showRelations = el.classList.contains('on');
  applyFilters();
}}
function toggleInstances(el) {{
  el.classList.toggle('on');
  state.showInstances = el.classList.contains('on');
  applyFilters();
}}
function toggleLabels(el) {{
  el.classList.toggle('on');
  state.showLabels = el.classList.contains('on');
  d3.selectAll('.node text').style('display', state.showLabels ? null : 'none');
}}
function nodeVisible(n) {{
  const layer = n.layer || (n.id ? nodeById[n.id.id||n.id]?.layer : '');
  const domain = n.domain || (n.id ? nodeById[n.id.id||n.id]?.domain : '');
  if (!state.activeLayers.has(layer)) return false;
  if (!state.activeDomains.has(domain||'unknown')) return false;
  if (state.searchQuery) {{
    const q = state.searchQuery.toLowerCase();
    const id = (n.id?.id||n.id||'').toLowerCase();
    const le = (n.label_en||'').toLowerCase();
    const lz = (n.label_zh||'').toLowerCase();
    if (!id.includes(q) && !le.includes(q) && !lz.includes(q)) return false;
  }}
  return true;
}}
function applyFilters() {{
  if (state.currentView==='force') updateForceVisibility();
  if (state.currentView==='tree')  updateTreeVisibility();
  if (state.currentView==='grid')  renderGrid();
}}

document.getElementById('search-box').addEventListener('input', e => {{
  state.searchQuery = e.target.value.trim();
  applyFilters();
  if (state.currentView==='grid') renderGrid();
}});

// ── Details Panel ─────────────────────────────────────────────────────────────
function showDetail(nodeId) {{
  const n = nodeById[nodeId];
  if (!n) return;
  document.getElementById('detail-empty').style.display = 'none';
  const dc = document.getElementById('detail-content');
  dc.style.display = 'block';
  const lc = LAYER_COLORS[n.layer]||'#666';
  const dc2 = DOMAIN_COLORS[n.domain]||'#666';
  // Children
  const children = D.nodes.filter(c => c.parent === n.id);
  // Relations where this node is domain or range
  const asD = D.links.filter(l=>l.type==='relation' && (l.source?.id||l.source)===n.id);
  const asR = D.links.filter(l=>l.type==='relation' && (l.target?.id||l.target)===n.id);
  const insts = instancesByType[n.id]||[];

  dc.innerHTML = `
    <div class="detail-id">${{n.id}}</div>
    <div class="detail-zh">${{n.label_zh}} / ${{n.label_en}}</div>
    <div style="margin-bottom:10px">
      <span class="detail-tag" style="background:${{lc}}">${{n.layer}}</span>
      <span class="detail-tag" style="background:${{dc2}}">${{n.domain}}</span>
      ${{n.abstract?'<span class="detail-tag" style="background:#9E9E9E">abstract</span>':''}}
      ${{n.status!=='stable'?`<span class="detail-tag" style="background:#FF7043">${{n.status}}</span>`:''}}
    </div>
    ${{n.def_en?`<div class="detail-section">
      <div class="detail-section-title">Definition</div>
      <div class="detail-def">${{n.def_en}}</div>
    </div>`:''}}
    ${{n.parent?`<div class="detail-section">
      <div class="detail-section-title">Parent</div>
      <span class="chip" style="border-color:${{LAYER_COLORS[nodeById[n.parent]?.layer]||'#ccc'}};color:${{LAYER_COLORS[nodeById[n.parent]?.layer]||'#666'}}"
        onclick="showDetail('${{n.parent}}')">${{n.parent}}</span>
    </div>`:''}}
    ${{children.length?`<div class="detail-section">
      <div class="detail-section-title">Children (${{children.length}})</div>
      ${{children.map(c=>`<span class="chip" style="border-color:${{LAYER_COLORS[c.layer]||'#ccc'}};color:${{LAYER_COLORS[c.layer]||'#666'}}" onclick="showDetail('${{c.id}}')">${{c.id}}</span>`).join('')}}
    </div>`:''}}
    ${{asD.length?`<div class="detail-section">
      <div class="detail-section-title">Outgoing Relations (${{asD.length}})</div>
      ${{asD.map(l=>`<div class="detail-rel">
        <span class="rel-name">.${{l.label}}</span> → <span class="chip" style="border-color:#ccc;color:#555" onclick="showDetail('${{l.target?.id||l.target}}')">${{l.target?.id||l.target}}</span>
        <span style="color:#9E9E9E;font-size:10px"> ${{l.cardinality}}</span>
      </div>`).join('')}}
    </div>`:''}}
    ${{asR.length?`<div class="detail-section">
      <div class="detail-section-title">Incoming Relations (${{asR.length}})</div>
      ${{asR.map(l=>`<div class="detail-rel">
        <span class="chip" style="border-color:#ccc;color:#555" onclick="showDetail('${{l.source?.id||l.source}}')">${{l.source?.id||l.source}}</span>
        <span class="rel-name"> .${{l.label}}</span> →
      </div>`).join('')}}
    </div>`:''}}
    ${{insts.length?`<div class="detail-section">
      <div class="detail-section-title">Instances (${{insts.length}})</div>
      ${{insts.map(i=>`<div class="detail-inst">· ${{i.label}} ${{i.label_zh?`<span style="color:#9E9E9E">(${{i.label_zh}})</span>`:''}}</div>`).join('')}}
    </div>`:''}}
  `;
}}

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
const tooltip = document.getElementById('tooltip');
function showTooltip(e, n) {{
  tooltip.style.display = 'block';
  tooltip.style.left = (e.clientX + 12) + 'px';
  tooltip.style.top  = (e.clientY - 10) + 'px';
  tooltip.innerHTML = `<strong>${{n.id}}</strong> <span style="opacity:.7">${{n.layer}}</span><br>${{n.label_zh}} / ${{n.label_en}}<br><span style="opacity:.7;font-size:11px">${{(n.def_en||'').slice(0,80)}}${{n.def_en?.length>80?'…':''}}</span>`;
}}
function hideTooltip() {{ tooltip.style.display = 'none'; }}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW 1: Force-Directed Graph
// ══════════════════════════════════════════════════════════════════════════════
let forceInitialized = false, forceSim, forceZoomBehavior, forceG;

function initForce() {{
  forceInitialized = true;
  const svg = d3.select('#force-svg');
  const el  = document.getElementById('force-svg');
  const W = el.clientWidth, H = el.clientHeight;

  svg.selectAll('*').remove();
  const defs = svg.append('defs');

  // Arrow markers for each layer
  ['L1','L2','L3','rel'].forEach(k => {{
    const color = k==='rel' ? '#5C6BC0' : LAYER_COLORS[k];
    defs.append('marker')
      .attr('id', 'arrow-'+k)
      .attr('viewBox','0 -4 10 8').attr('refX',18).attr('refY',0)
      .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
      .append('path').attr('d','M0,-4L10,0L0,4').attr('fill',color).attr('opacity',0.6);
  }});

  forceG = svg.append('g');
  forceZoomBehavior = d3.zoom().scaleExtent([0.1,4])
    .on('zoom', e => forceG.attr('transform', e.transform));
  svg.call(forceZoomBehavior);

  // Prepare nodes & links
  const nodes = D.nodes.map(n => ({{...n}}));
  const links = D.links.map(l => ({{...l}}));

  forceSim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d=>d.id)
      .distance(l => l.type==='inheritance' ? 70 : 140)
      .strength(l => l.type==='inheritance' ? 0.9 : 0.3))
    .force('charge', d3.forceManyBody().strength(-180))
    .force('center', d3.forceCenter(W/2, H/2))
    .force('collide', d3.forceCollide(22));

  // Links
  const linkSel = forceG.append('g').selectAll('line')
    .data(links).join('line')
    .attr('class', l => 'link ' + l.type)
    .attr('stroke', l => l.type==='inheritance' ? '#BDBDBD' : LAYER_COLORS[l.layer]||'#9C9C9C')
    .attr('stroke-width', l => l.type==='inheritance' ? 1 : 1.5)
    .attr('stroke-dasharray', l => l.type==='inheritance' ? '4 2' : null)
    .attr('marker-end', l => l.type==='inheritance' ? 'url(#arrow-'+(LAYER_COLORS[l.layer]?l.layer:'rel')+')' : 'url(#arrow-rel)');

  // Nodes
  const nodeSel = forceG.append('g').selectAll('g.node')
    .data(nodes).join('g').attr('class', n => 'node'+(n.abstract?' abstract':''))
    .call(d3.drag()
      .on('start', (e,d) => {{ if(!e.active) forceSim.alphaTarget(.3).restart(); d.fx=d.x; d.fy=d.y; }})
      .on('drag',  (e,d) => {{ d.fx=e.x; d.fy=e.y; }})
      .on('end',   (e,d) => {{ if(!e.active) forceSim.alphaTarget(0); d.fx=null; d.fy=null; }}))
    .on('mouseover', (e,d) => showTooltip(e,d))
    .on('mousemove', (e,d) => showTooltip(e,d))
    .on('mouseout',  ()    => hideTooltip())
    .on('click', (e,d) => showDetail(d.id));

  nodeSel.append('circle')
    .attr('r', n => n.abstract ? 14 : (n.layer==='L1'?12 : n.layer==='L2'?10 : 8))
    .attr('fill', n => LAYER_COLORS[n.layer]||'#78909C')
    .attr('fill-opacity', n => n.abstract ? 0.25 : 0.85)
    .attr('stroke', n => LAYER_COLORS[n.layer]||'#78909C')
    .attr('stroke-dasharray', n => n.abstract ? '4 2' : null);

  nodeSel.append('text')
    .attr('dy', 20).attr('text-anchor','middle')
    .attr('font-size', n => n.layer==='L1' ? 11 : 9)
    .attr('font-weight', n => n.layer==='L1' ? 600 : 400)
    .text(n => n.id);

  forceSim.on('tick', () => {{
    linkSel
      .attr('x1', l=>l.source.x).attr('y1', l=>l.source.y)
      .attr('x2', l=>l.target.x).attr('y2', l=>l.target.y);
    nodeSel.attr('transform', n=>`translate(${{n.x}},${{n.y}})`);
  }});

  // Initial filter
  updateForceVisibility();

  // Center after settle — read live dimensions so layout is guaranteed complete
  forceSim.on('end', () => {{
    const cW = el.clientWidth || 800, cH = el.clientHeight || 600;
    const b = forceG.node().getBBox();
    if (!b.width || !b.height) return;
    const scale = Math.min(0.88, (cW - 80) / b.width, (cH - 80) / b.height);
    const tx = cW/2 - scale*(b.x + b.width/2);
    const ty = cH/2 - scale*(b.y + b.height/2);
    svg.transition().duration(700)
      .call(forceZoomBehavior.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }});
}}

function updateForceVisibility() {{
  if (!forceInitialized) return;
  forceG.selectAll('g.node').each(function(d) {{
    const vis = nodeVisible(d);
    d3.select(this).style('display', vis?null:'none');
  }});
  forceG.selectAll('line.link').each(function(l) {{
    const sId = l.source?.id||l.source, tId = l.target?.id||l.target;
    const sn = nodeById[sId], tn = nodeById[tId];
    const vis = sn && tn && nodeVisible(sn) && nodeVisible(tn)
      && (l.type==='inheritance' || state.showRelations)
      && (l.type!=='instance'   || state.showInstances);
    d3.select(this).style('display', vis?null:'none');
  }});
}}

function forceZoom(factor) {{
  d3.select('#force-svg').transition().duration(250)
    .call(forceZoomBehavior.scaleBy, factor);
}}
function forceReset() {{
  const svg = document.getElementById('force-svg');
  d3.select('#force-svg').transition().duration(500)
    .call(forceZoomBehavior.transform, d3.zoomIdentity
      .translate(svg.clientWidth/2, svg.clientHeight/2).scale(0.6));
}}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW 2: Hierarchy Tree
// ══════════════════════════════════════════════════════════════════════════════
let treeInitialized = false;
let treeNodeSel = null, treeLinkSel = null;

function updateTreeVisibility() {{
  if (!treeInitialized || !treeNodeSel) return;
  treeNodeSel.each(function(d) {{
    const n = d.data.data;
    const match = nodeVisible(n);
    d3.select(this).select('circle')
      .attr('fill-opacity', match ? (n.abstract ? 0.2 : 0.82) : 0.07)
      .attr('stroke-opacity', match ? 1 : 0.15);
    d3.select(this).select('text')
      .attr('opacity', match ? 1 : 0.12);
  }});
  // Also dim links whose source node is filtered out
  if (treeLinkSel) {{
    treeLinkSel.attr('stroke-opacity', d => {{
      const n = d.data.data;
      return nodeVisible(n) ? 0.4 : 0.06;
    }});
  }}
}}

function initTree() {{
  treeInitialized = true;
  const svg = d3.select('#tree-svg');
  const el  = document.getElementById('tree-svg');
  const W = el.clientWidth, H = el.clientHeight;
  svg.selectAll('*').remove();

  // Build child map
  const childMap = {{}};
  D.nodes.forEach(n => {{
    if (n.parent) {{
      if (!childMap[n.parent]) childMap[n.parent] = [];
      childMap[n.parent].push(n);
    }}
  }});

  function buildTree(node) {{
    const kids = (childMap[node.id]||[]).map(buildTree);
    return {{ data: node, children: kids.length ? kids : null }};
  }}

  // Virtual root connects the 4 domain roots
  const domainRoots = D.nodes.filter(n => !n.parent);
  const treeData = {{
    data: {{ id:'__root__', label_en:'', label_zh:'', abstract:true, layer:'L1', domain:'unknown' }},
    children: domainRoots.map(buildTree)
  }};

  // Fixed node size: nodeSize([dx, dy]) gives each node its own slot
  // dx=48px horizontal breathing room, dy=90px vertical level gap
  const NODE_DX = 48, NODE_DY = 90;

  const zoomBehavior = d3.zoom().scaleExtent([0.04, 3])
    .on('zoom', e => g.attr('transform', e.transform));
  svg.call(zoomBehavior);

  const g = svg.append('g');

  const root = d3.hierarchy(treeData);
  const treeLayout = d3.tree()
    .nodeSize([NODE_DX, NODE_DY])
    .separation((a, b) => a.parent === b.parent ? 1 : 1.4);
  treeLayout(root);

  // Populate tree title bar
  document.getElementById('tree-title-name').textContent = D.meta.name;
  const pillsEl = document.getElementById('tree-title-pills');
  pillsEl.innerHTML = ['L1','L2','L3'].map(k => {{
    const cnt = D.stats[k+'_count']||0;
    if (!cnt) return '';
    const color = LAYER_COLORS[k]||'#666';
    return `<span class="tree-pill" style="background:${{color}}">${{k}}: ${{cnt}}</span>`;
  }}).join('');

  // Links (skip link from virtual root to its children — draw them plain)
  treeLinkSel = g.append('g').selectAll('path')
    .data(root.descendants().slice(1))
    .join('path')
    .attr('class','tree-link')
    .attr('stroke', d => d.data.data.id==='__root__' ? '#E0E0E0'
          : LAYER_COLORS[d.data.data.layer]||'#BDBDBD')
    .attr('stroke-opacity', d => d.parent?.data.data.id==='__root__' ? 0.3 : 0.4)
    .attr('d', d => {{
      const px = d.parent.x, py = d.parent.y;
      return `M${{d.x}},${{d.y}}C${{d.x}},${{(d.y+py)/2}} ${{px}},${{(d.y+py)/2}} ${{px}},${{py}}`;
    }});

  // Nodes — exclude the invisible virtual root from rendering
  const visNodes = root.descendants().filter(d => d.data.data.id !== '__root__');

  treeNodeSel = g.append('g').selectAll('g')
    .data(visNodes).join('g')
    .attr('class','tree-node')
  const node = treeNodeSel;
    .attr('transform', d => `translate(${{d.x}},${{d.y}})`)
    .style('cursor','pointer')
    .on('click',     (e,d) => showDetail(d.data.data.id))
    .on('mouseover', (e,d) => showTooltip(e, d.data.data))
    .on('mousemove', (e,d) => showTooltip(e, d.data.data))
    .on('mouseout',  ()    => hideTooltip());

  // Depth-based radius: L1 abstract=13, L1 concrete=10, L2=8, L3=6
  node.append('circle')
    .attr('r', d => {{
      const nd = d.data.data;
      if (nd.abstract) return 13;
      if (nd.layer==='L1') return 10;
      if (nd.layer==='L2') return 8;
      return 6;
    }})
    .attr('fill', d => LAYER_COLORS[d.data.data.layer]||'#78909C')
    .attr('fill-opacity', d => d.data.data.abstract ? 0.2 : 0.82)
    .attr('stroke', d => LAYER_COLORS[d.data.data.layer]||'#78909C')
    .attr('stroke-width', d => d.data.data.abstract ? 1.5 : 1)
    .attr('stroke-dasharray', d => d.data.data.abstract ? '4 2' : null);

  // Labels: show above node for parents, below for leaves
  // Alternate left/right for leaf siblings to reduce overlap
  node.append('text')
    .attr('dy', d => d.children ? -14 : 16)
    .attr('text-anchor', 'middle')
    .attr('font-size', d => {{
      if (d.data.data.abstract) return 13;
      if (d.data.data.layer==='L1') return 11;
      if (d.data.data.layer==='L2') return 9;
      return 8;
    }})
    .attr('font-weight', d => (d.data.data.layer==='L1'||d.data.data.abstract) ? 700 : 400)
    .attr('fill', d => DOMAIN_COLORS[d.data.data.domain]||'#424242')
    .attr('paint-order','stroke')
    .attr('stroke','#fff')
    .attr('stroke-width', 3)
    .text(d => d.data.data.id);

  // Auto-fit: center the tree with slight top padding
  updateTreeVisibility();

  requestAnimationFrame(() => {{
    const b = g.node().getBBox();
    const pad = 56; // extra top pad for title bar
    const scale = Math.min(0.95, (W-pad*2)/(b.width||1), (H-pad*2)/(b.height||1));
    const tx = W/2 - scale*(b.x + b.width/2);
    const ty = pad - scale*b.y;
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }});
}}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW 3: Card Grid
// ══════════════════════════════════════════════════════════════════════════════
function renderGrid() {{
  const layers = ['L1','L2','L3'];
  const domains = ['entity','resource','governance','operational','measurement','unknown'];
  const q = state.searchQuery.toLowerCase();

  const subtitle = document.getElementById('grid-subtitle');
  const layerMeta = D.layer_meta || {{}};

  let html = '';
  for (const layer of layers) {{
    if (!state.activeLayers.has(layer)) continue;
    const lm = layerMeta[layer]||{{}};
    const lColor = LAYER_COLORS[layer]||'#666';
    const nodesInLayer = D.nodes.filter(n => n.layer===layer && state.activeDomains.has(n.domain||'unknown')
      && (!q || n.id.toLowerCase().includes(q) || (n.label_en||'').toLowerCase().includes(q)
              || (n.label_zh||'').toLowerCase().includes(q)));
    if (!nodesInLayer.length) continue;

    html += `<div class="layer-section">
      <div class="layer-header" style="border-color:${{lColor}}">
        <span class="layer-badge" style="background:${{lColor}}">${{layer}}</span>
        <span class="layer-title">${{lm.label||layer}}</span>
        <span class="layer-count">${{nodesInLayer.length}} classes</span>
      </div>`;

    for (const domain of domains) {{
      if (!state.activeDomains.has(domain)) continue;
      const nodes = nodesInLayer.filter(n => n.domain===domain);
      if (!nodes.length) continue;
      const dm = D.domain_meta?.[domain]||{{}};
      const dColor = dm.color||DOMAIN_COLORS[domain]||'#666';
      const dBg    = dm.bg||'#F5F5F5';
      html += `<div class="domain-group">
        <span class="domain-label" style="background:${{dBg}};color:${{dColor}}">${{(dm.label||domain).toUpperCase()}}</span>
        <div class="cards">
          ${{nodes.map(n => `<div class="card" style="border-left-color:${{lColor}}" onclick="showDetail('${{n.id}}')">
            <div class="card-title">${{n.id}}</div>
            <div class="card-zh">${{n.label_zh}} / ${{n.label_en}}</div>
            <div class="card-def">${{n.def_en||''}}</div>
            <div class="card-badges">
              ${{n.abstract?'<span class="badge badge-abstract">abstract</span>':''}}
              ${{n.status!=='stable'?`<span class="badge" style="background:#FF7043;color:#fff">${{n.status}}</span>`:''}}
            </div>
          </div>`).join('')}}
        </div>
      </div>`;
    }}
    html += '</div>';
  }}
  document.getElementById('grid-content').innerHTML = html || '<p style="color:#9E9E9E;font-size:13px">No classes match current filters.</p>';
  subtitle.textContent = `${{D.stats.classes}} classes across ${{['L1','L2','L3'].filter(l=>state.activeLayers.has(l)).join(' · ')}}`;
}}

// ── Init ──────────────────────────────────────────────────────────────────────

// Desc bar — populate static text
(function() {{
  const lm = D.layer_meta || {{}};
  const s  = D.stats;
  const nameEl = document.getElementById('desc-name');
  if (nameEl) nameEl.textContent = D.meta.name;
  const layersEl = document.getElementById('desc-layers');
  if (layersEl) {{
    const parts = ['L1','L2','L3'].map(k => {{
      const cnt = s[k+'_count']||0;
      const label = (lm[k]||{{}}).label || k;
      return cnt ? label + ': ' + cnt : null;
    }}).filter(Boolean);
    layersEl.textContent = parts.join('  \u00b7  ');
  }}
}})();

// Desc hint — set initial hint
(function() {{
  const el = document.getElementById('desc-hint');
  if (el) el.textContent = HINTS[state.currentView] || '';
}})();

// Defer initForce until layout is computed (clientWidth > 0)
requestAnimationFrame(() => initForce());
</script>
</body>
</html>"""


def generate_visualization(input_path, output_path=None):
    input_path = Path(input_path)
    with open(input_path, encoding='utf-8') as f:
        merged = json.load(f)

    viz_data = build_viz_data(merged)

    if output_path is None:
        out_dir = input_path.parent
        stem = input_path.stem.replace('merged_ontology', 'visualization')
        if stem == input_path.stem:
            stem = input_path.stem + '_visualization'
        output_path = out_dir / (stem + '.html')
    else:
        output_path = Path(output_path)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    html = generate_html(viz_data)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    stats = viz_data['stats']
    print(f"  [OK] {output_path}")
    print(f"       {stats['classes']} classes  |  {stats['relations']} relations  |  {stats['instances']} instances")
    print(f"       L1:{stats.get('L1_count',0)}  L2:{stats.get('L2_count',0)}  L3:{stats.get('L3_count',0)}")
    return str(output_path)


def main():
    parser = argparse.ArgumentParser(description='Generate interactive HTML ontology visualization')
    parser.add_argument('target', nargs='?', help='Path to merged_ontology.json')
    parser.add_argument('-o', '--output', help='Output HTML file path')
    parser.add_argument('--all', action='store_true', help='Visualize all merged_ontology.json files in project')
    args = parser.parse_args()

    if args.all or not args.target:
        root = Path(__file__).parent.parent
        files = (list(root.glob('**/output/merged_ontology.json'))
                 + list(root.glob('enterprise/**/output/merged_ontology.json'))
                 + list(root.glob('private_enterprise/**/output/merged_ontology.json')))
        if not files:
            print("No merged_ontology.json files found. Run merge_layers.py first.")
            sys.exit(1)
        print(f"Found {len(files)} merged ontology file(s):\n")
        for f in files:
            generate_visualization(f)
            print()
    else:
        generate_visualization(args.target, args.output)


if __name__ == '__main__':
    main()
