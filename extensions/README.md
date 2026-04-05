# L2 — 行业与领域 Extension

本目录包含 Universal Ontology Definition 框架的 **第二层（L2）行业扩展包**。

## 什么是行业与业务领域扩展？

行业与业务领域扩展 是在 L1 通用层基础上，针对特定行业或业务领域的概念扩展。每个 Extension：

- 🔗 **继承** L1 的所有核心类和关系
- ➕ **新增** 行业特有的类、关系和实例
- 📐 **遵循** 统一的 JSON 格式规范

## 已有 Extension

| 行业 | 目录 | 版本 | 类 | 关系 | 说明 |
|:---|:---|:---|:---:|:---:|:---|
| 咨询行业 | [`consulting/`](consulting/) | v1.0.0 | 40+ | 34 | 覆盖项目、方法论、交付物、客户关系等 |
| 奢侈品行业 | [`luxury-goods/`](luxury-goods/) | v1.0.0 | 21 | 10 | 覆盖品牌、渠道、客户体验、溯源等 |

## 贡献新 Extension

1. 复制 [`_template/`](_template/) 目录
2. 按照模板修改定义
3. 阅读 [Extension 开发指南](../docs/extension-development-guide.md)
4. 提交 Pull Request

## 期待的行业与业务领域扩展

以下行业尚未有 Extension，欢迎社区贡献：

- 💰 金融服务（Banking & Financial Services）
- 🏭 制造业（Manufacturing）
- 🛒 零售业（Retail）
- 🏥 医疗健康（Healthcare）
- 🎓 教育（Education）
- 🏗️ 房地产（Real Estate）
- 🚚 物流与供应链（Logistics & Supply Chain）
- ⚡ 能源（Energy）
- 📡 电信（Telecommunications）
- 🎮 游戏与娱乐（Gaming & Entertainment）
