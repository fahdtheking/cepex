import { IsString, IsUUID } from 'class-validator';

export class AddMessageDto {
  @IsUUID()
  senderUserId!: string;

  @IsString()
  senderRole!: string;

  @IsString()
  content!: string;
}
