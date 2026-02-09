import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ContactMessage } from '../contact/entities/contact-message.entity';
import { NewsletterSubscriber } from '../newsletter/entities/newsletter-subscriber.entity';
import { Event } from '../events/entities/event.entity';
import { EventAgendaItem } from '../events/entities/event-agenda-item.entity';
import { Registration } from '../registrations/entities/registration.entity';
import { User } from '../auth/entities/user.entity';
import { CollaborationRequest } from '../collaborations/entities/collaboration-request.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactMessage,
      NewsletterSubscriber,
      Event,
      EventAgendaItem,
      Registration,
      User,
      CollaborationRequest,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
