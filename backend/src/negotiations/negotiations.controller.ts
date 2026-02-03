import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { AddMessageDto } from './dto/add-message.dto';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationStatusDto } from './dto/update-negotiation-status.dto';
import { NegotiationsService } from './negotiations.service';

@Controller('negotiations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NegotiationsController {
  constructor(private readonly negotiationsService: NegotiationsService) {}

  @Post()
  @Roles(Role.Importer, Role.Exporter)
  async create(@Body() payload: CreateNegotiationDto) {
    return this.negotiationsService.createNegotiation('system', payload);
  }

  @Post(':id/messages')
  @Roles(Role.Importer, Role.Exporter, Role.CepexAgent)
  async addMessage(@Param('id') id: string, @Body() payload: AddMessageDto) {
    return this.negotiationsService.addMessage('system', id, payload);
  }

  @Patch(':id/status')
  @Roles(Role.CepexAgent, Role.Admin)
  async updateStatus(@Param('id') id: string, @Body() payload: UpdateNegotiationStatusDto) {
    return this.negotiationsService.updateStatus('system', id, payload);
  }

  @Get(':id')
  @Roles(Role.Importer, Role.Exporter, Role.CepexAgent)
  async getNegotiation(@Param('id') id: string) {
    return this.negotiationsService.getNegotiation(id);
  }

  @Get('organization/:organizationId')
  @Roles(Role.Importer, Role.Exporter, Role.CepexAgent)
  async listByOrganization(@Param('organizationId') organizationId: string) {
    return this.negotiationsService.listByOrganization(organizationId);
  }
}
