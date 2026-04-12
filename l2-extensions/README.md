# L2 — Industry & Domain Extensions

This directory contains **Layer 2 (L2) industry and domain extension packages** for the Universal Ontology Definition framework.

## What are Industry & Domain Extensions?

Each extension builds on the L1 universal core by adding industry-specific concepts:

- **Inherits** all L1 core classes and relations
- **Adds** industry-specific classes, relations, and instances
- **Follows** the unified JSON schema specification

## Available Extensions

| Industry | Directory | Version | Classes | Relations | Instances | Description |
|:---|:---|:---|:---:|:---:|:---:|:---|
| Consulting | [`consulting/`](consulting/) | v1.1.0 | 54 | 45 | 39 | Engagements, methodologies, deliverables, client relationships |
| Financial Services | [`financial-services/`](financial-services/) | v1.0.0 | 30 | 12 | 7 | Banking, insurance, asset management, KYC/AML, risk |
| Food & Beverage | [`fnb/`](fnb/) | v1.0.0 | 19 | 7 | - | Restaurants, menus, central kitchens, franchisees |
| Healthcare | [`healthcare/`](healthcare/) | v1.0.0 | 28 | 10 | 6 | Hospitals, pharma R&D, clinical trials, EHR, GMP |
| Luxury Goods | [`luxury-goods/`](luxury-goods/) | v2.0.0 | 39 | 14 | 22 | Brands, collections, ateliers, craftsmanship, authenticity |
| Manufacturing | [`manufacturing/`](manufacturing/) | v1.0.0 | 27 | 11 | 6 | Factory ops, production lines, BOM, MES/SCADA, OEE |
| Technology | [`technology/`](technology/) | v1.0.0 | 29 | 12 | 7 | SaaS, microservices, CI/CD, DevOps, DORA metrics |

**Total: 7 extensions, 226 classes, 111 relations**

## Contributing a New Extension

1. Copy [`_template/`](_template/) as your starting point
2. Follow the [Extension Development Guide](../docs-site/l2-extensions/create-extension.md)
3. Validate with `python scripts/validate_l3.py your_extension.json`
4. Submit a Pull Request

## Wanted Extensions

The following industries don't have extensions yet:

- Retail
- Education
- Real Estate
- Logistics & Supply Chain
- Energy
- Telecommunications
- Gaming & Entertainment
