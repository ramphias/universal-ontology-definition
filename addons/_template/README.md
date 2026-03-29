# Addon 贡献模板 | Addon Contribution Template

## 使用方法

1. 复制整个 `_template/` 目录到 `addons/your-industry-name/`
2. 将 `addon_template.json` 重命名为 `your_industry_addon_v1.json`
3. 修改本 README，替换为你的行业 Addon 说明
4. 按照 [Addon 开发指南](../../docs/addon-development-guide.md) 填写定义
5. 提交 Pull Request

## 目录命名规范

- 使用英文小写 + 连字符
- 示例：`financial-services`, `healthcare`, `manufacturing`

## 文件清单

- `README.md` — 行业 Addon 说明（必须）
- `your_industry_addon_v1.json` — 完整定义文件（必须）

## JSON 结构预览

```json
{
  "layer": "L2_your_industry_addon",
  "version": "1.0.0",
  "extends": "L1_universal_organization_ontology",
  "description": "...",
  "classes": [...],
  "relations": [...],
  "sample_instances": [...]
}
```
