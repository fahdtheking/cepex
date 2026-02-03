import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProductServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
