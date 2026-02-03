import { IsString } from 'class-validator';

export class GenerateAiMessageDto {
  @IsString()
  context!: string;
}
