import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { AuditService } from '../audit/audit.service';
import { PG_POOL } from '../database/database.providers';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly auditService: AuditService,
  ) {}

  async createOrganization(actorId: string, payload: CreateOrganizationDto) {
    const result = await this.pool.query(
      `
      INSERT INTO organizations (name, sector, country)
      VALUES ($1, $2, $3)
      RETURNING id, name, sector, country, created_at
      `,
      [payload.name, payload.sector, payload.country ?? null],
    );
    const organization = result.rows[0];
    await this.auditService.logEvent({
      actorId,
      actorRole: null,
      action: 'organization.created',
      entityType: 'organizations',
      entityId: organization.id,
      metadata: { name: organization.name },
    });
    return organization;
  }

  async listOrganizations() {
    const result = await this.pool.query(
      `
      SELECT id, name, sector, country, created_at
      FROM organizations
      ORDER BY created_at DESC
      `,
    );
    return result.rows;
  }
}
