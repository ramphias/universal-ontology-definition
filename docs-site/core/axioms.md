# Axioms Reference

Axioms are formal semantic constraints that express logical assertions about how L1 classes and relations must behave. They map directly to OWL 2 constructs and can be consumed by reasoners, knowledge graphs, and AI agents.

!!! info "Axioms vs. Other Constraints"
    - **JSON Schema** validates file structure (field types, naming patterns)
    - **Governance Rules (G-01~G-08)** enforce process and evolution constraints
    - **Axioms** express domain-level semantic truths (disjointness, cardinality, transitivity)

    These three mechanisms are independent and complementary.

## Axiom Types

| Type | OWL 2 Mapping | Description |
|------|---------------|-------------|
| `disjoint` | `owl:disjointWith` | Two or more classes cannot share instances |
| `cardinality_min` | `owl:minCardinality` | Minimum number of values for a property |
| `cardinality_max` | `owl:maxCardinality` | Maximum number of values for a property |
| `cardinality_exact` | `owl:cardinality` | Exact number of values for a property |
| `existential` | `owl:someValuesFrom` | At least one value must exist from a given class |
| `universal` | `owl:allValuesFrom` | All values must come from a given class |
| `functional` | `owl:FunctionalProperty` | Property has at most one value per subject |
| `inverse_functional` | `owl:InverseFunctionalProperty` | Each value maps back to exactly one subject |
| `symmetric` | `owl:SymmetricProperty` | If A relates to B, then B relates to A |
| `asymmetric` | `owl:AsymmetricProperty` | If A relates to B, then B cannot relate to A |
| `transitive` | `owl:TransitiveProperty` | If A-B and B-C, then A-C |
| `subproperty` | `rdfs:subPropertyOf` | One relation is a specialization of another |

## Axiom JSON Structure

```json
{
  "id": "ax_person_org_disjoint",
  "type": "disjoint",
  "label_zh": "...",
  "label_en": "Person and Organization are disjoint",
  "classes": ["Person", "Organization"],
  "status": "stable",
  "since": "2.1.0",
  "definition": "...",
  "definition_en": "An instance cannot be both a Person and an Organization"
}
```

All axiom IDs use the `ax_` prefix with snake_case naming (e.g., `ax_part_of_transitive`).

## L1 Core Axioms

### Disjoint Class Axioms

| ID | Classes | Description |
|----|---------|-------------|
| `ax_person_org_disjoint` | Person, Organization | A natural person cannot also be an organization |
| `ax_entity_governance_disjoint` | Entity, Governance | Entity and Governance domains are mutually exclusive |
| `ax_entity_operational_disjoint` | Entity, Operational | Entity and Operational domains are mutually exclusive |
| `ax_entity_measurement_disjoint` | Entity, Measurement | Entity and Measurement domains are mutually exclusive |
| `ax_governance_operational_disjoint` | Governance, Operational | Governance and Operational domains are mutually exclusive |
| `ax_governance_measurement_disjoint` | Governance, Measurement | Governance and Measurement domains are mutually exclusive |
| `ax_operational_measurement_disjoint` | Operational, Measurement | Operational and Measurement domains are mutually exclusive |
| `ax_policy_rule_disjoint` | Policy, Rule | A policy cannot also be a rule |

### Property Characteristics

| ID | Relation | Type | Description |
|----|----------|------|-------------|
| `ax_part_of_transitive` | `part_of` | transitive | If A is part of B and B is part of C, then A is part of C |
| `ax_part_of_asymmetric` | `part_of` | asymmetric | If A is part of B, then B cannot be part of A |

### Existential Constraints

| ID | Subject | Relation | Object | Description |
|----|---------|----------|--------|-------------|
| `ax_process_realizes_capability` | Capability | `realized_by` | Process | Every Capability is realized by at least one Process |
| `ax_risk_mitigated_by_control` | Risk | `mitigated_by` | Control | Every Risk is mitigated by at least one Control |
| `ax_kpi_measures_operational` | KPI | `measured_by` | Operational | Every KPI measures at least one Operational element |
| `ax_plays_role_domain_party` | Role | `plays_role` | Party | Every Role is played by at least one Party |

### Universal Constraints

| ID | Subject | Relation | Object | Description |
|----|---------|----------|--------|-------------|
| `ax_owns_domain_party` | Party | `owns` | Resource | All things owned must be Resources |
| `ax_governed_by_range_governance` | Operational | `governed_by` | Governance | All governance targets must be Governance subclasses |

### Cardinality Constraints

| ID | Subject | Relation | Min | Description |
|----|---------|----------|-----|-------------|
| `ax_org_min_one_role` | Organization | `plays_role` | 1 | Every Organization plays at least one Role |

### Subproperty Axioms

| ID | Relation | Parent | Description |
|----|----------|--------|-------------|
| `ax_composed_of_sub_part_of` | `composed_of` | `part_of` | Composition is a specialization of part-of |

## OWL 2 Mapping Examples

=== "Disjoint"

    ```turtle
    uod:Person owl:disjointWith uod:Organization .

    # For multiple classes:
    [] a owl:AllDisjointClasses ;
        owl:members ( uod:Entity uod:Governance uod:Operational uod:Measurement ) .
    ```

=== "Transitive"

    ```turtle
    uod:part_of a owl:TransitiveProperty .
    ```

=== "Existential"

    ```turtle
    uod:Capability rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty uod:realized_by ;
        owl:someValuesFrom uod:Process
    ] .
    ```

=== "Cardinality"

    ```turtle
    uod:Organization rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty uod:plays_role ;
        owl:minCardinality "1"^^xsd:nonNegativeInteger
    ] .
    ```

## Scope

Axioms are **L1-only**. L2 Industry Addons and L3 Enterprise layers do not define their own axioms. All semantic constraints are centrally managed in the core ontology to maintain consistency.
