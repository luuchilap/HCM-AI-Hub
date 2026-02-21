import { Controller, Get, Post, Param, Query, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  /**
   * Public debug endpoint to manually trigger event seeding.
   * Can be removed / guarded in production.
   */
  @Post('seed')
  async seed() {
    return this.eventsService.seedIfEmpty();
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
  ) {
    if (featured === 'true') {
      return this.eventsService.findFeatured(limit ? parseInt(limit) : 3);
    }
    if (status === 'upcoming') {
      return this.eventsService.findUpcoming(limit ? parseInt(limit) : 10);
    }
    return this.eventsService.findAll(status);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const event = await this.eventsService.findBySlug(slug);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }
}
