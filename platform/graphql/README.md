# GraphQL Binding

This directory contains the GraphQL Schema definition for the L1 Universal Enterprise Ontology Core.

## Files

- `schema.graphql` — GraphQL SDL type definitions

## Design Decisions

| Ontology Concept | GraphQL Mapping |
|:---|:---|
| Class with subclasses | `interface` (e.g., `Party`, `BusinessObject`) |
| Leaf class | `type` implementing interface |
| `parent` (inheritance) | `implements` keyword |
| Object property (1:N) | Field returning `[Type!]!` |
| Object property (N:1) | Field returning `Type!` |
| Bilingual labels | `labelZh` and `labelEn` fields |

## Usage

```graphql
query {
  organizations(limit: 10) {
    id
    labelEn
    units {
      labelZh
    }
    roles {
      labelEn
      accountableFor {
        labelEn
        realizedBy {
          labelEn
        }
      }
    }
  }
}
```
