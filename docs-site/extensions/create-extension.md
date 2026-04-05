# Create Your Own Extension

This guide walks you through creating a new Industry and Domain Extension for UOD.

## Quick Start

### Step 1: Copy the Template

```bash
cp -r extensions/_template extensions/your-industry
mv extensions/your-industry/extension_template.json extensions/your-industry/your_industry_extension_v1.json
```

### Step 2: Edit Metadata

```json
{
  "layer": "L2_your_industry_extension",
  "version": "1.0.0",
  "extends": "L1_universal_organization_ontology",
  "description": "One-line description of your Industry and Domain Extension"
}
```

### Step 3: Define Classes

Each class must inherit from an L1 class via the `parent` field:

```json
{
  "classes": [
    {
      "id": "YourIndustryEntity",
      "label_zh": "行业实体",
      "parent": "Organization",
      "definition": "Clear Chinese definition"
    }
  ]
}
```

**Available L1 parent classes:**

| Parent Class | Use When |
|:---|:---|
| `Organization` | Industry-specific organizations |
| `OrgUnit` | Internal organizational units |
| `Role` | Industry-specific roles |
| `BusinessObject` | Core business entities |
| `ProductService` | Industry products or services |
| `Asset` | Industry asset types |
| `DocumentRecord` | Industry document types |
| `Process` | Industry workflows |
| `Capability` | Industry capabilities |
| `Risk` | Industry risks |
| `Policy` | Industry policies |
| `Rule` | Industry rules |
| `Control` | Industry control measures |
| `Event` | Industry events |
| `KPI` | Industry metrics |
| `SystemApplication` | Industry systems |
| `Channel` | Industry channels |

### Step 4: Define Relations

```json
{
  "relations": [
    {
      "id": "your_relation_name",
      "domain": "SourceClass",
      "range": "TargetClass",
      "definition": "Chinese definition"
    }
  ]
}
```

### Step 5: Add Sample Instances

Provide at least 5 real-world examples:

```json
{
  "sample_instances": [
    {
      "id": "instance_unique_id",
      "type": "YourIndustryEntity",
      "label": "Human-Readable Name"
    }
  ]
}
```

### Step 6: Write README

Include: overview, coverage, statistics, use cases.

## Quality Checklist

### Must Have

- [x] All classes have a `parent` pointing to an L1 class
- [x] All classes and relations have a `definition` field
- [x] Class IDs use PascalCase
- [x] Relation IDs use snake_case
- [x] At least 10 industry-specific classes
- [x] At least 5 industry-specific relations
- [x] At least 5 sample instances
- [x] Valid JSON passing schema validation
- [x] Complete README.md

### Nice to Have

- [ ] Provide `label_en` (English labels)
- [ ] Cover multiple business dimensions
- [ ] Real-world sample instances
- [ ] Definitions based on industry standards

## Anti-Patterns to Avoid

| Anti-Pattern | Description | Correct Approach |
|:---|:---|:---|
| Redefining L1 concepts | Creating L2 classes that duplicate L1 semantics | Inherit L1, extend with attributes |
| Over-granularity | Creating a class for each enum value | Use `type` or `category` attributes |
| Mixing enterprise concepts | Adding concepts specific to one company | Those belong in L3 |
| Overly broad relations | `related_to` type catch-all relations | Use specific verbs |

## Submission Process

1. Fork the repository
2. Create a branch: `git checkout -b extension/your-industry`
3. Add the complete extension directory
4. Submit a PR using the project's PR template
5. Wait for review (typically 1-2 weeks)
