import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventAgendaItem } from './entities/event-agenda-item.entity';

const SEED_EVENTS = [
  {
    slug: 'ai-healthcare-research-2025',
    titleVi: 'Hợp tác nghiên cứu về AI cho Y tế',
    titleEn: 'Research Collaboration on AI for Healthcare',
    type: 'seminar',
    subtitleVi: 'Thảo luận về giải pháp AI cho ngành y tế',
    subtitleEn: 'Discussion on AI solutions for healthcare',
    descriptionVi:
      'Đại diện các trường đại học, bệnh viện và các doanh nghiệp để thảo luận các nội dung: Ngành y tế đang có các bài toán gì về giải pháp số, dữ liệu và trí tuệ nhân tạo; Ngành y tế đang có các dữ liệu gì; Doanh nghiệp đang có các giải pháp gì; Chọn bài toán cần giải quyết; Mô hình hợp tác; Kế hoạch nghiên cứu và thử nghiệm.',
    descriptionEn:
      'Representatives from universities, hospitals, and enterprises discuss: What digital solutions, data, and AI challenges does the healthcare sector face; What data does the healthcare sector have; What solutions do enterprises offer; Selecting problems to solve; Collaboration models; Research and pilot plans.',
    targetAudienceVi:
      'Đại diện các trường đại học, bệnh viện, doanh nghiệp công nghệ y tế',
    targetAudienceEn:
      'Representatives from universities, hospitals, healthcare technology enterprises',
    date: '2025-03-15',
    startTime: '14:00',
    endTime: '16:00',
    venueNameVi: 'Trường Đại học Bách khoa – ĐHQG-HCM',
    venueNameEn: 'VNU-HCM University of Technology',
    venueAddress: '268 Lý Thường Kiệt, Phường Diên Hồng, Quận 10',
    venueCity: 'TP. Hồ Chí Minh',
    venueGoogleMapsUrl: 'https://maps.google.com/?q=10.7729391,106.6579422',
    registrationDeadline: '2025-03-10',
    status: 'past',
    isFeatured: true,
    agendaItems: [
      { sortOrder: 1, titleVi: 'Bài toán giải pháp số, dữ liệu và AI trong y tế', titleEn: 'Digital solutions, data, and AI challenges in healthcare', timeSlot: '14:00' },
      { sortOrder: 2, titleVi: 'Dữ liệu hiện có trong ngành y tế', titleEn: 'Available data in the healthcare sector', timeSlot: '14:20' },
      { sortOrder: 3, titleVi: 'Giải pháp từ doanh nghiệp', titleEn: 'Enterprise solutions', timeSlot: '14:40' },
      { sortOrder: 4, titleVi: 'Chọn bài toán cần giải quyết', titleEn: 'Selecting problems to solve', timeSlot: '15:00' },
      { sortOrder: 5, titleVi: 'Mô hình hợp tác', titleEn: 'Collaboration models', timeSlot: '15:20' },
      { sortOrder: 6, titleVi: 'Kế hoạch nghiên cứu và thử nghiệm', titleEn: 'Research and pilot plans', timeSlot: '15:40' },
    ],
  },
  {
    slug: 'ai-workforce-training-2025',
    titleVi: 'Đào tạo nhân lực AI cho Doanh nghiệp',
    titleEn: 'AI Workforce Training for Enterprises',
    type: 'seminar',
    subtitleVi: 'Thảo luận về đào tạo nhân lực AI',
    subtitleEn: 'Discussion on AI workforce training',
    descriptionVi:
      'Đại diện các trường đại học và các doanh nghiệp để thảo luận các nội dung: Nhu cầu nhân lực AI cho doanh nghiệp (DN công nghệ và doanh nghiệp không phải công nghệ); Các khó khăn của doanh nghiệp khi tuyển dụng và đào tạo nhân lực AI; Các hình thức đào tạo AI hiện nay từ các trường đại học; Chia sẻ kinh nghiệm, giải pháp và mô hình hợp tác; Kế hoạch triển khai.',
    descriptionEn:
      'Representatives from universities and enterprises discuss: AI workforce needs for enterprises (tech and non-tech companies); Challenges in recruiting and training AI workforce; Current AI training formats from universities; Sharing experiences, solutions, and collaboration models; Implementation plan.',
    targetAudienceVi:
      'Đại diện các trường đại học, doanh nghiệp công nghệ và doanh nghiệp không phải công nghệ',
    targetAudienceEn:
      'Representatives from universities, tech enterprises, and non-tech enterprises',
    date: '2025-04-15',
    startTime: '09:00',
    endTime: '11:00',
    venueNameVi: 'Hội trường Bách Khoa – Trường ĐH Bách Khoa – ĐHQG-HCM',
    venueNameEn: 'Bach Khoa Hall, VNU-HCM University of Technology',
    venueAddress: '268 Lý Thường Kiệt, Phường Diên Hồng, Quận 10',
    venueCity: 'TP. Hồ Chí Minh',
    venueGoogleMapsUrl: 'https://maps.google.com/?q=10.7729391,106.6579422',
    registrationDeadline: '2025-04-10',
    status: 'past',
    isFeatured: false,
    agendaItems: [
      { sortOrder: 1, titleVi: 'Nhu cầu nhân lực AI cho doanh nghiệp', titleEn: 'AI workforce needs for enterprises', descriptionVi: 'DN công nghệ và doanh nghiệp không phải công nghệ', descriptionEn: 'Tech and non-tech companies', timeSlot: '09:00' },
      { sortOrder: 2, titleVi: 'Khó khăn khi tuyển dụng và đào tạo nhân lực AI', titleEn: 'Challenges in recruiting and training AI workforce', timeSlot: '09:20' },
      { sortOrder: 3, titleVi: 'Các hình thức đào tạo AI từ các trường đại học', titleEn: 'Current AI training formats from universities', timeSlot: '09:40' },
      { sortOrder: 4, titleVi: 'Chia sẻ kinh nghiệm, giải pháp và mô hình hợp tác', titleEn: 'Sharing experiences, solutions, and collaboration models', timeSlot: '10:00' },
      { sortOrder: 5, titleVi: 'Kế hoạch triển khai', titleEn: 'Implementation plan', timeSlot: '10:30' },
    ],
  },
];

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventAgendaItem)
    private readonly agendaRepo: Repository<EventAgendaItem>,
  ) { }

  /**
   * Seeds events only if they don't already exist.
   */
  async seedIfEmpty() {
    const existing = await this.eventRepo.count();
    if (existing > 0) {
      return { message: `Already have ${existing} events. Skipping seed.` };
    }
    return this.runSeed();
  }

  /**
   * Force re-seeds all events (clears existing first).
   */
  async runSeed() {
    // Delete all (CASCADE will remove agenda items)
    await this.eventRepo.query('DELETE FROM events');

    const inserted: string[] = [];
    for (const data of SEED_EVENTS) {
      const { agendaItems, ...fields } = data;
      const event = this.eventRepo.create(fields);
      const saved = await this.eventRepo.save(event);

      if (agendaItems.length > 0) {
        const items = agendaItems.map((a) =>
          this.agendaRepo.create({ ...a, eventId: saved.id }),
        );
        await this.agendaRepo.save(items);
      }
      inserted.push(saved.id);
    }

    return { message: `Seeded ${inserted.length} events.`, ids: inserted };
  }

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
        statuses: ['published', 'upcoming', 'past'],
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
