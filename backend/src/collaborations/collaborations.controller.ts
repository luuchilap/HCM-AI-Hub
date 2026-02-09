import { Controller, Post, Body } from '@nestjs/common';
import { CollaborationsService } from './collaborations.service';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';

@Controller('collaborations')
export class CollaborationsController {
  constructor(private readonly service: CollaborationsService) {}

  @Post()
  async create(@Body() dto: CreateCollaborationDto) {
    return this.service.create(dto);
  }
}
