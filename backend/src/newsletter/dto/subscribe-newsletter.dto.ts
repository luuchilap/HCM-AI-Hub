import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
