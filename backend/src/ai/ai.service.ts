import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { AuditService } from '../audit/audit.service';
import { PG_POOL } from '../database/database.providers';

type PromptConfig = {
  name: string;
  version: string;
  file: string;
};

const PROMPTS: PromptConfig[] = [
  {
    name: 'negotiation_mediator',
    version: '1.0.0',
    file: 'negotiation-mediator.md',
  },
  {
    name: 'negotiation_summary',
    version: '1.0.0',
    file: 'negotiation-summary.md',
  },
];

@Injectable()
export class AiService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly auditService: AuditService,
  ) {}

  async generateEmbedding(params: { input: string }): Promise<number[]> {
    const response = await fetch(`${this.ollamaBaseUrl()}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_EMBED_MODEL,
        prompt: params.input,
      }),
    });
    const data = (await response.json()) as { embedding: number[] };
    return data.embedding;
  }

  async generateNegotiationMessage(negotiationId: string, context: string) {
    const prompt = this.loadPrompt('negotiation_mediator');
    const output = await this.runPrompt(prompt, context);
    const result = await this.pool.query(
      `
      INSERT INTO ai_messages
        (negotiation_id, prompt_name, prompt_version, model, content)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id, negotiation_id, content, created_at
      `,
      [
        negotiationId,
        prompt.name,
        prompt.version,
        process.env.OLLAMA_MODEL,
        output,
      ],
    );
    await this.auditService.logEvent({
      actorId: null,
      actorRole: 'ai',
      action: 'ai.message_generated',
      entityType: 'ai_messages',
      entityId: result.rows[0].id,
      metadata: { negotiationId, prompt: prompt.name },
    });
    return result.rows[0];
  }

  async generateNegotiationSummary(negotiationId: string, context: string) {
    const prompt = this.loadPrompt('negotiation_summary');
    const output = await this.runPrompt(prompt, context);
    const result = await this.pool.query(
      `
      INSERT INTO ai_summaries
        (negotiation_id, prompt_name, prompt_version, model, summary)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id, negotiation_id, summary, created_at
      `,
      [
        negotiationId,
        prompt.name,
        prompt.version,
        process.env.OLLAMA_MODEL,
        output,
      ],
    );
    await this.auditService.logEvent({
      actorId: null,
      actorRole: 'ai',
      action: 'ai.summary_generated',
      entityType: 'ai_summaries',
      entityId: result.rows[0].id,
      metadata: { negotiationId, prompt: prompt.name },
    });
    return result.rows[0];
  }

  private loadPrompt(name: string) {
    const prompt = PROMPTS.find((item) => item.name === name);
    if (!prompt) {
      throw new Error(`Prompt ${name} not found`);
    }
    const promptDir =
      process.env.PROMPTS_DIR ?? path.join(process.cwd(), 'prompts');
    const content = readFileSync(path.join(promptDir, prompt.file), 'utf-8');
    return { ...prompt, content };
  }

  private async runPrompt(prompt: PromptConfig & { content: string }, context: string) {
    const response = await fetch(`${this.ollamaBaseUrl()}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL,
        prompt: `${prompt.content}\n\nContext:\n${context}`,
        stream: false,
      }),
    });
    const data = (await response.json()) as { response: string };
    return data.response;
  }

  private ollamaBaseUrl() {
    return process.env.OLLAMA_BASE_URL ?? 'http://ollama:11434';
  }
}
