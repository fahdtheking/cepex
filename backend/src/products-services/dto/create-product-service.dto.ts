import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductServiceDto {
  @IsUUID()
  organizationId!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  sector!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
