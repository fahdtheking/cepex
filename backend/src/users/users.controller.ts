import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  async createUser(@Body() payload: CreateUserDto) {
    return this.usersService.createUser('system', payload);
  }

  @Get()
  @Roles(Role.Admin)
  async listUsers() {
    return this.usersService.listUsers();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.CepexAgent)
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
