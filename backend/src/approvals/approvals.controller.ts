import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { ApprovalsService } from './approvals.service';

@Controller('approvals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  @Roles(Role.CepexAgent, Role.Admin)
  async listApprovals() {
    return this.approvalsService.listApprovals();
  }

  @Patch(':id')
  @Roles(Role.CepexAgent, Role.Admin)
  async updateApproval(@Param('id') id: string, @Body() payload: UpdateApprovalDto) {
    return this.approvalsService.updateApproval('system', id, payload);
  }
}
