import { IsString, IsUUID } from 'class-validator';

export class CreateNegotiationDto {
  @IsUUID()
  importerOrganizationId!: string;

  @IsUUID()
  exporterOrganizationId!: string;

  @IsUUID()
  productServiceId!: string;

  @IsString()
  title!: string;
}
