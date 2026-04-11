# OWL/RDF Binding

This directory contains the OWL 2 / RDF serialization of the L1 Universal Enterprise Ontology Core.

## Files

- `core_ontology.ttl` — Turtle format OWL 2 ontology

## Usage

### Loading with RDFLib (Python)

```python
from rdflib import Graph

g = Graph()
g.parse("core_ontology.ttl", format="turtle")

# Query all classes
for s, p, o in g.triples((None, RDF.type, OWL.Class)):
    print(s)
```

### SPARQL Query

```sparql
PREFIX ont: <https://w3id.org/uod/core/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?class ?label ?comment WHERE {
  ?class a owl:Class .
  ?class rdfs:label ?label .
  OPTIONAL { ?class rdfs:comment ?comment }
}
```

## Namespace

- **Base URI**: `https://w3id.org/uod/core/`
- **Prefix**: `uod:`
