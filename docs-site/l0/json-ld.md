# JSON-LD Context | 全局语义解析

JSON-LD Context solves the problem of "globally unique identity" for the knowledge graph when operating in standard HTTP systems and isolated IT environments.

## How it works | 转换机制

- The auto-compiler generates a `@context` dictionary mapping all JSON fields and classes to global Web URIs (e.g. `uod:core/Organization`).
- When a document is transmitted across the internet, the JSON-LD context ensures there is no dispute about what `Organization` means.
- Links native RDF capabilities and mappings without breaking normal readable JSON formats for your REST engineers.

## Example | 示例代码

```json
{
  "@context": {
    "@version": 1.1,
    "uod": "https://w3id.org/uod/core/",
    "owl": "http://www.w3.org/2002/07/owl#",
    "Organization": "uod:Organization"
  }
}
```
