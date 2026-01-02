# ⚠️ LEGACY - DO NOT USE

This Prisma schema is **DEPRECATED** as of 2025-12-30.

## Current ORM: TypeORM

**All database operations use TypeORM entities** in `src/entities/*.entity.ts`.

## Why This Schema Is Legacy

This Prisma schema was created for **MVP rapid prototyping** but is incomplete for institutional use:

❌ **Missing Critical Entities:**
- No `Deal` entity (core to platform)
- No `DealEvent` (event sourcing / audit trail)
- No role-based enum on User
- No governance structures

❌ **Institutional Requirements Not Met:**
- Event sourcing not supported
- Append-only audit trail missing
- CEPEX governance features absent  
- DropPay handover tracking not included

## Schema Authority

### ✅ CANONICAL ORM: TypeORM
Path: `src/entities/*.entity.ts`

TypeORM entities include:
- **User** (with UserRole enum: EXPORTER | IMPORTER | ARCHITECT | ADMIN)
- **ExporterProfile, ImporterProfile, ArchitectProfile**
- **Product, Service**
- **Deal, DealEvent** (event-sourced)
- **Proposal, PartnershipProposal**
- **Conversation, Message**
- **DropPayHandover** (settlement integration)

### ❌ DEPRECATED: Prisma Schema
Path: `src/generated/client/schema.prisma` **(THIS FILE)**

> WARNING: These files are archived legacy Prisma clients. DO NOT import `PrismaClient` in active code. If you see runtime imports, treat as SEVERITY-1 and report immediately.

## Migration Status

✅ **Schema Audit Complete (2025-12-30)**  
- PostgreSQL schema matches TypeORM entities  
- Zero critical/high issues found
- Referential integrity verified  
- All enums, JSONB columns, FKs correct

## Codebase Policy

### ❌ FORBIDDEN IMPORTS

```typescript
// ❌ DO NOT USE
import { PrismaClient } from '@prisma/client';
```

### ✅ CORRECT IMPORTS

```typescript
// ✅ USE THIS
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
```

## If You See Prisma Imports

If you find `PrismaClient` anywhere in active code, **it is a severity-1 bug**.

Report immediately or remove the import and refactor to TypeORM repositories.

## Historical Context

This schema was part of:
- **Phase 0:** MVP prototyping (2024-12)
- **Phase 1:** Marketplace liquidity loop testing

The system has since evolved to institution-grade architecture requiring:
- Event sourcing (`DealEvent`)
- Role-based access control (`UserRole enum`)
- Audit trails (append-only events)
- Governance (CEPEX admin oversight)

None of these are possible with this Prisma schema.

---

**Last Updated:** 2025-12-30  
**Status:** ARCHIVED  
**Replacement:** TypeORM entities in `src/entities/` 

**Do not modify this file. Do not generate Prisma Client. Do not use Prisma in any new code.**
