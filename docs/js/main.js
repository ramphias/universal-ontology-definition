/* ============================================================
   Universal Ontology Definition — Website Interactions
   Features: Hero canvas, scroll effects, i18n, mobile menu
   ============================================================ */

(function () {
  'use strict';

  // ── Hero Canvas — Network Node Visualization ──────────────
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes, animationId;
    const NODE_COUNT = 60;
    const CONNECTION_DIST = 150;
    const MOUSE = { x: -1000, y: -1000 };

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          color: ['#818cf8', '#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'][Math.floor(Math.random() * 5)],
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = `rgba(129, 140, 248, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        // Mouse attraction
        const mdx = MOUSE.x - node.x;
        const mdy = MOUSE.y - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200) {
          node.vx += mdx * 0.00005;
          node.vy += mdy * 0.00005;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Clamp
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Draw glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
        gradient.addColorStop(0, node.color + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    function initCanvas() {
      resize();
      createNodes();
      draw();
    }

    window.addEventListener('resize', () => {
      resize();
      // Re-clamp nodes
      if (nodes) {
        for (const n of nodes) {
          n.x = Math.min(n.x, width);
          n.y = Math.min(n.y, height);
        }
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      MOUSE.x = e.clientX - rect.left;
      MOUSE.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      MOUSE.x = -1000;
      MOUSE.y = -1000;
    });

    initCanvas();
  }

  // ── Navbar Scroll Effect ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── Smooth Scroll for Nav Links ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });

  // ── Mobile Menu Toggle ────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // ── Scroll Animations (Intersection Observer) ─────────────
  const animElements = document.querySelectorAll('.animate-on-scroll');
  if (animElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    animElements.forEach(el => observer.observe(el));
  }

  // ── Architecture Layer Interactivity ──────────────────────
  const archLayers = document.querySelectorAll('.arch-layer');
  archLayers.forEach(layer => {
    layer.addEventListener('mouseenter', () => {
      archLayers.forEach(l => l.classList.remove('active'));
      layer.classList.add('active');
    });
    layer.addEventListener('mouseleave', () => {
      layer.classList.remove('active');
    });
  });

  // ── i18n: Language Toggle ─────────────────────────────────
  const translations = {
    zh: {
      // Nav
      'nav.logo': 'UOD',
      'nav.architecture': '架构',
      'nav.core': '核心本体',
      'nav.addons': '行业扩展',
      'nav.how': '使用方式',
      'nav.community': '社区',

      // Hero
      'hero.badge': '开源 · Apache 2.0',
      'hero.title1': '企业本体的',
      'hero.title2': '开放标准',
      'hero.subtitle': '标准化三层框架，服务于企业知识图谱、语义层、主数据管理与 AI Agent 知识库。',
      'hero.cta1': '开始使用',
      'hero.cta2': '在 GitHub 查看',
      'hero.stat1': '核心类',
      'hero.stat2': '关系',
      'hero.stat3': '行业扩展',
      'hero.stat4': '层级',

      // Problem
      'problem.badge': '❓ 挑战',
      'problem.title': '企业数字化面临的挑战',
      'problem.subtitle': '全球企业在构建知识体系时都会遇到这些反复出现的障碍。',
      'problem.card1.title': '概念定义不一致',
      'problem.card1.desc': '不同团队使用不同术语描述同一对象，导致跨系统复用困难。',
      'problem.card2.title': '行业知识孤岛',
      'problem.card2.desc': '行业特有知识分散在各组织中，缺乏标准化的扩展机制。',
      'problem.card3.title': '定制与标准冲突',
      'problem.card3.desc': '企业个性化需求不断侵蚀底层标准，破坏兼容性。',

      // Architecture
      'arch.badge': '🏗️ 架构',
      'arch.title': '三层本体框架',
      'arch.subtitle': '平衡通用核心、行业扩展和企业定制的分层架构。',
      'arch.l3.title': '企业个性化定制层',
      'arch.l3.desc': '私有扩展 — 企业专属对象、系统映射和内部术语。',
      'arch.l3.item1': '企业 A',
      'arch.l3.item2': '企业 B',
      'arch.l3.item3': '企业 C',
      'arch.l3.item4': '定制对象',
      'arch.l3.item5': '系统映射',
      'arch.l2.title': '行业与业务领域扩展',
      'arch.l2.desc': '可选的、社区维护的行业特定概念扩展。',
      'arch.l1.title': '通用企业本体核心',
      'arch.l1.desc': '必须继承的稳定基础 — 25 个通用类和 16 个标准关系。',

      // Core
      'core.badge': '📐 L1 核心',
      'core.title': '核心本体浏览器',
      'core.subtitle': '25 个通用实体类分为 7 大类别，涵盖所有核心企业概念。',
      'core.cat1.title': '主体与组织',
      'core.cat2.title': '能力与流程',
      'core.cat3.title': '业务对象',
      'core.cat4.title': '数据与系统',
      'core.cat5.title': '治理与合规',
      'core.cat6.title': '决策与度量',
      'core.cat7.title': '市场与渠道',
      'core.tip.party': '可参与业务关系与治理关系的主体总类',
      'core.tip.person': '自然人主体',
      'core.tip.org': '法人或非法人组织',
      'core.tip.orgunit': '组织内部单元：部门、团队',
      'core.tip.role': '在特定上下文中承担的身份或职责',
      'core.tip.cap': '组织稳定具备的可复用业务能力',
      'core.tip.process': '为实现业务目标的端到端活动序列',
      'core.tip.activity': '流程中的可执行步骤',
      'core.tip.bobj': '被业务过程创建、变更或管理的对象',
      'core.tip.product': '企业对外提供的产品和服务',
      'core.tip.asset': '财务、实物、知识、数据等资产',
      'core.tip.data': '结构化或非结构化的数据实体',
      'core.tip.doc': '合同、报告、文件和记录',
      'core.tip.sys': '支撑流程和决策的软件系统',
      'core.tip.policy': '管理原则与约束要求',
      'core.tip.rule': '可执行的业务或控制规则',
      'core.tip.control': '降低风险、保障合规的控制措施',
      'core.tip.risk': '可能影响目标实现的不确定事件',
      'core.tip.event': '业务或技术环境中的状态变化',
      'core.tip.decision': '对事件、规则或目标做出的选择',
      'core.tip.goal': '组织希望达成的结果',
      'core.tip.kpi': '衡量目标达成程度的指标',
      'core.tip.location': '组织运营或交易发生的地点',
      'core.tip.channel': '与客户、伙伴或内部用户的交互渠道',
      'core.tip.market': '客户或市场的分类维度',

      // Addons
      'addons.badge': '🧩 L2 扩展',
      'addons.title': '行业扩展市场',
      'addons.subtitle': '构建在通用核心之上的可插拔行业扩展。社区驱动，持续增长。',
      'addons.consulting.title': '咨询行业',
      'addons.consulting.desc': '完整的咨询公司本体 — 项目参与、交付物、方法论、框架、实践线等。',
      'addons.luxury.title': '奢侈品行业',
      'addons.luxury.desc': '奢侈品牌本体 — 品牌传承、产品系列、SKU、精品店、匠心工艺。',
      'addons.finance.title': '金融服务',
      'addons.finance.desc': '银行、保险、投资管理 — 账户、金融工具、合规框架和监管实体。',
      'addons.mfg.title': '制造业',
      'addons.mfg.desc': '生产线、BOM、质量控制、供应链实体和精益制造概念。',
      'addons.stat.classes': '类',
      'addons.stat.relations': '关系',
      'addons.stat.instances': '实例',
      'addons.coming': '即将推出',

      // How It Works
      'how.badge': '🚀 快速开始',
      'how.title': '使用方式',
      'how.subtitle': '三个简单步骤，将 Universal Ontology Definition 集成到您的企业中。',
      'how.step1.title': '继承核心',
      'how.step1.desc': '从 L1 开始 — 25 个通用类和 16 个关系提供结构基础。',
      'how.step2.title': '扩展行业',
      'how.step2.desc': '选择 L2 行业扩展 — 或贡献您自己的。每个扩展无缝继承核心。',
      'how.step3.title': '企业定制',
      'how.step3.desc': '构建 L3 私有扩展 — 企业专属对象、系统映射、内部策略。',

      // Community
      'comm.badge': '🤝 社区',
      'comm.title': '加入社区',
      'comm.subtitle': '我们欢迎所有形式的贡献 — 从错误报告到新的行业扩展包。',
      'comm.type1.title': 'Bug 报告',
      'comm.type1.desc': '发现定义错误或 JSON 格式问题？告诉我们。',
      'comm.type2.title': '建议讨论',
      'comm.type2.desc': '对核心本体定义或结构的改进想法。',
      'comm.type3.title': '文档改进',
      'comm.type3.desc': '完善文档、修正翻译、添加使用示例。',
      'comm.type4.title': '行业扩展',
      'comm.type4.desc': '贡献新的行业或领域扩展包。',
      'comm.type5.title': 'Core 修改',
      'comm.type5.desc': '对 L1 的结构性修改 — 需讨论与审核。',
      'comm.cta.title': '准备好贡献了吗？',
      'comm.cta.desc': '阅读我们的贡献指南，了解如何提交修改、提交扩展并加入讨论。',
      'comm.cta.btn1': '贡献指南',
      'comm.cta.btn2': '提交 Issue',

      // Acknowledgments
      'ack.badge': '🙏 致谢',
      'ack.title': '灵感来源',
      'ack.subtitle': '本体设计参考了以下领先标准和框架。',

      // Footer
      'footer.license': '基于 Apache License 2.0 许可',
      'footer.contributing': '贡献指南',
      'footer.licenseLink': '许可协议',
      'footer.changelog': '更新日志',
    },
    en: {
      'nav.logo': 'UOD',
      'nav.architecture': 'Architecture',
      'nav.core': 'Core Ontology',
      'nav.addons': 'Addons',
      'nav.how': 'How It Works',
      'nav.community': 'Community',

      'hero.badge': 'Open Source · Apache 2.0',
      'hero.title1': 'The Open Standard for',
      'hero.title2': 'Enterprise Ontology',
      'hero.subtitle': 'A standardized three-layer framework for enterprise knowledge graphs, semantic layers, master data management, and AI Agent knowledge bases.',
      'hero.cta1': 'Get Started',
      'hero.cta2': 'View on GitHub',
      'hero.stat1': 'Core Classes',
      'hero.stat2': 'Relations',
      'hero.stat3': 'Industry Addons',
      'hero.stat4': 'Layers',

      'problem.badge': '❓ The Problem',
      'problem.title': 'Enterprise Digitalization Challenges',
      'problem.subtitle': 'Organizations worldwide face the same recurring obstacles when building knowledge systems.',
      'problem.card1.title': 'Inconsistent Definitions',
      'problem.card1.desc': 'Different teams use different terms for the same objects, making cross-system reuse nearly impossible.',
      'problem.card2.title': 'Industry Silos',
      'problem.card2.desc': 'Industry-specific knowledge is scattered across organizations with no standardized extension mechanism.',
      'problem.card3.title': 'Customization vs. Standard',
      'problem.card3.desc': 'Enterprise-specific needs continuously erode the underlying standards, breaking compatibility.',

      'arch.badge': '🏗️ Architecture',
      'arch.title': 'Three-Layer Ontology Framework',
      'arch.subtitle': 'A balanced architecture separating universal core, industry addons, and enterprise customizations.',
      'arch.l3.title': 'Enterprise Customization Layer',
      'arch.l3.desc': 'Private extensions for company-specific objects, system mappings, and internal terminology.',
      'arch.l3.item1': 'Company A',
      'arch.l3.item2': 'Company B',
      'arch.l3.item3': 'Company C',
      'arch.l3.item4': 'Custom Objects',
      'arch.l3.item5': 'System Mappings',
      'arch.l2.title': 'Industry & Domain Addons',
      'arch.l2.desc': 'Optional, community-maintained industry-specific concept extensions.',
      'arch.l1.title': 'Universal Enterprise Ontology Core',
      'arch.l1.desc': 'Mandatory, stable foundation of 25 universal classes and 16 standard relations.',

      'core.badge': '📐 L1 Core',
      'core.title': 'Core Ontology Explorer',
      'core.subtitle': '25 universal entity classes organized into 7 categories, covering all essential enterprise concepts.',
      'core.cat1.title': 'Party & Organization',
      'core.cat2.title': 'Capability & Process',
      'core.cat3.title': 'Business Objects',
      'core.cat4.title': 'Data & Systems',
      'core.cat5.title': 'Governance & Compliance',
      'core.cat6.title': 'Decision & Measurement',
      'core.cat7.title': 'Market & Channel',
      'core.tip.party': 'Superclass of all entities participating in business relationships',
      'core.tip.person': 'A natural person entity',
      'core.tip.org': 'A legal or non-legal organization',
      'core.tip.orgunit': 'Internal organizational units: departments, teams',
      'core.tip.role': 'An identity or responsibility in a given context',
      'core.tip.cap': 'A stable, reusable business capability',
      'core.tip.process': 'End-to-end activity sequence for business objectives',
      'core.tip.activity': 'An executable step within a process',
      'core.tip.bobj': 'Objects created or managed by business processes',
      'core.tip.product': 'Products and services provided by an enterprise',
      'core.tip.asset': 'Financial, physical, knowledge, and data assets',
      'core.tip.data': 'Structured or unstructured data entity',
      'core.tip.doc': 'Contracts, reports, files, and records',
      'core.tip.sys': 'Software systems supporting processes and decisions',
      'core.tip.policy': 'Management principles and constraints',
      'core.tip.rule': 'Executable business or control rules',
      'core.tip.control': 'Measures to reduce risk and ensure compliance',
      'core.tip.risk': 'Uncertain events that may affect goals',
      'core.tip.event': 'State change in business or technical environment',
      'core.tip.decision': 'Choices and approvals regarding events or goals',
      'core.tip.goal': 'Outcomes an organization aims to achieve',
      'core.tip.kpi': 'Metrics measuring goal achievement',
      'core.tip.location': 'Places where operations or transactions occur',
      'core.tip.channel': 'Interaction channels with customers and partners',
      'core.tip.market': 'Classification dimensions for customers or markets',

      'addons.badge': '🧩 L2 Addons',
      'addons.title': 'Industry Addon Marketplace',
      'addons.subtitle': 'Pluggable industry extensions built on top of the universal core. Community-driven and growing.',
      'addons.consulting.title': 'Consulting Industry',
      'addons.consulting.desc': 'Complete ontology for consulting firms — engagements, deliverables, methodologies, frameworks, practice lines, and more.',
      'addons.luxury.title': 'Luxury Goods Industry',
      'addons.luxury.desc': 'Ontology for luxury brands — brand heritage, collections, SKUs, boutiques, artisan craftsmanship, and exclusivity management.',
      'addons.finance.title': 'Financial Services',
      'addons.finance.desc': 'Banking, insurance, investment management — accounts, instruments, compliance frameworks, and regulatory entities.',
      'addons.mfg.title': 'Manufacturing',
      'addons.mfg.desc': 'Production lines, BOM, quality control, supply chain entities, and lean manufacturing concepts.',
      'addons.stat.classes': 'Classes',
      'addons.stat.relations': 'Relations',
      'addons.stat.instances': 'Instances',
      'addons.coming': 'Coming Soon',

      'how.badge': '🚀 Quick Start',
      'how.title': 'How It Works',
      'how.subtitle': 'Three simple steps to integrate Universal Ontology Definition into your enterprise.',
      'how.step1.title': 'Inherit the Core',
      'how.step1.desc': 'Start with L1 — 25 universal classes and 16 relations provide your structural foundation.',
      'how.step2.title': 'Extend with Addons',
      'how.step2.desc': 'Pick L2 industry addons — or contribute your own. Each addon seamlessly inherits from the core.',
      'how.step3.title': 'Customize for You',
      'how.step3.desc': 'Build L3 private extensions — company-specific objects, system mappings, internal policies.',

      'comm.badge': '🤝 Community',
      'comm.title': 'Join the Community',
      'comm.subtitle': 'We welcome contributions of all kinds — from bug reports to new industry addons.',
      'comm.type1.title': 'Bug Reports',
      'comm.type1.desc': 'Found a definition error or JSON format issue? Let us know.',
      'comm.type2.title': 'Suggestions',
      'comm.type2.desc': 'Ideas for improving the Core Ontology definitions or structure.',
      'comm.type3.title': 'Documentation',
      'comm.type3.desc': 'Improve docs, fix translations, add usage examples.',
      'comm.type4.title': 'Industry Addons',
      'comm.type4.desc': 'Contribute new industry or domain extension packages.',
      'comm.type5.title': 'Core Modifications',
      'comm.type5.desc': 'Structural changes to L1 — requires discussion and review.',
      'comm.cta.title': 'Ready to Contribute?',
      'comm.cta.desc': 'Read our Contributing Guide to learn how to propose changes, submit addons, and join the conversation.',
      'comm.cta.btn1': 'Contributing Guide',
      'comm.cta.btn2': 'Open an Issue',

      'ack.badge': '🙏 Acknowledgments',
      'ack.title': 'Inspired By',
      'ack.subtitle': 'The ontology design draws from leading standards and frameworks.',

      'footer.license': 'Licensed under Apache License 2.0',
      'footer.contributing': 'Contributing',
      'footer.licenseLink': 'License',
      'footer.changelog': 'Changelog',
    }
  };

  let currentLang = 'en';

  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      applyTranslations(currentLang);
      langToggle.textContent = currentLang === 'en' ? 'EN / 中' : '中 / EN';
    });
  }

  // ── Counter Animation for Hero Stats ──────────────────────
  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // Observe hero stats
  const heroStats = document.querySelectorAll('.hero-stat-value');
  if (heroStats.length > 0 && 'IntersectionObserver' in window) {
    let counted = false;
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        heroStats.forEach(el => {
          const raw = el.textContent.trim();
          const num = parseInt(raw, 10);
          if (!isNaN(num)) {
            animateCounter(el, num);
          }
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) statsObserver.observe(statsContainer);
  }

})();
