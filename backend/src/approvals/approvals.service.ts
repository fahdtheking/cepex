import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { AuditService } from '../audit/audit.service';
import { PG_POOL } from '../database/database.providers';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Injectable()
export class ApprovalsService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly auditService: AuditService,
  ) {}

  async listApprovals() {
    const result = await this.pool.query(
      `
      SELECT id, entity_type, entity_id, status, notes, created_at, updated_at
      FROM approvals
      ORDER BY created_at DESC
      `,
    );
    return result.rows;
  }

  async updateApproval(actorId: string, approvalId: string, payload: UpdateApprovalDto) {
    const result = await this.pool.query(
      `
      UPDATE approvals
      SET status = $2, notes = $3, updated_at = NOW()
      WHERE id = $1
      RETURNING id, entity_type, entity_id, status, notes, updated_at
      `,
      [approvalId, payload.status, payload.notes ?? null],
    );
    const approval = result.rows[0];
    await this.auditService.logEvent({
      actorId,
      actorRole: null,
      action: 'approval.updated',
      entityType: 'approvals',
      entityId: approvalId,
      metadata: { status: payload.status },
    });
    return approval;
  }
}
