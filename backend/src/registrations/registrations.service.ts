import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private readonly regRepo: Repository<Registration>,
    private readonly eventsService: EventsService,
  ) {}

  async create(eventId: string, dto: CreateRegistrationDto) {
    // Check event exists
    const event = await this.eventsService.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check event is not past or cancelled
    if (event.status === 'past' || event.status === 'cancelled') {
      throw new BadRequestException('Registration is closed for this event');
    }

    // Check registration deadline
    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline);
      if (new Date() > deadline) {
        throw new BadRequestException('Registration deadline has passed');
      }
    }

    const email = dto.email.toLowerCase().trim();

    // Check if already registered
    const existing = await this.regRepo.findOne({
      where: { eventId, email },
    });

    if (existing) {
      if (existing.status === 'cancelled') {
        // Reactivate
        existing.status = 'confirmed';
        existing.fullName = dto.fullName;
        existing.phone = dto.phone ?? existing.phone;
        existing.organization = dto.organization;
        existing.role = dto.role ?? existing.role;
        existing.organizationType = dto.organizationType;
        existing.suggestions = dto.suggestions ?? existing.suggestions;
        return this.regRepo.save(existing);
      }
      throw new BadRequestException(
        'You are already registered for this event',
      );
    }

    // Check max attendees
    if (event.maxAttendees) {
      const count = await this.regRepo.count({
        where: { eventId, status: 'confirmed' },
      });
      if (count >= event.maxAttendees) {
        throw new BadRequestException('This event is fully booked');
      }
    }

    const registration = this.regRepo.create({
      eventId,
      fullName: dto.fullName,
      email,
      phone: dto.phone,
      organization: dto.organization,
      role: dto.role,
      organizationType: dto.organizationType,
      suggestions: dto.suggestions,
      status: 'confirmed',
    });

    return this.regRepo.save(registration);
  }

  async checkRegistration(eventId: string, email: string) {
    const reg = await this.regRepo.findOne({
      where: { eventId, email: email.toLowerCase() },
    });
    return reg
      ? { registered: true, status: reg.status }
      : { registered: false };
  }

  async getCountByEvent(eventId: string) {
    const count = await this.regRepo.count({
      where: { eventId, status: 'confirmed' },
    });
    return { count };
  }
}
