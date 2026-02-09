import { IsString, IsEmail, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  organization: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @IsIn(['university', 'tech_company', 'government_other'])
  organizationType: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  suggestions?: string;
}
