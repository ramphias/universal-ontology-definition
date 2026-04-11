# GraphQL Schema Binding | 接口结构绑定

The GraphQL binding translates the semantic knowledge graph into an API schema, allowing frontend applications and integration layers to easily query and traverse the ontology's edge network.

## How it works | 转换机制

- **Abstract Classes**: Projected as GraphQL `interface` definitions (e.g., `interface Entity`). This strongly typed relationship helps API developers query across different polymorphous objects.
- **Concrete Classes**: Projected as standard `type` definitions that `implements` their abstract parent layer.
- **Relations**: Transformed into direct Edge property queries arrays directly on the node (e.g., querying for all consumed resources inside a Process).

## Example | 示例代码

```graphql
"""Organization (组织) [L1]"""
type Organization implements Party {
  id: ID!
  labelZh: String!
  labelEn: String
  definition: String
  sourceLayer: String
}
```
