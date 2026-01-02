CEPEX — National Export Intelligence Platform
## Master Technical Documentation (Institutional Grade)
**Project State: Phase 4 (FROZEN)**

---

### 1. Executive Summary
CEPEX is the digital backbone for Tunisian international trade, providing a high-integrity registry and orchestration layer for exporters and global importers. It replaces fragmented, non-verifiable communication with a structured, state-machine driven negotiation environment. The system ensures that every trade agreement is backed by a verifiable audit trail before being handed over to financial settlement via the DropPay platform.

---

### 2. Problem Statement & Institutional Context
International trade in Tunisia faces three primary barriers:
1.  **Trust Deficit**: Lack of verified exporter profiles and trade history.
2.  **Negotiation Fragmentation**: Trade terms are often lost in unencrypted email threads or messaging apps.
3.  **Settlement Risk**: High friction between final agreement and financial execution.

CEPEX addresses these by acting as a **Canonical Registry of Intent**, where all negotiation steps are immutable, role-enforced, and audit-ready.

---

### 3. Architectural Principles
1.  **Deal-Centricity**: The "Deal" is the atomic unit of the system. All conversations, proposals, and events are children of a specific Deal.
2.  **Append-Only Event Sourcing**: The current state of a deal (e.g., "AGREED") is derived from its event log. You cannot "delete" a negotiation step; you can only append a correction or a new proposal.
3.  **Role Isolation (Zero Leakage)**: Users see only the slices of the system relevant to their role and their active transactions.
4.  **Institutional Neutrality**: The system observes and enforces rules (e.g., "Only an Exporter can mark a deal as Agreed") but does not automate a deal into existence without human intent.

---

### 4. SOA Architecture (Service Boundaries)
The system is divided into logical service domains within a NestJS backend:

*   **Marketplace Service**: Read-only discovery. Manages product/service availability and AI-driven trust scoring.
*   **Deals Service**: The sole mutation authority. Manages the lifecycle, state transitions, and event logging for trade.
*   **Negotiation Service**: Manages `Conversations` and `Messages`. Acts as a neutral archive for negotiation transcripts.
*   **Auth Service**: Enforces RBAC via JWT and NestJS Guards.
*   **DropPay Integration**: A specialized bridge that serializes CEPEX deal data and hands it over to the DropPay microservice for payment execution.

---

### 5. Canonical Domain Model

| Entity | Primary Responsibility | Key Relationship |
| :--- | :--- | :--- |
| `User` | Authentication & Identity | One-to-One with Role Profile |
| `ExporterProfile` | Verified company credentials | One-to-Many with `Products` |
| `ImporterProfile` | Procurement requirements | Linked to initiated `Deals` |
| `Deal` | State Container | Contains `DealEvents` and `Proposals` |
| `DealEvent` | Append-only audit trail | Many-to-One with `Deal` |
| `Proposal` | Structured negotiation unit | Linked to `Deal` versioning |
| `Conversation` | Message container | Linked to `Deal` via `dealId` |
| `Message` | Individual communication | Contains `SYSTEM` or `CHAT` content |

---

### 6. Deal Lifecycle (State machine)

#### States & Invariants:
1.  **MATCHING**: Implicit discovery. Deal exists but negotiation hasn't structured.
2.  **ACTIVE**: Negotiation loop. Proposals being exchanged. **Invariant**: Requires at least one `Proposal`.
3.  **AGREED**: Final binding state in CEPEX. **Invariant**: Can ONLY be set by the `EXPORTER`.
4.  **DROPPAY_INITIATED**: Handover status. **Invariant**: Requires a successful 200 OK from DropPay API.

---

### 7. Role-Based Access Control (RBAC)

*   **ADMIN**: Global oversight. Read-only access to all deals and metrics. No mutation authority on trade.
*   **EXPORTER**: Publisher. Can create products, responded to inquiries, and has the **exclusive power** to mark a deal as `AGREED`.
*   **IMPORTER**: Originator. Can search the marketplace and initiate new deals. Cannot finalize a deal independently.

---

### 8. Security & Data Integrity Guarantees

*   **JWT Hardening**: All requests require a valid Bearer token. Payloads contain `userId` and `role`.
*   **Query Isolation**: Every SQL query for a deal includes a `WHERE (initiatorId = :id OR respondentId = :id)` clause, preventing cross-tenant data leakage.
*   **TypeORM Integrity**: All fields use strict Enums. `synchronize: false` in production ensures the schema cannot be altered without an audit-traceable migration.

---

### 9. UML Models (Textual Representation)

#### Use Case Diagram:
- **Actor Exporter**: [Publish Product] -> [Propose Terms] -> [Mark Agreement]
- **Actor Importer**: [Search Marketplace] -> [Initiate Deal] -> [Accept/Counter Terms]
- **Actor Admin**: [Monitor System Metrics] -> [Verify Exporter Credentials]

#### Sequence Diagram (Marketplace to Settlement):
1. `Importer` -> `MarketplaceController`: GET /products
2. `Importer` -> `DealsController`: POST /initiate (creates Deal + Conversation)
3. `Exporter` -> `DealsController`: PATCH /proposals (Actor: Respondent/Exporter)
4. `Importer` -> `DealsController`: PATCH /accept (Actor: Initiator/Importer)
5. `Exporter` -> `DealsController`: PATCH /agree (Locks state to AGREED)
6. `System` -> `DropPayService`: POST /handover (Cross-platform execution)

---

### 10. UX Architecture: Intuitive Discipline
The UI is not just a layout; it is a manifestation of institutional rules:
- **Role-Gated Dashboards**: The "Governance Console" (Admin) differs visually from the "Operations Hub" (Exporter) to reinforce responsibility.
- **State-Sync**: The UI components (e.g., `DealTimeline`) derive visibility from the backend `DealStatus`. A "Payment" button is physically impossible to render until the state is `AGREED`.

---

### 11. Reproducibility Guide (Cold Start)
1.  **Environment**: Ensure Node.js 20+ and Docker are running.
2.  **Infrastructure**: `docker-compose up -d` (PostgreSQL 5434).
3.  **Backend Registry**: 
    - `npm install`
    - `npm run start:dev` (apps/cepex-backend)
4.  **Frontend Hub**:
    - `npm install`
    - `npm run dev` (apps/cepex-web)
5.  **Verification**: Execute `npm run test` in `apps/cepex-backend` to confirm RBAC and state machine integrity.

---

### 12. Reproduction Contract (Handover)
- **Assumptions**: 5434 is the canonical Postgres port. JWT Secret remains consistent across services.
- **Boundaries**: All financial calculations occur in DropPay; CEPEX only tracks the *intent* (AGREED).
- **Non-Goals**: No real-time chat (Sockets) is required; polling-based messaging ensures high auditability.
- **Immutable Rule**: Never allow an Importer to move a deal to `AGREED`. 

---
**Institutional Authorization: principal_architect_freeze_001**
**Date: 2026-01-01**
