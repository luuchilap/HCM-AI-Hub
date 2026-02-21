import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeepPartial } from 'typeorm';
import { ContactMessage } from '../contact/entities/contact-message.entity';
import { NewsletterSubscriber } from '../newsletter/entities/newsletter-subscriber.entity';
import { Event } from '../events/entities/event.entity';
import { EventAgendaItem } from '../events/entities/event-agenda-item.entity';
import { Registration } from '../registrations/entities/registration.entity';
import { User } from '../auth/entities/user.entity';
import { CollaborationRequest } from '../collaborations/entities/collaboration-request.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepo: Repository<ContactMessage>,
    @InjectRepository(NewsletterSubscriber)
    private readonly newsletterRepo: Repository<NewsletterSubscriber>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventAgendaItem)
    private readonly agendaRepo: Repository<EventAgendaItem>,
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CollaborationRequest)
    private readonly collaborationRepo: Repository<CollaborationRequest>,
  ) { }

  private readonly logger = {
    log: (msg: string) => console.log(`[AdminService] ${msg}`),
    error: (msg: string, err?: any) => console.error(`[AdminService ERROR] ${msg}`, err ?? ''),
  };

  async onModuleInit() {
    try {
      const seed1 = await this.eventRepo.findOne({ where: { slug: 'ai-healthcare-research-2025' } });
      const seed2 = await this.eventRepo.findOne({ where: { slug: 'ai-workforce-training-2025' } });

      if (!seed1 || !seed2) {
        this.logger.log('Seeding missing events on startup...');
        const result = await this.seedEvents();
        this.logger.log(`Seeding done: ${JSON.stringify(result)}`);
      } else {
        this.logger.log('Seed events already exist. Skipping seeding.');
      }
    } catch (err) {
      this.logger.error('Failed in onModuleInit seeding', err);
    }
  }

  // ---- Dashboard Stats ----
  async getDashboardStats() {
    const [
      totalContacts,
      unreadContacts,
      totalSubscribers,
      totalEvents,
      totalRegistrations,
      totalUsers,
      totalCollaborations,
      unreadCollaborations,
    ] = await Promise.all([
      this.contactRepo.count(),
      this.contactRepo.count({ where: { isRead: false } }),
      this.newsletterRepo.count({ where: { isActive: true } }),
      this.eventRepo.count(),
      this.registrationRepo.count(),
      this.userRepo.count(),
      this.collaborationRepo.count(),
      this.collaborationRepo.count({ where: { isRead: false } }),
    ]);

    return {
      contacts: { total: totalContacts, unread: unreadContacts },
      subscribers: totalSubscribers,
      events: totalEvents,
      registrations: totalRegistrations,
      users: totalUsers,
      collaborations: { total: totalCollaborations, unread: unreadCollaborations },
    };
  }

  // ---- Contact Messages ----
  async getContacts(unreadOnly = false) {
    const where = unreadOnly ? { isRead: false } : {};
    return this.contactRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async markContactRead(id: string) {
    const msg = await this.contactRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Contact message not found');
    msg.isRead = true;
    return this.contactRepo.save(msg);
  }

  async deleteContact(id: string) {
    const result = await this.contactRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Contact message not found');
    return { deleted: true };
  }

  // ---- Newsletter ----
  async getSubscribers() {
    return this.newsletterRepo.find({ order: { subscribedAt: 'DESC' } });
  }

  async deleteSubscriber(id: string) {
    const result = await this.newsletterRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Subscriber not found');
    return { deleted: true };
  }

  // ---- Events CRUD ----
  async getEvents() {
    const events = await this.eventRepo.find({
      order: { date: 'DESC' },
      relations: ['agendaItems'],
    });
    return events.map((e) => ({
      id: e.id,
      slug: e.slug,
      titleVi: e.titleVi,
      titleEn: e.titleEn,
      type: e.type,
      date: e.date,
      status: e.status,
      isFeatured: e.isFeatured,
      maxAttendees: e.maxAttendees,
      createdAt: e.createdAt,
    }));
  }

  async getEventById(id: string) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['agendaItems'],
    });
    if (!event) throw new NotFoundException('Event not found');

    return {
      id: event.id,
      slug: event.slug,
      titleVi: event.titleVi,
      titleEn: event.titleEn,
      type: event.type,
      subtitleVi: event.subtitleVi,
      subtitleEn: event.subtitleEn,
      descriptionVi: event.descriptionVi,
      descriptionEn: event.descriptionEn,
      targetAudienceVi: event.targetAudienceVi,
      targetAudienceEn: event.targetAudienceEn,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      venueNameVi: event.venueNameVi,
      venueNameEn: event.venueNameEn,
      venueAddress: event.venueAddress,
      venueCity: event.venueCity,
      venueGoogleMapsUrl: event.venueGoogleMapsUrl,
      registrationDeadline: event.registrationDeadline,
      registrationUrl: event.registrationUrl,
      qrCodeUrl: event.qrCodeUrl,
      bannerImage: event.bannerImage,
      status: event.status,
      maxAttendees: event.maxAttendees,
      isFeatured: event.isFeatured,
      agendaItems: (event.agendaItems || [])
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((a) => ({
          id: a.id,
          sortOrder: a.sortOrder,
          titleVi: a.titleVi,
          titleEn: a.titleEn,
          descriptionVi: a.descriptionVi,
          descriptionEn: a.descriptionEn,
          timeSlot: a.timeSlot,
        })),
    };
  }

  async createEvent(dto: CreateEventDto) {
    // Check slug uniqueness
    const existing = await this.eventRepo.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('An event with this slug already exists');
    }

    const event = this.eventRepo.create({
      slug: dto.slug,
      titleVi: dto.titleVi,
      titleEn: dto.titleEn,
      type: dto.type,
      subtitleVi: dto.subtitleVi,
      subtitleEn: dto.subtitleEn,
      descriptionVi: dto.descriptionVi,
      descriptionEn: dto.descriptionEn,
      targetAudienceVi: dto.targetAudienceVi,
      targetAudienceEn: dto.targetAudienceEn,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      venueNameVi: dto.venueNameVi,
      venueNameEn: dto.venueNameEn,
      venueAddress: dto.venueAddress,
      venueCity: dto.venueCity,
      venueGoogleMapsUrl: dto.venueGoogleMapsUrl,
      registrationDeadline: dto.registrationDeadline,
      registrationUrl: dto.registrationUrl,
      qrCodeUrl: dto.qrCodeUrl,
      bannerImage: dto.bannerImage,
      status: dto.status || 'draft',
      maxAttendees: dto.maxAttendees,
      isFeatured: dto.isFeatured || false,
    });

    const saved = await this.eventRepo.save(event);

    // Create agenda items
    if (dto.agendaItems && dto.agendaItems.length > 0) {
      const items = dto.agendaItems.map((a) =>
        this.agendaRepo.create({
          eventId: saved.id,
          sortOrder: a.sortOrder,
          titleVi: a.titleVi,
          titleEn: a.titleEn,
          descriptionVi: a.descriptionVi,
          descriptionEn: a.descriptionEn,
          timeSlot: a.timeSlot,
        }),
      );
      await this.agendaRepo.save(items);
    }

    return this.getEventById(saved.id);
  }

  async updateEvent(id: string, dto: CreateEventDto) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    // Check slug uniqueness if changed
    if (dto.slug !== event.slug) {
      const existing = await this.eventRepo.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException('An event with this slug already exists');
      }
    }

    // Update event fields
    Object.assign(event, {
      slug: dto.slug,
      titleVi: dto.titleVi,
      titleEn: dto.titleEn,
      type: dto.type,
      subtitleVi: dto.subtitleVi || null,
      subtitleEn: dto.subtitleEn || null,
      descriptionVi: dto.descriptionVi,
      descriptionEn: dto.descriptionEn,
      targetAudienceVi: dto.targetAudienceVi || null,
      targetAudienceEn: dto.targetAudienceEn || null,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      venueNameVi: dto.venueNameVi,
      venueNameEn: dto.venueNameEn,
      venueAddress: dto.venueAddress,
      venueCity: dto.venueCity,
      venueGoogleMapsUrl: dto.venueGoogleMapsUrl || null,
      registrationDeadline: dto.registrationDeadline || null,
      registrationUrl: dto.registrationUrl || null,
      qrCodeUrl: dto.qrCodeUrl || null,
      bannerImage: dto.bannerImage || null,
      status: dto.status || event.status,
      maxAttendees: dto.maxAttendees ?? null,
      isFeatured: dto.isFeatured ?? event.isFeatured,
    });

    await this.eventRepo.save(event);

    // Replace agenda items: delete old, create new
    await this.agendaRepo.delete({ eventId: id });

    if (dto.agendaItems && dto.agendaItems.length > 0) {
      const items = dto.agendaItems.map((a) =>
        this.agendaRepo.create({
          eventId: id,
          sortOrder: a.sortOrder,
          titleVi: a.titleVi,
          titleEn: a.titleEn,
          descriptionVi: a.descriptionVi,
          descriptionEn: a.descriptionEn,
          timeSlot: a.timeSlot,
        }),
      );
      await this.agendaRepo.save(items);
    }

    return this.getEventById(id);
  }

  async deleteEvent(id: string) {
    // Agenda items will cascade delete
    const result = await this.eventRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Event not found');
    return { deleted: true };
  }

  // ---- Registrations ----
  async getRegistrations(eventId: string) {
    return this.registrationRepo.find({
      where: { eventId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateRegistrationStatus(id: string, status: string) {
    const valid = ['pending', 'confirmed', 'cancelled'];
    if (!valid.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Use: ${valid.join(', ')}`,
      );
    }
    const reg = await this.registrationRepo.findOne({ where: { id } });
    if (!reg) throw new NotFoundException('Registration not found');
    reg.status = status;
    return this.registrationRepo.save(reg);
  }

  async deleteRegistration(id: string) {
    const result = await this.registrationRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Registration not found');
    return { deleted: true };
  }

  // ---- Collaboration Requests ----
  async getCollaborations() {
    return this.collaborationRepo.find({ order: { createdAt: 'DESC' } });
  }

  async markCollaborationRead(id: string) {
    const req = await this.collaborationRepo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Collaboration request not found');
    req.isRead = true;
    return this.collaborationRepo.save(req);
  }

  async deleteCollaboration(id: string) {
    const result = await this.collaborationRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Collaboration request not found');
    return { deleted: true };
  }

  // ---- Users ----
  async getUsers() {
    const users = await this.userRepo.find({ order: { createdAt: 'DESC' } });
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
    }));
  }

  async updateUserRole(id: string, role: string) {
    if (!['admin', 'member'].includes(role)) {
      throw new BadRequestException('Invalid role. Use: admin or member');
    }
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    const saved = await this.userRepo.save(user);
    return { id: saved.id, email: saved.email, role: saved.role };
  }

  // ---- Seeding ----
  async seedEvents() {
    // Clear existing events (agenda items will be deleted via CASCADE)
    await this.eventRepo.delete({});

    const events = [
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
          {
            sortOrder: 1,
            titleVi: 'Bài toán giải pháp số, dữ liệu và AI trong y tế',
            titleEn: 'Digital solutions, data, and AI challenges in healthcare',
            timeSlot: '14:00',
          },
          {
            sortOrder: 2,
            titleVi: 'Dữ liệu hiện có trong ngành y tế',
            titleEn: 'Available data in the healthcare sector',
            timeSlot: '14:20',
          },
          {
            sortOrder: 3,
            titleVi: 'Giải pháp từ doanh nghiệp',
            titleEn: 'Enterprise solutions',
            timeSlot: '14:40',
          },
          {
            sortOrder: 4,
            titleVi: 'Chọn bài toán cần giải quyết',
            titleEn: 'Selecting problems to solve',
            timeSlot: '15:00',
          },
          {
            sortOrder: 5,
            titleVi: 'Mô hình hợp tác',
            titleEn: 'Collaboration models',
            timeSlot: '15:20',
          },
          {
            sortOrder: 6,
            titleVi: 'Kế hoạch nghiên cứu và thử nghiệm',
            titleEn: 'Research and pilot plans',
            timeSlot: '15:40',
          },
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
          {
            sortOrder: 1,
            titleVi: 'Nhu cầu nhân lực AI cho doanh nghiệp',
            titleEn: 'AI workforce needs for enterprises',
            descriptionVi: 'DN công nghệ và doanh nghiệp không phải công nghệ',
            descriptionEn: 'Tech and non-tech companies',
            timeSlot: '09:00',
          },
          {
            sortOrder: 2,
            titleVi: 'Khó khăn khi tuyển dụng và đào tạo nhân lực AI',
            titleEn: 'Challenges in recruiting and training AI workforce',
            timeSlot: '09:20',
          },
          {
            sortOrder: 3,
            titleVi: 'Các hình thức đào tạo AI từ các trường đại học',
            titleEn: 'Current AI training formats from universities',
            timeSlot: '09:40',
          },
          {
            sortOrder: 4,
            titleVi: 'Chia sẻ kinh nghiệm, giải pháp và mô hình hợp tác',
            titleEn: 'Sharing experiences, solutions, and collaboration models',
            timeSlot: '10:00',
          },
          {
            sortOrder: 5,
            titleVi: 'Kế hoạch triển khai',
            titleEn: 'Implementation plan',
            timeSlot: '10:30',
          },
        ],
      },
    ];

    const results: string[] = [];
    for (const eventData of events) {
      const { agendaItems, ...eventFields } = eventData;
      const event = this.eventRepo.create(eventFields as DeepPartial<Event>);
      const savedEvent = await this.eventRepo.save(event);

      if (agendaItems && agendaItems.length > 0) {
        const items = agendaItems.map((item) =>
          this.agendaRepo.create({ ...item, eventId: savedEvent.id }),
        );
        await this.agendaRepo.save(items);
      }
      results.push(savedEvent.id);
    }

    return {
      message: `Successfully seeded ${results.length} events`,
      eventIds: results,
    };
  }
}
