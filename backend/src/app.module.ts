import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { ContactModule } from './contact/contact.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { TeamModule } from './team/team.module';
import { AuthModule } from './auth/auth.module';
import { CollaborationsModule } from './collaborations/collaborations.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        ssl: true,
        autoLoadEntities: true,
        synchronize: false,
        extra: {
          connectionTimeoutMillis: 10000,
        },
      }),
    }),
    AuthModule,
    EventsModule,
    RegistrationsModule,
    ContactModule,
    NewsletterModule,
    TeamModule,
    CollaborationsModule,
    AdminModule,
  ],
})
export class AppModule {}
