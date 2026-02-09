import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async findAll(status?: string) {
    const qb = this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.agendaItems', 'agenda')
      .orderBy('event.date', 'DESC')
      .addOrderBy('agenda.sortOrder', 'ASC');

    if (status && status !== 'all') {
      qb.where('event.status = :status', { status });
    }

    const events = await qb.getMany();
    return events.map((e) => this.toResponse(e));
  }

  async findUpcoming(limit = 10) {
    const today = new Date().toISOString().split('T')[0];
    const events = await this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.agendaItems', 'agenda')
      .where('event.date >= :today', { today })
      .andWhere('event.status IN (:...statuses)', {
        statuses: ['published', 'upcoming'],
      })
      .orderBy('event.date', 'ASC')
      .addOrderBy('agenda.sortOrder', 'ASC')
      .take(limit)
      .getMany();

    return events.map((e) => this.toResponse(e));
  }

  async findFeatured(limit = 3) {
    const events = await this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.agendaItems', 'agenda')
      .where('event.isFeatured = true')
      .andWhere('event.status IN (:...statuses)', {
        statuses: ['published', 'upcoming'],
      })
      .orderBy('event.date', 'DESC')
      .addOrderBy('agenda.sortOrder', 'ASC')
      .take(limit)
      .getMany();

    return events.map((e) => this.toResponse(e));
  }

  async findBySlug(slug: string) {
    const event = await this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.agendaItems', 'agenda')
      .where('event.slug = :slug', { slug })
      .addOrderBy('agenda.sortOrder', 'ASC')
      .getOne();

    return event ? this.toResponse(event) : null;
  }

  async findById(id: string) {
    const event = await this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.agendaItems', 'agenda')
      .where('event.id = :id', { id })
      .addOrderBy('agenda.sortOrder', 'ASC')
      .getOne();

    return event ? this.toResponse(event) : null;
  }

  /**
   * Transform DB entity to frontend-compatible response
   * with bilingual nested objects
   */
  private toResponse(event: Event) {
    return {
      _id: event.id,
      id: event.id,
      slug: event.slug,
      title: { vi: event.titleVi, en: event.titleEn },
      type: event.type,
      subtitle:
        event.subtitleVi || event.subtitleEn
          ? { vi: event.subtitleVi || '', en: event.subtitleEn || '' }
          : undefined,
      description: { vi: event.descriptionVi, en: event.descriptionEn },
      targetAudience:
        event.targetAudienceVi || event.targetAudienceEn
          ? {
              vi: event.targetAudienceVi || '',
              en: event.targetAudienceEn || '',
            }
          : undefined,
      agenda: (event.agendaItems || []).map((a, idx) => ({
        id: a.id,
        number: a.sortOrder || idx + 1,
        title: { vi: a.titleVi, en: a.titleEn },
        description:
          a.descriptionVi || a.descriptionEn
            ? { vi: a.descriptionVi || '', en: a.descriptionEn || '' }
            : undefined,
        time: a.timeSlot,
      })),
      date: event.date,
      startTime: event.startTime?.slice(0, 5),
      endTime: event.endTime?.slice(0, 5),
      venue: {
        name: { vi: event.venueNameVi, en: event.venueNameEn },
        address: event.venueAddress,
        city: event.venueCity,
        googleMapsUrl: event.venueGoogleMapsUrl,
      },
      registrationDeadline: event.registrationDeadline,
      registrationUrl: event.registrationUrl,
      qrCodeUrl: event.qrCodeUrl,
      bannerImage: event.bannerImage,
      status: event.status,
      maxAttendees: event.maxAttendees,
      isFeatured: event.isFeatured,
      _creationTime: event.createdAt?.getTime(),
    };
  }
}
