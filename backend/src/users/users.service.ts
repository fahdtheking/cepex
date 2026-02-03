import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { AuditService } from '../audit/audit.service';
import { PG_POOL } from '../database/database.providers';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly auditService: AuditService,
  ) {}

  async createUser(actorId: string, payload: CreateUserDto) {
    const result = await this.pool.query(
      `
      INSERT INTO users (email, full_name, role, organization_id, phone_number)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, role, organization_id, phone_number, created_at
      `,
      [
        payload.email,
        payload.fullName,
        payload.role,
        payload.organizationId,
        payload.phoneNumber ?? null,
      ],
    );
    const user = result.rows[0];
    await this.auditService.logEvent({
      actorId,
      actorRole: null,
      action: 'user.created',
      entityType: 'users',
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });
    return user;
  }

  async listUsers() {
    const result = await this.pool.query(
      `
      SELECT id, email, full_name, role, organization_id, phone_number, created_at
      FROM users
      ORDER BY created_at DESC
      `,
    );
    return result.rows;
  }

  async getUserById(id: string) {
    const result = await this.pool.query(
      `
      SELECT id, email, full_name, role, organization_id, phone_number, created_at
      FROM users
      WHERE id = $1
      `,
      [id],
    );
    return result.rows[0] ?? null;
  }
}
