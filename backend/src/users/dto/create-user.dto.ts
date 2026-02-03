import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Role } from '../../auth/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  fullName!: string;

  @IsEnum(Role)
  role!: Role;

  @IsUUID()
  organizationId!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
