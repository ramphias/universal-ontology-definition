# Business Requirements Document (BRD)

## 1. Product Overview
Ontology Studio is a multi-layer ontology visualization and management platform designed to provide structured governance over universal concepts, industry standards, and enterprise-specific implementations.

## 2. Target Audience & Permission Model
To prevent cognitive overload and maintain strict data governance, the platform is divided into three distinct operational layers (L1, L2, L3). Each layer targets a specific audience and enforces strict boundary permissions.

### 2.1 Layer 1 (L1) - Universal Core
* **Definition**: The abstract foundational layer containing philosophical definitions of entities, relations, and universal dimensions.
* **Target Audience**: Platform Chief Architects.
* **Editing Permissions**: **Core Administrators Only**.
* **Requirement**: Ordinary users or industry experts cannot modify L1 data. L1 modifications have a global blast radius and therefore require the highest degree of architectural review. The L1 Editor specifically hides lower-level business properties to minimize visual noise during foundational architecture reviews.

### 2.2 Layer 2 (L2) - Industry Extensions
* **Definition**: Standardized models tailored for specific industries (e.g., Food & Beverage, Manufacturing, Healthcare) extending the L1 Universal Core.
* **Target Audience**: Industry Subject Matter Experts (SMEs) and Domain Standard Committees.
* **Editing Permissions**: **Industry Administrators Only** (Domain-restricted).
* **Requirement**: Domain experts utilize the L2 Workspace to instantiate L1 concepts into industry-standard entities (e.g., standardizing the concept of a `FastFoodRestaurant`). They cannot alter L1 fundamentals, nor can they view or modify L3 confidential enterprise data.

### 2.3 Layer 3 (L3) - Enterprise Instances
* **Definition**: Bespoke, highly confidential enterprise instances extending both L1 Core and L2 Industry standards to formulate a private semantic model.
* **Target Audience**: Enterprise IT / Data Architects (e.g., McDonald's Data Team).
* **Editing Permissions**: **Enterprise Users** (Self-managed private spaces).
* **Requirement**: The L3 Workspace allows enterprise users to fully composite L1 and L2 public models with their private extensions. Enterprise users govern their own L3 sandbox, but they possess read-only access to L1 and L2 schemas via the studio workspace.

## 3. Implementation Guidelines
- **UI Decoupling**: The 3 workspaces (`L1FlowEditor`, `L2FlowWorkspace`, `L3FlowWorkspace`) shall remain decoupled to enforce these permission models structurally within the frontend.
- **Backend Enforcement**: Future backend schemas and API gateways must validate the user's role against the target layer before committing any structural changes to the Git/Graph database backend.
