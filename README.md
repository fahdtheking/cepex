# CEPEX Institutional B2B Facilitation Backend

This repository contains the backend, database schema, and local AI integration for the CEPEX institutional B2B facilitation platform.
The UI is provided separately and must map directly to the API routes described below.

## Architecture
- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL + pgvector
- **AI**: Local Ollama (no external AI calls)
- **Deployment**: Docker + Docker Compose
- **Governance**: JWT auth, RBAC, immutable audit logs

## Services
- `postgres`: PostgreSQL with pgvector and database-first schema initialization.
- `backend`: NestJS API service.
- `ollama`: Local LLM used for embeddings and negotiation assistance.
- `redis`: Optional cache (reserved for future use).

## Quick Start
```bash
docker compose up --build
```

### Environment Variables
These are configured in `docker-compose.yml` and can be overridden as needed:
- `DATABASE_URL`
- `JWT_SECRET`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `OLLAMA_EMBED_MODEL`
- `PROMPTS_DIR`
- `PORT`

## Database Schema
Schema is defined in `db/schema.sql` and is applied on container startup. It includes:
- `users`
- `organizations`
- `products_services`
- `product_service_embeddings`
- `negotiations`
- `negotiation_messages`
- `ai_messages`
- `ai_summaries`
- `approvals`
- `audit_logs`

## API Routes
### Authentication & RBAC
All routes require JWT auth. Roles:
- `importer`
- `exporter`
- `cepex_agent`
- `admin`

### Importer (Semantic Search)
- `POST /search/semantic`

### Exporter (Product/Service CRUD)
- `POST /products-services`
- `PATCH /products-services/:id`
- `GET /products-services/organization/:organizationId`
- `DELETE /products-services/:id`

### Negotiations
- `POST /negotiations`
- `POST /negotiations/:id/messages`
- `PATCH /negotiations/:id/status`
- `GET /negotiations/:id`
- `GET /negotiations/organization/:organizationId`

### AI Mediation (Ollama)
- `POST /ai/negotiations/:id/message`
- `POST /ai/negotiations/:id/summary`

### CEPEX Validation Workflows
- `GET /approvals`
- `PATCH /approvals/:id`

### Admin Control Panel
- `GET /admin/dashboard`

## Prompt Templates
AI prompts are stored in `prompts/` and versioned in code. All AI outputs are stored in `ai_messages` or `ai_summaries` with prompt metadata.

## Notes
- No payments, checkout, or pricing engine.
- No external AI calls; Ollama is the only LLM runtime.
- All actions are auditable through `audit_logs`.
