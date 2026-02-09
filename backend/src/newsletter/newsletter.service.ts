import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subRepo: Repository<NewsletterSubscriber>,
  ) {}

  async subscribe(dto: SubscribeNewsletterDto) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.subRepo.findOne({ where: { email } });

    if (existing) {
      if (existing.isActive) {
        throw new BadRequestException('Email is already subscribed');
      }
      // Reactivate
      existing.isActive = true;
      existing.unsubscribedAt = null as any;
      existing.name = dto.name || existing.name;
      const saved = await this.subRepo.save(existing);
      return {
        id: saved.id,
        email: saved.email,
        subscribedAt: saved.subscribedAt,
        message: 'Successfully resubscribed',
      };
    }

    const subscriber = this.subRepo.create({ email, name: dto.name });
    const saved = await this.subRepo.save(subscriber);

    return {
      id: saved.id,
      email: saved.email,
      subscribedAt: saved.subscribedAt,
      message: 'Successfully subscribed',
    };
  }
}
