---
description: Generate OWL/RDF Turtle files from JSON ontology sources
---

# Generate OWL from JSON Ontology

This workflow converts all JSON ontology files (L1/L2/L3) to OWL 2 Turtle (.ttl) format for import into Protégé, TopBraid, Stardog, and other ontology systems.

## Convert All Files

// turbo
1. Run the converter to process all ontology JSON files:
```
python scripts/json_to_owl.py
```

## Convert a Single File

2. To convert a specific file:
```
python scripts/json_to_owl.py path/to/ontology.json
```

## Output

- Each `.json` file gets a corresponding `.ttl` file in the same directory
- Example: `core/universal_ontology_v1.json` → `core/universal_ontology_v1.ttl`
- The `.ttl` files can be directly imported into Protégé via File → Open

## Important Notes

- The script has **zero external dependencies** (pure Python 3, no pip install needed)
- Private enterprise `.ttl` files are also covered by `.gitignore`
- Always run this after editing any ontology JSON file
