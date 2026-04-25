# Merging Ontology Layers

The `merge_layers.py` script combines L1 Core + L2 Extensions + L3 Enterprise into a single, flattened enterprise ontology and generates output in all 5 platform formats.

## Why Merge?

The UOD framework stores ontology definitions across separate layer files for modularity and governance. But consumers (knowledge graphs, AI agents, SPARQL engines, application databases) need a single, complete ontology. The merge tool resolves the `extends` dependency chain and produces a ready-to-deploy unified output.

```
L1 Core (24 classes)  ─┐
                        ├── merge_layers.py ──> Unified Ontology (104 classes)
L2 Consulting (54)    ─┤                       ├── merged_ontology.json
                        │                       ├── merged_ontology.ttl
L3 Acme Tech (26)     ─┘                       ├── merged_ontology.jsonld
                                                ├── merged_ontology.graphql
                                                └── merged_ontology.sql
```

## Usage

```bash
# Merge L3 enterprise (auto-resolves L2 + L1 dependencies)
python scripts/merge_layers.py l3-enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json

# Merge L2 extension + L1 core only
python scripts/merge_layers.py l2-extensions/consulting/consulting_extension_v1.json

# Specify output directory
python scripts/merge_layers.py l3-enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json -o output/acme
```

## How It Works

1. **Dependency Resolution** — Reads the target file's `extends` field, recursively follows the chain (L3 -> L2 -> L1), auto-discovers referenced JSON files by scanning `l1-core/`, `l2-extensions/*/`, `l3-enterprise/*/`

2. **Ordered Merge** — Merges layers bottom-up: L1 first, then L2 extensions, then L3 enterprise. Each element gets a `source_layer` field for traceability

3. **Validation** — Checks all `parent`, `domain`, `range`, and instance `type` references resolve to existing classes in the merged set

4. **Output Generation** — Produces all 5 platform formats

## Output Formats

| File | Format | Use Case |
|------|--------|----------|
| `merged_ontology.json` | Flattened JSON | Application integration, AI agents |
| `merged_ontology.ttl` | OWL 2 / RDF Turtle | Knowledge graphs, SPARQL, reasoners |
| `merged_ontology.jsonld` | JSON-LD Context | REST APIs, Linked Data |
| `merged_ontology.graphql` | GraphQL Schema | Modern API layers |
| `merged_ontology.sql` | PostgreSQL DDL | Relational databases |

## Source Layer Tracing

Every class, relation, axiom, and instance in the merged output includes a `source_layer` field:

```json
{
  "id": "Process",
  "label_en": "Process",
  "parent": "Operational",
  "source_layer": "L1_universal_organization_ontology"
},
{
  "id": "Engagement",
  "label_en": "Engagement",
  "parent": "Process",
  "source_layer": "L2_consulting_industry_extension"
},
{
  "id": "CloudMigrationEngagement",
  "label_en": "Cloud Migration Engagement",
  "parent": "Engagement",
  "source_layer": "L3_enterprise_customization"
}
```

## Conflict Handling

| Scenario | Behavior |
|----------|----------|
| Duplicate class ID across layers | Error, abort |
| Duplicate relation ID across layers | Warning, first definition wins |
| Unresolved parent reference | Validation error after merge |
| Missing dependency file | Warning, continues without it |
