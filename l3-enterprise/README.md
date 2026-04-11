# Enterprise Customization Layer (L3)

The Enterprise Customization Layer (L3) is where specific organizations define their own private extensions to the Universal Core (L1) and Industry and Domain Extension (L2).

## 🏢 Why L3?

While the Universal Core and Industry and Domain Extension provide a standardized semantic foundation, every enterprise has unique needs:
- **Internal systems & IDs** — Mapping ontology classes to specific internal database tables or API endpoints.
- **Proprietary processes** — Definitions for workflows that are unique to the company's competitive advantage.
- **Specific KPI definitions** — Custom formulas for business performance measurement.
- **Organizational specificities** — Detailed mapping of internal departments and roles.

## 🏗️ Structure

Typically, an L3 implementation should follow this pattern:

```json
{
  "layer": "L3_enterprise_customization",
  "enterprise_id": "YourCompanyID",
  "version": "1.0.0",
  "extends": [
    "L1_universal_enterprise_ontology",
    "L2_consulting_industry_extension"
  ],
  "classes": [ ... ],
  "relations": [ ... ]
}
```

## 🚀 Getting Started

1. **Inherit**: Choose your L1 core and relevant L2 Industry and Domain Extension to extend.
2. **Define**: Add enterprise-specific classes. Use the `parent` field to link back to L1/L2 classes (e.g., `MySpecialProcess` extends `Process`).
3. **Map**: Use L0 platform bindings to deploy the ontology to your internal knowledge graph or data layer.

Refer to the [_template/](_template/) directory for a starting point.
