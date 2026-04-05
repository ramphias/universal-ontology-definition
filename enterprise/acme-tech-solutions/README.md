# 极客方舟科技 — L3 企业定制 Ontology 示例

## 📋 概述

**极客方舟科技 (Acme Tech Solutions)** 是一家 **虚构的** 中型科技咨询公司，用于演示 L3 企业定制层的完整创建流程。

> ⚠️ **声明：** 本目录中的所有公司名、项目名和数据均为虚构，仅用于演示目的。

## 🏢 企业简介

| 属性 | 值 |
|:---|:---|
| 公司名称 | 极客方舟科技 (Acme Tech Solutions) |
| 行业类型 | 科技咨询 |
| 员工规模 | 500-1000 人 |
| 总部所在地 | 北京 |
| 核心业务 | 云迁移、AI 平台建设、数据治理、DevSecOps |
| 市场区域 | 大中华区 |

## 📐 继承链

```
L1 Universal Core v2.0 (24 类 / 12 关系)
    └── L2 Consulting Industry Addon v1.1 (40+ 类 / 34 关系)
        └── L3 Acme Tech Solutions v1.0 (26 类 / 10 关系 / 34 实例)
```

## 📁 文件清单

| 文件 | 说明 |
|:---|:---|
| `acme_tech_solutions_ontology_v1.json` | L3 Ontology 源文件（JSON 格式） |
| `acme_tech_solutions_ontology_v1.ttl` | OWL/RDF Turtle 格式（自动生成） |
| `README.md` | 本说明文件 |

## 🔗 用法

### 浏览 Ontology 内容
直接查看 `.json` 文件了解类、关系和实例定义。

### 导入 Protégé
1. 下载 [Protégé](https://protege.stanford.edu/)
2. File → Open → 选择 `.ttl` 文件
3. 在 Class Hierarchy 中浏览类继承结构

### 重新生成 OWL Turtle
修改 `.json` 源文件后，运行：
```bash
python scripts/json_to_owl.py enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json
```

## 📖 创建指南

如果你想创建自己的 L3 企业 Ontology，请参考 [README_CN.md](../../README_CN.md) 中的 **"Ontology 创建与更新完整指南"** 部分。
