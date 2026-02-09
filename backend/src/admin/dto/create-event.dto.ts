import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  MinLength,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class AgendaItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNumber()
  sortOrder: number;

  @IsString()
  @MinLength(1)
  titleVi: string;

  @IsString()
  @MinLength(1)
  titleEn: string;

  @IsOptional()
  @IsString()
  descriptionVi?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  timeSlot?: string;
}

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  slug: string;

  @IsString()
  @MinLength(1)
  titleVi: string;

  @IsString()
  @MinLength(1)
  titleEn: string;

  @IsString()
  @IsIn(['conference', 'workshop', 'forum', 'symposium', 'seminar'])
  type: string;

  @IsOptional()
  @IsString()
  subtitleVi?: string;

  @IsOptional()
  @IsString()
  subtitleEn?: string;

  @IsString()
  @MinLength(1)
  descriptionVi: string;

  @IsString()
  @MinLength(1)
  descriptionEn: string;

  @IsOptional()
  @IsString()
  targetAudienceVi?: string;

  @IsOptional()
  @IsString()
  targetAudienceEn?: string;

  @IsString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  @MinLength(1)
  venueNameVi: string;

  @IsString()
  @MinLength(1)
  venueNameEn: string;

  @IsString()
  @MinLength(1)
  venueAddress: string;

  @IsString()
  @MinLength(1)
  venueCity: string;

  @IsOptional()
  @IsString()
  venueGoogleMapsUrl?: string;

  @IsOptional()
  @IsString()
  registrationDeadline?: string;

  @IsOptional()
  @IsString()
  registrationUrl?: string;

  @IsOptional()
  @IsString()
  qrCodeUrl?: string;

  @IsOptional()
  @IsString()
  bannerImage?: string;

  @IsOptional()
  @IsString()
  @IsIn(['draft', 'published', 'upcoming', 'past', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  maxAttendees?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgendaItemDto)
  agendaItems?: AgendaItemDto[];
}
