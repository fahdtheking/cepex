import { IsOptional, IsString } from 'class-validator';

export class SemanticSearchDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  region?: string;
}
