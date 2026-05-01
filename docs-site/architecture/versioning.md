# Versioning Model | 版本治理

UOD uses **two parallel version axes** that are intentionally decoupled. New users often confuse them — this page disambiguates.

UOD 使用**两套并行的版本号体系**，且有意保持解耦。新用户常常把它们搞混 —— 本页解释清楚。

## Two version axes | 两套版本号

| Axis | Where it lives | Bumped when | Today |
|---|---|---|---|
| **Repository version** | `README.md` badge, `CHANGELOG.md`, `RELEASE_NOTES.md`, GitHub releases | Any tooling, docs, scripts, schema, or content change ships | `2.4.0` |
| **L1 Ontology content version** | `l1-core/universal_ontology_v1.json` → `metadata.version` | Only when L1 classes / relations / axioms / attributes actually change | `2.1.0` |

仓库版本是**整个项目**（含工具、脚本、文档、Studio）的版本号；L1 本体内容版本只随 **L1 JSON 的实质性内容变化**而变。所以仓库到了 2.4.0 而 L1 内容仍停在 2.1.0 是正常的——多次发布只动了文档/CI/工具。

## Why decouple | 为什么解耦

The repo evolves much faster than the canonical model. Tooling, docs, examples, and Studio features ship every release; L1 content is deliberately frozen most of the time (governance rules G-01 through G-08 enforce slow evolution).

仓库迭代远快于权威模型本身。工具、文档、示例、Studio 几乎每次发版都改；而 L1 本体内容受 G-01 至 G-08 治理规则约束，刻意保持缓慢演进。

If we used a single version number, every CI tweak would force an L1 "version bump" that downstream consumers (L2 extensions, L3 enterprises) would have to react to. Decoupling lets downstream pin to the L1 content version they validated against, independent of repo churn.

如果用同一个版本号，每次 CI 调整都会强制 L1 "升版"，下游（L2/L3）都得跟着响应。解耦后下游可以仅锚定他们验证过的 L1 内容版本，不受仓库版本变动干扰。

## How L2 / L3 reference L1 | L2 / L3 如何引用 L1

L2 and L3 declare a `compatible_core_version` pointing at the **L1 ontology content version** (not the repo version):

L2 与 L3 在元数据中通过 `compatible_core_version` 引用 **L1 本体内容版本**（不是仓库版本）：

```jsonc
// l2-extensions/consulting/consulting_extension_v1.json
{
  "layer": "L2_consulting_industry_extension",
  "version": "1.1.1",
  "compatible_core_version": "2.1.0"   // ← L1 ontology content version
}
```

`scripts/validate_l3.py` compares `compatible_core_version` against the actual L1 `metadata.version` and warns on mismatches.

`scripts/validate_l3.py` 会用 `compatible_core_version` 与 L1 实际的 `metadata.version` 做对比，不一致时给出警告。

## What about L2 / L3 own versions | L2 / L3 自身版本

Each L2 and L3 has its own semver version, independent of both the repo and L1:

每个 L2 / L3 有自己的 semver，与仓库版本、L1 内容版本都独立：

| Layer | Field | Example |
|---|---|---|
| L1 | `metadata.version` | `2.1.0` |
| L2 | `version` | `1.1.1` (consulting) |
| L3 | `version` | `1.0.1` (acme-tech-solutions) |

This three-tier independence lets each layer evolve at its own pace, with `compatible_*_version` declarations forming the cross-layer contract.

这种三层独立的版本号让各层按自己的节奏演进，由 `compatible_*_version` 声明形成跨层契约。

## Summary | 一句话总结

> **Repo version = "what the project ships". L1 content version = "what the model says".** They are not the same and don't need to track each other.
>
> **仓库版本 = "项目发布了什么"；L1 内容版本 = "模型说了什么"。两者不同，也不需要联动。**
