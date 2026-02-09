import { IsString, IsEmail, IsOptional, IsIn, MinLength } from 'class-validator';

export class CreateCollaborationDto {
  @IsString()
  @IsIn(['use-case', 'problem-statement', 'partnership'])
  type: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  organization: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;
}
