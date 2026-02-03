import { IsOptional, IsString } from 'class-validator';

export class UpdateApprovalDto {
  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
