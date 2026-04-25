# L2 Financial Services Extension / L2 金融服务行业扩展

L2 Financial Services Industry and Domain Extension — 30 classes, 12 relations (v1.0.0).

L2 金融服务行业扩展 —— 包含 30 个类、12 个关系（v1.0.0）。

> Source: [`l2-extensions/financial-services/financial_services_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/l2-extensions/financial-services/financial_services_extension_v1.json)


---


## Classes / 类 (30)


| ID | EN | ZH | Parent | Definition (EN) |
|:---|:---|:---|:---|:---|
| `FinancialInstitution` | Financial Institution | 金融机构 | `Organization` | A licensed entity providing financial services, e.g., banks, insurers, brokerages, fund managers |
| `BankBranch` | Bank Branch | 银行网点 | `OrgUnit` | A geographically distributed branch providing in-person banking services |
| `BusinessLine` | Business Line | 业务条线 | `OrgUnit` | An operational unit organized by business type, e.g., retail banking, corporate banking, investment banking, wealth management |
| `FinancialProduct` | Financial Product | 金融产品 | `ProductService` | Standardized or customized products designed and sold by financial institutions, e.g., deposits, loans, funds, insurance policies |
| `LoanProduct` | Loan Product | 贷款产品 | `FinancialProduct` | Credit products issued to individuals or corporations, including mortgages, consumer loans, and business loans |
| `InsurancePolicy` | Insurance Policy | 保险产品 | `FinancialProduct` | Risk transfer products underwritten by insurers, including life, property, health, and liability insurance |
| `InvestmentFund` | Investment Fund | 投资基金 | `FinancialProduct` | Pooled investment vehicles including mutual funds, private equity funds, and ETFs |
| `CustomerAccount` | Customer Account | 客户账户 | `Resource` | An account opened for a customer, recording balances, holdings, and transaction history |
| `Transaction` | Transaction | 交易 | `Event` | A transfer event of funds or financial assets, including deposits, transfers, payments, securities trades |
| `Claim` | Insurance Claim | 理赔 | `Resource` | A request for loss compensation filed by a policyholder to an insurer |
| `Portfolio` | Investment Portfolio | 投资组合 | `Resource` | A collection of financial assets allocated according to risk appetite and investment strategy |
| `CreditScore` | Credit Score | 信用评分 | `DataObject` | A risk assessment score calculated from a customer's credit history |
| `RegulatoryReport` | Regulatory Report | 监管报告 | `Document` | Compliance reports submitted periodically to regulators, e.g., capital adequacy, AML reports |
| `RelationshipManager` | Relationship Manager | 客户经理 | `Role` | A front-line role responsible for customer relationship management and product sales |
| `RiskAnalyst` | Risk Analyst | 风险分析师 | `Role` | A professional role assessing credit, market, and operational risks |
| `ComplianceOfficer` | Compliance Officer | 合规官 | `Role` | A governance role ensuring institutional operations comply with laws, regulations, and internal policies |
| `Underwriter` | Underwriter | 核保人 | `Role` | A risk control role evaluating and approving insurance or loan applications |
| `CreditRisk` | Credit Risk | 信用风险 | `Risk` | Risk of loss due to a borrower's or counterparty's failure to meet contractual obligations |
| `MarketRisk` | Market Risk | 市场风险 | `Risk` | Risk of loss due to fluctuations in interest rates, exchange rates, equity prices, or commodity prices |
| `OperationalRisk` | Operational Risk | 操作风险 | `Risk` | Risk of loss due to inadequate internal processes, people, systems, or external events |
| `AMLPolicy` | Anti-Money Laundering Policy | 反洗钱政策 | `Policy` | Compliance policy framework for preventing money laundering and terrorism financing |
| `KYCProcess` | Know Your Customer Process | 客户尽调流程 | `Process` | Pre-onboarding and ongoing customer identity verification and risk assessment process |
| `UnderwritingProcess` | Underwriting Process | 核保流程 | `Process` | Risk evaluation and approval process for insurance or lending decisions |
| `ClaimsProcess` | Claims Process | 理赔流程 | `Process` | End-to-end claims handling from filing, investigation, assessment to settlement |
| `RiskManagementCapability` | Risk Management Capability | 风险管理能力 | `Capability` | Organizational capability to identify, assess, monitor, and mitigate financial risks |
| `CoreBankingSystem` | Core Banking System | 核心银行系统 | `SystemApplication` | Core business system processing deposits, loans, account management, and payment settlements |
| `TradingPlatform` | Trading Platform | 交易平台 | `SystemApplication` | Electronic platform for executing trades in securities, FX, derivatives, and other financial assets |
| `NPLRatio` | Non-Performing Loan Ratio | 不良贷款率 | `KPI` | Ratio of non-performing loans to total loan balance |
| `CombinedRatio` | Combined Ratio | 综合成本率 | `KPI` | Sum of loss ratio and expense ratio, measuring underwriting profitability |
| `CapitalAdequacyRatio` | Capital Adequacy Ratio | 资本充足率 | `KPI` | Ratio of bank capital to risk-weighted assets, measuring risk resilience |

## Relations / 关系 (12)


| ID | Domain | Range | Definition (EN) |
|:---|:---|:---|:---|
| `has_business_line` | `FinancialInstitution` | `BusinessLine` | A financial institution has business lines |
| `has_branch` | `FinancialInstitution` | `BankBranch` | A financial institution has branches |
| `offers_product` | `FinancialInstitution` | `FinancialProduct` | A financial institution offers financial products |
| `holds_account` | `CustomerAccount` | `FinancialProduct` | A customer account holds financial products |
| `scored_by` | `CustomerAccount` | `CreditScore` | A customer account is assessed by a credit score |
| `underwritten_by` | `FinancialProduct` | `UnderwritingProcess` | A financial product is approved through the underwriting process |
| `triggers_claim` | `InsurancePolicy` | `Claim` | An insurance policy triggers a claim |
| `managed_in_portfolio` | `InvestmentFund` | `Portfolio` | An investment fund is managed within a portfolio |
| `reported_to_regulator` | `FinancialInstitution` | `RegulatoryReport` | A financial institution submits reports to regulators |
| `complies_with_aml` | `KYCProcess` | `AMLPolicy` | KYC process complies with AML policy |
| `processed_on` | `Transaction` | `CoreBankingSystem` | A transaction is processed on the core banking system |
| `traded_on` | `InvestmentFund` | `TradingPlatform` | Investment products are traded on the trading platform |
