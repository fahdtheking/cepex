import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.providers';

@Injectable()
export class AuditService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async logEvent(params: {
    actorId: string | null;
    actorRole: string | null;
    action: string;
    entityType: string;
    entityId: string | null;
    metadata?: Record<string, unknown>;
    ipAddress?: string | null;
  }) {
    const {
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
    } = params;
    await this.pool.query(
      `
      INSERT INTO audit_logs
        (actor_id, actor_role, action, entity_type, entity_id, metadata, ip_address)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        actorId,
        actorRole,
        action,
        entityType,
        entityId,
        metadata ? JSON.stringify(metadata) : null,
        ipAddress ?? null,
      ],
    );
  }
}
