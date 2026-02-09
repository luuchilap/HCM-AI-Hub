import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EventAgendaItem } from './event-agenda-item.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'title_vi' })
  titleVi: string;

  @Column({ name: 'title_en' })
  titleEn: string;

  @Column()
  type: string;

  @Column({ name: 'subtitle_vi', nullable: true })
  subtitleVi: string;

  @Column({ name: 'subtitle_en', nullable: true })
  subtitleEn: string;

  @Column({ name: 'description_vi', type: 'text' })
  descriptionVi: string;

  @Column({ name: 'description_en', type: 'text' })
  descriptionEn: string;

  @Column({ name: 'target_audience_vi', type: 'text', nullable: true })
  targetAudienceVi: string;

  @Column({ name: 'target_audience_en', type: 'text', nullable: true })
  targetAudienceEn: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'venue_name_vi' })
  venueNameVi: string;

  @Column({ name: 'venue_name_en' })
  venueNameEn: string;

  @Column({ name: 'venue_address' })
  venueAddress: string;

  @Column({ name: 'venue_city' })
  venueCity: string;

  @Column({ name: 'venue_google_maps_url', nullable: true })
  venueGoogleMapsUrl: string;

  @Column({ name: 'registration_deadline', type: 'date', nullable: true })
  registrationDeadline: string;

  @Column({ name: 'registration_url', nullable: true })
  registrationUrl: string;

  @Column({ name: 'qr_code_url', nullable: true })
  qrCodeUrl: string;

  @Column({ name: 'banner_image', nullable: true })
  bannerImage: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ name: 'max_attendees', nullable: true })
  maxAttendees: number;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => EventAgendaItem, (item) => item.event, { eager: true })
  agendaItems: EventAgendaItem[];
}
