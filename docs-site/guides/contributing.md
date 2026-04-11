# Contributing

Thank you for your interest in Universal Ontology Definition! We welcome contributions of all kinds.

## Contribution Types

| Type | Description | Difficulty |
|:---|:---|:---|
| :bug: Bug Report | Definition errors, missing relations, JSON format issues | ⭐ |
| :bulb: Suggestion | Improvement proposals for Core Ontology | ⭐ |
| :memo: Documentation | Improve docs, fix translations, add examples | ⭐⭐ |
| :globe_with_meridians: Industry and Domain Extension | Contribute new industry domain packages | ⭐⭐⭐ |
| :building_construction: Core Modification | Structural changes to L1 core layer | ⭐⭐⭐⭐ |

## Code of Conduct

All participants must follow our [Code of Conduct](https://github.com/ramphias/universal-ontology-definition/blob/main/CODE_OF_CONDUCT.md).

## Modifying Core Ontology (L1)

Core Ontology is the foundation of the entire framework. Changes require careful review.

### Principles

1. **Stability First** — L1 only accepts cross-industry, cross-enterprise universal abstractions
2. **Non-destructive** — Addition preferred over modification; modification preferred over deletion
3. **Well-reasoned** — Must explain rationale and impact scope

### Process

1. Submit an Issue to discuss your proposal
2. After maintainer agreement, fork the repository
3. Make changes in the `core/` directory
4. Validate against `schema/core_schema.json`
5. Explain rationale and impact analysis in the PR description
6. Wait for at least 2 maintainer approvals

## Contributing Industry and Domain Extension (L2)

We highly welcome new Industry and Domain Extension!

1. Copy `extensions/_template/` to `extensions/your-industry/`
2. Follow naming convention: lowercase + hyphens (e.g., `financial-services`)
3. All classes must inherit from L1 via `parent` field
4. Include at least 10 classes, 5 relations, 5 sample instances
5. Write a complete README
6. Validate against `schema/extension_schema.json`
7. Submit a PR

See the detailed [Extension Development Guide](../l2-extensions/create-extension.md).

## Pull Request Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit: `git commit -m "feat: add healthcare Industry and Domain Extension"`
4. Push: `git push origin feature/your-feature-name`
5. Create a Pull Request using the project's template

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add healthcare Industry and Domain Extension
fix: correct relationship domain in consulting extension
docs: improve extension development guide
refactor: reorganize core ontology class hierarchy
```
