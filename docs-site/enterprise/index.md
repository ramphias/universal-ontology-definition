# Enterprise Customization Layer (L3)

The Enterprise Customization Layer is where specific organizations define their own private extensions.

## Why L3?

While the Universal Core (L1) and Industry and Domain Extension (L2) provide a standardized semantic foundation, every enterprise has unique needs:

- **Internal systems & IDs** — Mapping ontology classes to specific internal database tables or API endpoints
- **Proprietary processes** — Definitions for workflows unique to the company's competitive advantage
- **Specific KPI definitions** — Custom formulas for business performance measurement
- **Organizational specificities** — Detailed mapping of internal departments and roles

## Structure

An L3 implementation follows this pattern:

```json
{
  "layer": "L3_enterprise_customization",
  "enterprise": {
    "name": "Your Company Name",
    "id": "YOUR_COMPANY_ID"
  },
  "version": "1.0.0",
  "extends": [
    "L1_universal_enterprise_ontology_v1",
    "L2_consulting_industry_extension"
  ],
  "classes": [
    {
      "id": "EnterpriseSpecificEntity",
      "label_zh": "企业特定实体",
      "label_en": "Enterprise Specific Entity",
      "parent": "BusinessObject",
      "definition": "A placeholder for entities unique to this enterprise."
    }
  ],
  "relations": [
    {
      "id": "isManagedByDepartment",
      "label_zh": "由部门管理",
      "label_en": "is managed by department",
      "domain": "EnterpriseSpecificEntity",
      "range": "OrgUnit"
    }
  ]
}
```

## Getting Started

1. **Inherit**: Choose your L1 core and relevant L2 Industry and Domain Extension to extend
2. **Define**: Add enterprise-specific classes using the `parent` field to link back to L1/L2 classes
3. **Map**: Use L0 platform bindings to deploy the ontology to your internal knowledge graph or data layer

!!! tip "Template Available"
    Use the template at `enterprise/_template/enterprise_ontology_template.json` as your starting point.

## Important Notes

!!! warning "L3 is Private"
    L3 definitions are **not** shared publicly. They should remain within your organization's private infrastructure. Do not submit L3 content as pull requests to the public repository.

!!! info "L3 Inheritance Rules"
    - L3 **must** extend L1 (mandatory)
    - L3 **may** extend one or more L2 extensions (optional)
    - L3 cannot override core definitions from L1 or L2
    - L3 classes must use the `parent` field to inherit from L1/L2 classes
