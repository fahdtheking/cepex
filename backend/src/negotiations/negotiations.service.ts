import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { AuditService } from '../audit/audit.service';
import { PG_POOL } from '../database/database.providers';
import { AddMessageDto } from './dto/add-message.dto';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationStatusDto } from './dto/update-negotiation-status.dto';
import { NegotiationStatus } from './negotiation-status.enum';

@Injectable()
export class NegotiationsService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly auditService: AuditService,
  ) {}

  async createNegotiation(actorId: string, payload: CreateNegotiationDto) {
    const result = await this.pool.query(
      `
      INSERT INTO negotiations
        (importer_organization_id, exporter_organization_id, product_service_id, title, status)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id, importer_organization_id, exporter_organization_id, product_service_id, title, status, created_at
      `,
      [
        payload.importerOrganizationId,
        payload.exporterOrganizationId,
        payload.productServiceId,
        payload.title,
        NegotiationStatus.InProgress,
      ],
    );
    const negotiation = result.rows[0];
    await this.auditService.logEvent({
      actorId,
      actorRole: null,
      action: 'negotiation.created',
      entityType: 'negotiations',
      entityId: negotiation.id,
      metadata: { title: negotiation.title },
    });
    return negotiation;
  }

  async addMessage(actorId: string, negotiationId: string, payload: AddMessageDto) {
    const result = await this.pool.query(
      `
      INSERT INTO negotiation_messages
        (negotiation_id, sender_user_id, sender_role, content)
      VALUES
        ($1, $2, $3, $4)
      RETURNING id, negotiation_id, sender_user_id, sender_role, content, created_at
      `,
      [negotiationId, payload.senderUserId, payload.senderRole, payload.content],
    );
    const message = result.rows[0];
    await this.auditService.logEvent({
      actorId,
      actorRole: payload.senderRole,
      action: 'negotiation.message_added',
      entityType: 'negotiation_messages',
      entityId: message.id,
      metadata: { negotiationId },
    });
    return message;
  }

  async updateStatus(actorId: string, negotiationId: string, payload: UpdateNegotiationStatusDto) {
    const result = await this.pool.query(
      `
      UPDATE negotiations
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, status, updated_at
      `,
      [negotiationId, payload.status],
    );
    const negotiation = result.rows[0];
    await this.auditService.logEvent({
      actorId,
      actorRole: null,
      action: 'negotiation.status_updated',
      entityType: 'negotiations',
      entityId: negotiationId,
      metadata: { status: payload.status },
    });
    return negotiation;
  }

  async getNegotiation(negotiationId: string) {
    const negotiation = await this.pool.query(
      `
      SELECT id, importer_organization_id, exporter_organization_id, product_service_id, title, status, created_at, updated_at
      FROM negotiations
      WHERE id = $1
      `,
      [negotiationId],
    );
    const messages = await this.pool.query(
      `
      SELECT id, negotiation_id, sender_user_id, sender_role, content, created_at
      FROM negotiation_messages
      WHERE negotiation_id = $1
      ORDER BY created_at ASC
      `,
      [negotiationId],
    );
    return {
      negotiation: negotiation.rows[0] ?? null,
      messages: messages.rows,
    };
  }

  async listByOrganization(organizationId: string) {
    const result = await this.pool.query(
      `
      SELECT id, title, status, created_at, updated_at
      FROM negotiations
      WHERE importer_organization_id = $1 OR exporter_organization_id = $1
      ORDER BY created_at DESC
      `,
      [organizationId],
    );
    return result.rows;
  }
}
