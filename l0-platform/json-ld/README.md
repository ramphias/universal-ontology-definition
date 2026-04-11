# JSON-LD Binding

This directory contains the JSON-LD `@context` definition for the L1 Universal Enterprise Ontology Core.

## Files

- `context.jsonld` — JSON-LD `@context` mapping L1 concepts to RDF URIs

## Usage

### Linking JSON Data to Ontology

Add the `@context` to any JSON document to make it semantically linked:

```json
{
  "@context": "https://raw.githubusercontent.com/ramphias/universal-ontology-definition/main/platform/json-ld/context.jsonld",
  "@type": "Organization",
  "id": "org_acme",
  "label_en": "Acme Corporation",
  "label_zh": "Acme 公司"
}
```

### Inline Context

```json
{
  "@context": {
    "uod": "https://w3id.org/uod/core/",
    "Organization": "uod:Organization",
    "label": "rdfs:label"
  },
  "@type": "Organization",
  "label": "Acme Corporation"
}
```

## What the Context Provides

- **Type aliases** — `"Organization"` → `uod:Organization`
- **Property aliases** — `"label_zh"` → `rdfs:label@zh`
- **Relation typing** — `"plays_role"` → `uod:plays_role` with `@type: @id`
- **Bilingual labels** — `label_zh` and `label_en` with language tags
