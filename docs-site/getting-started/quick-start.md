# Quick Start

Get started with Universal Ontology Definition in just a few minutes.

## Step 1: Clone the Repository

```bash
git clone https://github.com/ramphias/universal-ontology-definition.git
cd universal-ontology-definition
```

## Step 2: Explore the Core Ontology

Open `core/universal_ontology_v1.json` to see all **24 core classes** and **12 standard relations**.

The core ontology covers these universal enterprise domains:

| Category | Core Classes |
|:---|:---|
| Party & Organization | `Party`, `Person`, `Organization`, `OrgUnit`, `Role` |
| Capability & Process | `Capability`, `Process`, `Activity` |
| Resources | `Resource`, `ProductService`, `Asset` |
| Data & Systems | `DataObject`, `Document`, `SystemApplication` |
| Governance & Compliance | `Policy`, `Rule`, `Control`, `Risk` |
| Decision & Measurement | `Event`, `Decision`, `Goal`, `KPI` |
| Market & Channel | `Location`, `Channel`, `MarketSegment` |

## Step 3: Choose Your Platform Binding (L0)

Pick the binding that matches your technology stack:

=== "OWL/RDF"

    Best for **knowledge graphs**, **SPARQL queries**, and **Semantic Web** applications.

    ```turtle
    uod:Organization a owl:Class ;
        rdfs:subClassOf uod:Party ;
        rdfs:label "Organization"@en ;
        rdfs:label "组织"@zh .
    ```

    File: `platform/owl-rdf/core_ontology.ttl`

=== "JSON-LD"

    Best for **REST APIs**, **Linked Data**, and **Web standards**.

    File: `platform/json-ld/context.jsonld`

=== "GraphQL"

    Best for **modern API layers** and **frontend integration**.

    ```graphql
    type Organization implements Party {
      id: ID!
      labelZh: String!
      labelEn: String!
      units: [OrgUnit!]!
    }
    ```

    File: `platform/graphql/schema.graphql`

=== "SQL DDL"

    Best for **relational databases** and **data warehouses**.

    ```sql
    CREATE TABLE organization (
        id UUID PRIMARY KEY REFERENCES party(id),
        legal_name VARCHAR(500),
        industry VARCHAR(100)
    );
    ```

    File: `platform/sql/schema.sql`

## Step 4: Select Industry and Domain Extension (Optional)

Browse the `l2-extensions/` directory for industry-specific extensions:

| Industry | Classes | Relations | Status |
|:---|:---:|:---:|:---|
| [Consulting](../l2-extensions/consulting.md) | 54 | 45 | v1.1.0 |
| [Financial Services](../l2-extensions/financial-services.md) | 30 | 12 | v1.0.0 |
| Food & Beverage | 19 | 7 | v1.0.0 |
| [Healthcare](../l2-extensions/healthcare.md) | 28 | 10 | v1.0.0 |
| [Luxury Goods](../l2-extensions/luxury-goods.md) | 39 | 14 | v2.0.0 |
| [Manufacturing](../l2-extensions/manufacturing.md) | 27 | 11 | v1.0.0 |
| [Technology](../l2-extensions/technology.md) | 29 | 12 | v1.0.0 |

Each extension extends L1 through the `extends` field:

```json
{
  "layer": "L2_consulting_industry_extension",
  "version": "1.0.0",
  "extends": "L1_universal_organization_ontology",
  "classes": [
    {
      "id": "ConsultingFirm",
      "label_zh": "咨询公司",
      "parent": "Organization",
      "definition": "An enterprise entity providing professional consulting services"
    }
  ]
}
```

## Step 5: Create Enterprise Extensions (L3)

If you need company-specific customizations, use the L3 template:

1. Copy `enterprise/_template/` as your starting point
2. Define your custom classes that extend L1 or L2
3. Deploy using your preferred L0 platform binding

## What's Next?

- [Core Concepts](core-concepts.md) — Understand key UOD terminology
- [Architecture Deep Dive](../architecture/four-layer-model.md) — Learn the full four-layer design
- [Create an Extension](../l2-extensions/create-extension.md) — Contribute your own industry package
