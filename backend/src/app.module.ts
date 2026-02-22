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
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        ssl:
          config.get('DATABASE_URL')?.includes('sslmode') ||
            config.get('DATABASE_URL')?.includes('ssl=true')
            ? { rejectUnauthorized: false }
            : false,
        autoLoadEntities: true,
        synchronize: true,
        extra: {
          connectionTimeoutMillis: 10000,
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    AuthModule,
    EventsModule,
    RegistrationsModule,
    ContactModule,
    NewsletterModule,
    TeamModule,
    CollaborationsModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule { }
