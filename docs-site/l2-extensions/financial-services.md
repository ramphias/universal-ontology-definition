# Financial Services Extension

The Financial Services Extension extends L1 with concepts specific to banking, insurance, and asset management.

## Overview

This extension covers:

- :bank: **Institutions** — Financial institutions, bank branches, business lines
- :credit_card: **Products** — Loans, insurance policies, investment funds, customer accounts
- :chart_with_upwards_trend: **Markets** — Transactions, portfolios, trading platforms
- :busts_in_silhouette: **Roles** — Relationship managers, risk analysts, compliance officers, underwriters
- :warning: **Risk** — Credit risk, market risk, operational risk
- :scales: **Compliance** — AML policy, KYC process, regulatory reporting
- :gear: **Systems** — Core banking system, trading platform
- :bar_chart: **KPIs** — NPL ratio, combined ratio, capital adequacy ratio

## Statistics

| Category | Count |
|:---|:---:|
| New Classes | 30 |
| New Relations | 12 |
| Sample Instances | 7 |

## Key Classes

| Class | Parent (L1) | Description |
|:---|:---|:---|
| `FinancialInstitution` | `Organization` | Licensed financial services provider |
| `LoanProduct` | `ProductService` | Credit products (mortgages, consumer, business) |
| `InsurancePolicy` | `ProductService` | Risk transfer products (life, property, health) |
| `InvestmentFund` | `ProductService` | Pooled investment vehicles (mutual funds, ETFs) |
| `CreditRisk` | `Risk` | Borrower/counterparty default risk |
| `KYCProcess` | `Process` | Customer identity verification and risk assessment |
| `CoreBankingSystem` | `SystemApplication` | Core deposit, loan, and payment system |

## Use Cases

- Bank or insurer enterprise knowledge graph
- Regulatory compliance automation (KYC/AML)
- Credit risk scoring and portfolio analytics
- Customer 360 data integration across business lines
