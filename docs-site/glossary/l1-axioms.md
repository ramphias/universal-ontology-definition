# L1 Axioms Reference / L1 公理参考

All 18 axioms defined in L1 Core v2.0, plus explanations of the 12 axiom types available in UOD.

L1 Core v2.0 中定义的全部 18 个公理，以及 UOD 可用的 12 种公理类型说明。

## Axiom Types / 公理类型

| Type | OWL 2 Mapping | EN Description | ZH 描述 |
|:---|:---|:---|:---|
| `disjoint` | `owl:disjointWith` | Two or more classes cannot share instances | 两个或多个类不能共享实例 |
| `transitive` | `owl:TransitiveProperty` | If A→B and B→C, then A→C | 如果 A→B 且 B→C，则 A→C |
| `asymmetric` | `owl:AsymmetricProperty` | If A→B, then B cannot →A | 如果 A→B，则 B 不能→A |
| `symmetric` | `owl:SymmetricProperty` | If A→B, then B→A | 如果 A→B，则 B→A |
| `existential` | `owl:someValuesFrom` | At least one value must exist from a given class | 至少存在一个来自指定类的值 |
| `universal` | `owl:allValuesFrom` | All values must come from a given class | 所有值必须来自指定类 |
| `cardinality_min` | `owl:minCardinality` | Minimum number of values for a property | 属性的最小值数量 |
| `cardinality_max` | `owl:maxCardinality` | Maximum number of values for a property | 属性的最大值数量 |
| `cardinality_exact` | `owl:cardinality` | Exact number of values for a property | 属性的精确值数量 |
| `functional` | `owl:FunctionalProperty` | At most one value per subject | 每个主语最多一个值 |
| `inverse_functional` | `owl:InverseFunctionalProperty` | Each value maps back to exactly one subject | 每个值恰好映射回一个主语 |
| `subproperty` | `rdfs:subPropertyOf` | One relation is a specialization of another | 一个关系是另一个关系的特化 |

---

## Disjoint Axioms / 不相交公理

These axioms ensure that instances cannot belong to multiple conflicting classes simultaneously.

这些公理确保实例不能同时属于多个冲突的类。

### ax_person_org_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Person`, `Organization` |

**EN**: An instance cannot be both a Person and an Organization.

**ZH**: 一个实例不能同时是人员和组织。

---

### ax_entity_governance_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Entity`, `Governance` |

**EN**: Entity domain and Governance domain instances are mutually exclusive.

**ZH**: 实体域和治理域的实例互斥。

---

### ax_entity_operational_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Entity`, `Operational` |

**EN**: Entity domain and Operational domain instances are mutually exclusive.

**ZH**: 实体域和运营域的实例互斥。

---

### ax_entity_measurement_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Entity`, `Measurement` |

**EN**: Entity domain and Measurement domain instances are mutually exclusive.

**ZH**: 实体域和度量域的实例互斥。

---

### ax_governance_operational_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Governance`, `Operational` |

**EN**: Governance domain and Operational domain instances are mutually exclusive.

**ZH**: 治理域和运营域的实例互斥。

---

### ax_governance_measurement_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Governance`, `Measurement` |

**EN**: Governance domain and Measurement domain instances are mutually exclusive.

**ZH**: 治理域和度量域的实例互斥。

---

### ax_operational_measurement_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Operational`, `Measurement` |

**EN**: Operational domain and Measurement domain instances are mutually exclusive.

**ZH**: 运营域和度量域的实例互斥。

!!! info "Domain Disjointness / 域互斥性"
    The 6 inter-domain disjoint axioms above ensure that **all 4 semantic domains are pairwise mutually exclusive**. No instance can belong to classes from two different domains.

---

### ax_policy_rule_disjoint

| Field | Value |
|:---|:---|
| **Type** | `disjoint` |
| **Classes** | `Policy`, `Rule` |

**EN**: An instance cannot be both a Policy and a Rule.

**ZH**: 一个实例不能同时是政策和规则。

---

## Relation Property Axioms / 关系属性公理

### ax_part_of_transitive

| Field | Value |
|:---|:---|
| **Type** | `transitive` |
| **Relation** | `part_of` |

**EN**: If A is part of B and B is part of C, then A is part of C.

**ZH**: 如果 A 是 B 的一部分，B 是 C 的一部分，则 A 是 C 的一部分。

---

### ax_part_of_asymmetric

| Field | Value |
|:---|:---|
| **Type** | `asymmetric` |
| **Relation** | `part_of` |

**EN**: If A is part of B, then B cannot be part of A.

**ZH**: 如果 A 是 B 的一部分，则 B 不能是 A 的一部分。

---

## Universal (Range Restriction) Axioms / 全称（值域限制）公理

### ax_owns_domain_party

| Field | Value |
|:---|:---|
| **Type** | `universal` |
| **Subject** | `Party` |
| **Relation** | `owns` |
| **Object** | `Resource` |

**EN**: The owns relation is restricted to Party subclasses as domain and Resource subclasses as range. Only Parties can own Resources.

**ZH**: owns 关系的域限制为 Party 子类，值域限制为 Resource 子类。只有 Party 可以拥有 Resource。

---

### ax_governed_by_range_governance

| Field | Value |
|:---|:---|
| **Type** | `universal` |
| **Subject** | `Operational` |
| **Relation** | `governed_by` |
| **Object** | `Governance` |

**EN**: All objects linked via governed_by must be subclasses of the Governance domain.

**ZH**: 所有通过 governed_by 关联的对象必须是 Governance 域的子类。

---

## Existential (Minimum Existence) Axioms / 存在性公理

### ax_process_realizes_capability

| Field | Value |
|:---|:---|
| **Type** | `existential` |
| **Subject** | `Capability` |
| **Relation** | `realized_by` |
| **Object** | `Process` |

**EN**: Every Capability is realized by at least one Process.

**ZH**: 每个能力至少由一个流程实现。

---

### ax_risk_mitigated_by_control

| Field | Value |
|:---|:---|
| **Type** | `existential` |
| **Subject** | `Risk` |
| **Relation** | `mitigated_by` |
| **Object** | `Control` |

**EN**: Every Risk is mitigated by at least one Control measure.

**ZH**: 每个风险至少由一个控制措施缓释。

---

### ax_kpi_measures_operational

| Field | Value |
|:---|:---|
| **Type** | `existential` |
| **Subject** | `KPI` |
| **Relation** | `measured_by` |
| **Object** | `Operational` |

**EN**: Every KPI is linked to at least one Operational element it measures.

**ZH**: 每个关键指标至少关联一个被衡量的运营元素。

---

### ax_kpi_evaluates_goal

| Field | Value |
|:---|:---|
| **Type** | `existential` |
| **Subject** | `KPI` |
| **Relation** | `evaluates` |
| **Object** | `Goal` |

**EN**: Every KPI evaluates at least one Goal.

**ZH**: 每个关键指标至少评估一个目标。

---

### ax_plays_role_domain_party

| Field | Value |
|:---|:---|
| **Type** | `existential` |
| **Subject** | `Role` |
| **Relation** | `plays_role` |
| **Object** | `Party` |

**EN**: Every Role is played by at least one Party.

**ZH**: 每个角色至少被一个主体扮演。

---

## Cardinality Axioms / 基数公理

### ax_org_min_one_role

| Field | Value |
|:---|:---|
| **Type** | `cardinality_min` |
| **Subject** | `Organization` |
| **Relation** | `plays_role` |
| **Value** | 1 |

**EN**: Every Organization plays at least one Role.

**ZH**: 每个组织至少扮演一个角色。

---

## Subproperty Axioms / 子属性公理

### ax_composed_of_sub_part_of

| Field | Value |
|:---|:---|
| **Type** | `subproperty` |
| **Relation** | `composed_of` |
| **Parent Relation** | `part_of` |

**EN**: The composition relation is a specialization of the part-of relation. This preserves backward compatibility for systems still using `composed_of`.

**ZH**: 组成关系是部分关系的特化形式。这为仍在使用 `composed_of` 的系统保留向后兼容。
