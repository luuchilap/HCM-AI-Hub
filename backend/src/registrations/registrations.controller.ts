import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('events/:eventId/registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Body() dto: CreateRegistrationDto,
  ) {
    return this.registrationsService.create(eventId, dto);
  }

  @Get('check')
  async checkRegistration(
    @Param('eventId') eventId: string,
    @Query('email') email: string,
  ) {
    return this.registrationsService.checkRegistration(eventId, email);
  }

  @Get('count')
  async getCount(@Param('eventId') eventId: string) {
    return this.registrationsService.getCountByEvent(eventId);
  }
}
