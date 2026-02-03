import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles(Role.Admin, Role.CepexAgent)
  async createOrganization(@Body() payload: CreateOrganizationDto) {
    return this.organizationsService.createOrganization('system', payload);
  }

  @Get()
  @Roles(Role.Admin, Role.CepexAgent)
  async listOrganizations() {
    return this.organizationsService.listOrganizations();
  }
}
