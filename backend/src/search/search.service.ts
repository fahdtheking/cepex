import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { AiService } from '../ai/ai.service';
import { PG_POOL } from '../database/database.providers';
import { SemanticSearchDto } from './dto/semantic-search.dto';

@Injectable()
export class SearchService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly aiService: AiService,
  ) {}

  async semanticSearch(payload: SemanticSearchDto) {
    const embedding = await this.aiService.generateEmbedding({ input: payload.query });
    const result = await this.pool.query(
      `
      SELECT
        ps.id,
        ps.name,
        ps.description,
        ps.sector,
        ps.tags,
        ps.organization_id,
        o.name AS organization_name,
        1 - (pse.embedding <=> $1) AS similarity
      FROM product_service_embeddings pse
      JOIN products_services ps ON ps.id = pse.product_service_id
      JOIN organizations o ON o.id = ps.organization_id
      WHERE ($2::text IS NULL OR ps.sector = $2)
        AND ($3::text IS NULL OR o.country = $3)
      ORDER BY pse.embedding <=> $1
      LIMIT 50
      `,
      [embedding, payload.sector ?? null, payload.region ?? null],
    );
    return result.rows;
  }
}
