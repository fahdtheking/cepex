import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.providers';

@Injectable()
export class AdminService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async getDashboardMetrics() {
    const [negotiations, approvals, riskAlerts] = await Promise.all([
      this.pool.query(`SELECT COUNT(*)::int AS count FROM negotiations WHERE status = 'in_progress'`),
      this.pool.query(`SELECT COUNT(*)::int AS count FROM approvals WHERE status = 'pending'`),
      this.pool.query(`SELECT COUNT(*)::int AS count FROM audit_logs WHERE action LIKE 'risk.%'`),
    ]);

    return {
      activeNegotiations: negotiations.rows[0]?.count ?? 0,
      pendingApprovals: approvals.rows[0]?.count ?? 0,
      riskAlerts: riskAlerts.rows[0]?.count ?? 0,
    };
  }
}
