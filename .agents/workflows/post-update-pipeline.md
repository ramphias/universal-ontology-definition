---
description: 每次修改 Ontology JSON 定义后的完整提交流水线操作指南
---

# 每次修改代码后需执行的更新动作 (Post-Update Pipeline)

在本项目（Universal Ontology Definition）中，每次修改代码（主要是新增或修改各层级 L1/L2/L3 的 `JSON` 本体定义文件）后，必须执行以下完整的连带更新与校验动作，以保证体系的一致性、文档的实时性以及跨平台绑定的正确同步。

由于你正在 `.agents/workflows` 中执行，可以直接使用带有 `// turbo` 标记的命令块进行自动化执行。

## 1. 规则校验与架构检查 (Validation)

如果修改了任何 JSON 结构，首要任务是确保没有破坏四层本体的硬性治理阈值。

// turbo
```bash
python scripts/validate_governance.py
```

// turbo
```bash
python scripts/validate_l3.py --all
```

## 2. 合并层级 (Merge Layers) 
*(针对具有依赖关系的企业私有层 L3 或 L2，可选)*
由于 L3 往往依赖 L1 和 L2，可运行 merge 脚本测试合并是否冲突。
```bash
# 示例：合并极客方舟的 Ontology (视你需要操作的具体 L3 而定)
# python scripts/merge_layers.py enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json
```

## 3. 多平台衍生物料生成 (Export Generation)

由于 JSON 作为唯一核心 Source of Truth，所有绑定的格式需要重新导出以同步：

// turbo
```bash
python scripts/json_to_owl.py
```

// turbo
```bash
python scripts/export_neo4j.py
```

// turbo
```bash
python scripts/export_for_llm.py
```

*(可选)* 如果需要提供给相关人员打包审阅（WebProtege）：
```bash
python scripts/pack_for_webprotege.py
```

## 4. 重新生成前端交互图谱 (Visualization)

自动读取最新的 JSON 数据，重新构建并覆盖可视化界面所用的静态或数据前端文件。

// turbo
```bash
python scripts/visualize_ontology.py
```

## 5. 项目主文档与部署更新 (Documentation)

如果新增了类、或新添加了行业目录，检查并更新：
1. `README.md` 与 `README_CN.md`
2. `mkdocs.yml` (如果增加了新页面)

生成并审核项目文档（如果有报错可提前修正，避免 GitHub Actions 挂掉）：
```bash
mkdocs build --strict
```

最后，正常推送到 Git，触发远程的构建进行二次验证即可。
