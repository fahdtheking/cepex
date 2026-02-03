import { IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name!: string;

  @IsString()
  sector!: string;

  @IsOptional()
  @IsString()
  country?: string;
}
