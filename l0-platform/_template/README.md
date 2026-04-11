# Platform Binding Contribution Template

Use this template as a starting point when contributing a new platform binding.

## Steps

1. **Create a new directory** under `platform/` with your platform name (e.g., `protobuf/`, `avro/`, `cypher/`)
2. **Implement the mapping** for all L1 core classes and relations
3. **Add a README.md** explaining your design decisions
4. **Submit a Pull Request**

## Required Files

```
platform/<your-platform>/
├── README.md              ← Explain design decisions, usage examples
└── <schema-file>          ← The actual binding file(s)
```

## Checklist

- [ ] All 25 L1 core classes are mapped
- [ ] All 16 L1 relations are mapped
- [ ] Bilingual labels (zh/en) are preserved where the format supports it
- [ ] README.md includes:
  - [ ] Files description
  - [ ] Design decisions table
  - [ ] Usage examples
  - [ ] Known limitations (if any)
- [ ] The binding follows the target platform's idiomatic conventions

## Naming Convention

| Ontology ID | Example Platform Conventions |
|:---|:---|
| `Party` | `party` (SQL), `Party` (GraphQL), `uod:Party` (RDF) |
| `plays_role` | `party_role` (SQL junction), `playsRole` (camelCase), `uod:plays_role` (RDF) |
| `label_zh` | `label_zh` (column), `labelZh` (GraphQL), `rdfs:label@zh` (RDF) |

## Contribution Guidelines

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the full contribution workflow.
