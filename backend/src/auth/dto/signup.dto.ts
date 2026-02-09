import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
