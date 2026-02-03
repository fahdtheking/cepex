import { IsEnum } from 'class-validator';
import { NegotiationStatus } from '../negotiation-status.enum';

export class UpdateNegotiationStatusDto {
  @IsEnum(NegotiationStatus)
  status!: NegotiationStatus;
}
