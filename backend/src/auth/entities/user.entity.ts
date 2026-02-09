import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'member' })
  role: string; // 'admin' | 'member'

  @Column({ name: 'job_title', nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ type: 'text', nullable: true })
  expertise: string;

  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string;

  @Column({ name: 'contact_phone', nullable: true })
  contactPhone: string;

  @Column({ name: 'bio_image_url', nullable: true })
  bioImageUrl: string;

  @Column({ name: 'is_anonymous', default: false })
  isAnonymous: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
