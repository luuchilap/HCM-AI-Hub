import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subject?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;
}
