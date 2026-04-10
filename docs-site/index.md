---
title: Home
hide:
  - navigation
  - toc
---

<div class="hero-section" markdown>

# :globe_with_meridians: Universal Ontology Definition | 通用本体定义

<p class="hero-subtitle">
An Open, Standardized Four-Layer Enterprise Ontology Framework<br>
一个开放、标准化的四层企业级本体架构
</p>

<div class="hero-badges">
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="License"></a>
  <a href="changelog/"><img src="https://img.shields.io/badge/Version-2.1.0-green.svg" alt="Version"></a>
  <a href="guides/contributing/"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
</div>

</div>

<h2 class="home-section-title">⚠️ The Problem | 核心痛点</h2>
<p class="home-section-desc">Enterprise digitalization commonly faces these challenges: <br>企业数字化进程中普遍面临以下挑战：</p>

<div class="problem-grid" markdown>

<div class="problem-card">
  <span class="problem-icon">🔴</span>
  <div class="problem-text">
    <strong>Inconsistent concept definitions | 概念定义不一致</strong>
    <span>Different teams use different terms for the same objects<br>不同团队对相同业务实体的理解和称呼存在分歧</span>
  </div>
</div>

<div class="problem-card">
  <span class="problem-icon">🔴</span>
  <div class="problem-text">
    <strong>Industry knowledge silos | 行业知识孤岛</strong>
    <span>Industry-specific knowledge is scattered with no standardized extension mechanism<br>缺乏标准化的机制来沉淀和传递特定行业的知识</span>
  </div>
</div>

<div class="problem-card">
  <span class="problem-icon">🔴</span>
  <div class="problem-text">
    <strong>Customization vs. standardization | 定制化与标准化的冲突</strong>
    <span>Enterprise-specific needs continuously erode the underlying structure<br>过度的企业定制需求不断破坏底层通用结构的稳定性</span>
  </div>
</div>

<div class="problem-card">
  <span class="problem-icon">🔴</span>
  <div class="problem-text">
    <strong>Platform lock-in | 平台绑定陷阱</strong>
    <span>Ontology definitions tied to a single serialization format<br>本体定义被绑定在单一的序列化格式或特定的数据库上</span>
  </div>
</div>

</div>

<h2 class="home-section-title">📐 The Solution: Four-Layer Architecture | 解决方案：四层架构</h2>
<p class="home-section-desc">A clean separation of concerns across four distinct layers:<br>通过四个明确分层的边界实现关注点分离：</p>

<div class="layer-diagram">

<div class="layer-card layer-l3">
  <span class="layer-tag">L3</span>
  <div class="layer-info">
    <strong>Enterprise Customization Layer | 企业个性定制层</strong>
    <span>Company A · Company B · Company C — Private extensions<br>独享私有扩展，实现租户物理隔离</span>
  </div>
  <span class="layer-arrow">▸</span>
</div>

<div class="layer-card layer-l2">
  <span class="layer-tag">L2</span>
  <div class="layer-info">
    <strong>Industry &amp; Domain Extensions | 行业与业务扩展层</strong>
    <span>Consulting · Luxury · Finance · Manufacturing — Optional, industry-specific<br>可选的特定垂直领域/行业知识包，即插即用</span>
  </div>
  <span class="layer-arrow">▸</span>
</div>

<div class="layer-card layer-l1">
  <span class="layer-tag">L1</span>
  <div class="layer-info">
    <strong>Universal Enterprise Ontology Core | 通用本体核心层</strong>
    <span>Entity / Governance / Operational / Measurement — Mandatory inheritance<br>强制继承的语义底座，企业数字化的“普通话”</span>
  </div>
  <span class="layer-arrow">▸</span>
</div>

<hr class="layer-divider">

<div class="layer-card layer-l0">
  <span class="layer-tag">L0</span>
  <div class="layer-info">
    <strong>Platform &amp; Syntax Bindings | 平台与语言绑定层</strong>
    <span>OWL/RDF · JSON-LD · GraphQL · SQL DDL — Technical serialization<br>提供从强语义到各种工程语言的直接映射</span>
  </div>
  <span class="layer-arrow">▸</span>
</div>

</div>

<h2 class="home-section-title">✨ Key Features | 核心特性</h2>

<div class="grid cards" markdown>

-   :building_construction: **Four-Layer Separation | 四层解耦机制**

    ---

    Stable semantic core, pluggable extensions, free enterprise customization.<br>稳定的L1语义内核，热拔插的L2扩展组件，不受限的L3企业定制空间。

-   :triangular_ruler: **Standardized Format | 结构化格式标准**

    ---

    Unified JSON Schema for classes, relations, and instances.<br>基于一套统一的 JSON Schema 模板校验所有类、关系及示例。

-   :link: **Inheritance & Extension | 继承与扩展体系**

    ---

    L2 extends L1, L3 extends L1+L2, with clear semantic lineage.<br>L2继承L1，L3继承L1与L2的交集，保证脉络清晰不断层。

-   :gear: **Platform Bindings | 全平台支持**

    ---

    Ready-to-use OWL/RDF, JSON-LD, GraphQL, and SQL mappings.<br>随版本发布开箱即用的 OWL、JSON-LD、图数据库与关系型数据库定义结构。

-   :globe_with_meridians: **Bilingual Support | 极致的双语支持**

    ---

    Every single concept includes standardized Chinese and English descriptors.<br>所有设计概念始终维持段落对齐的中英双语标注。

-   :handshake: **Community-Driven | 社区驱动共建**

    ---

    Anyone can contribute domains, bindings, or improve core models.<br>所有人都可以低迷们槛提交新的行业扩展及技术绑定实现。

</div>

<h2 class="home-section-title">🚀 Quick Links | 快速导航通道</h2>
<p class="home-section-desc">Jump right in — everything you need to get started: <br>迅速了解项目详情并立刻上手：</p>

<div class="quick-links-grid">

<a class="quick-link-card" href="getting-started/quick-start/">
  <span class="ql-icon">🚀</span>
  <div class="ql-info">
    <strong>Getting Started | 快速开始</strong>
    <span>Start using UOD in 5 minutes<br>只需5分钟启动并接入您的应用</span>
  </div>
</a>

<a class="quick-link-card" href="core/classes/">
  <span class="ql-icon">📦</span>
  <div class="ql-info">
    <strong>Core Classes | 核心类参考</strong>
    <span>Browse all 24 L1 core classes<br>查阅所有24个底层核心类详情</span>
  </div>
</a>

<a class="quick-link-card" href="architecture/four-layer-model/">
  <span class="ql-icon">🏗️</span>
  <div class="ql-info">
    <strong>Architecture | 架构深度剖析</strong>
    <span>Understand the four-layer design<br>透视整体架构背后的设计初衷</span>
  </div>
</a>

<a class="quick-link-card" href="extensions/">
  <span class="ql-icon">🧩</span>
  <div class="ql-info">
    <strong>Extensions | 行业垂直扩展</strong>
    <span>Browse available industry packages<br>浏览目前开源生态中包含的行业包</span>
  </div>
</a>

<a class="quick-link-card" href="extensions/create-extension/">
  <span class="ql-icon">🛠️</span>
  <div class="ql-info">
    <strong>Create Extension | 创建所属扩展</strong>
    <span>Contribute your industry extension<br>按照规范开发并提交自己的扩展</span>
  </div>
</a>

<a class="quick-link-card" href="guides/contributing/">
  <span class="ql-icon">🤝</span>
  <div class="ql-info">
    <strong>Contributing | 参与开源贡献</strong>
    <span>How to contribute to this project<br>了解如何参与到生态共建中来</span>
  </div>
</a>

</div>
