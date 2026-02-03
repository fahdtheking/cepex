import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { AiService } from '../ai/ai.service';
import { AuditService } from '../audit/audit.service';
import { PG_POOL } from '../database/database.providers';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';

@Injectable()
export class ProductsServicesService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly aiService: AiService,
    private readonly auditService: AuditService,
  ) {}

  async createProductService(actorId: string, payload: CreateProductServiceDto) {
    const result = await this.pool.query(
      `
      INSERT INTO products_services (organization_id, name, description, sector, tags)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, organization_id, name, description, sector, tags, created_at
      `,
      [
        payload.organizationId,
        payload.name,
        payload.description,
        payload.sector,
        payload.tags ?? null,
      ],
    );
    const product = result.rows[0];
    const embedding = await this.aiService.generateEmbedding({
      input: `${product.name}\n${product.description}\n${product.sector}`,
    });
    await this.pool.query(
      `
      INSERT INTO product_service_embeddings (product_service_id, embedding)
      VALUES ($1, $2)
      ON CONFLICT (product_service_id) DO UPDATE SET embedding = EXCLUDED.embedding
      `,
      [product.id, embedding],
    );
    await this.auditService.logEvent({
      actorId,
      actorRole: null,
      action: 'product_service.created',
      entityType: 'products_services',
      entityId: product.id,
      metadata: { name: product.name },
    });
    return product;
  }

  async updateProductService(
    actorId: string,
    id: string,
    payload: UpdateProductServiceDto,
  ) {
    const result = await this.pool.query(
      `
      UPDATE products_services
      SET name = COALESCE($2, name),
          description = COALESCE($3, description),
          sector = COALESCE($4, sector),
          tags = COALESCE($5, tags),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, organization_id, name, description, sector, tags, updated_at
      `,
      [id, payload.name ?? null, payload.description ?? null, payload.sector ?? null, payload.tags ?? null],
    );
    const product = result.rows[0];
    if (!product) {
      return null;
    }
    const embedding = await this.aiService.generateEmbedding({
      input: `${product.name}\n${product.description}\n${product.sector}`,
    });
    await this.pool.query(
      `
      INSERT INTO product_service_embeddings (product_service_id, embedding)
      VALUES ($1, $2)
      ON CONFLICT (product_service_id) DO UPDATE SET embedding = EXCLUDED.embedding
      `,
      [product.id, embedding],
    );
    await this.auditService.logEvent({
      actorId,
      actorRole: null,
      action: 'product_service.updated',
      entityType: 'products_services',
      entityId: product.id,
      metadata: { name: product.name },
    });
    return product;
  }

  async listByOrganization(organizationId: string) {
    const result = await this.pool.query(
      `
      SELECT id, organization_id, name, description, sector, tags, created_at, updated_at
      FROM products_services
      WHERE organization_id = $1
      ORDER BY created_at DESC
      `,
      [organizationId],
    );
    return result.rows;
  }

  async deleteProductService(actorId: string, id: string) {
    const result = await this.pool.query(
      `
      DELETE FROM products_services
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );
    if (result.rows.length > 0) {
      await this.auditService.logEvent({
        actorId,
        actorRole: null,
        action: 'product_service.deleted',
        entityType: 'products_services',
        entityId: id,
      });
    }
    return result.rows[0] ?? null;
  }
}
