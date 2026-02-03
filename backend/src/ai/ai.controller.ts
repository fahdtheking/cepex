import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { GenerateAiMessageDto } from './dto/generate-ai-message.dto';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('negotiations/:id/message')
  @Roles(Role.CepexAgent)
  async generateMessage(
    @Param('id') negotiationId: string,
    @Body() payload: GenerateAiMessageDto,
  ) {
    return this.aiService.generateNegotiationMessage(negotiationId, payload.context);
  }

  @Post('negotiations/:id/summary')
  @Roles(Role.CepexAgent)
  async generateSummary(
    @Param('id') negotiationId: string,
    @Body() payload: GenerateAiMessageDto,
  ) {
    return this.aiService.generateNegotiationSummary(negotiationId, payload.context);
  }
}
