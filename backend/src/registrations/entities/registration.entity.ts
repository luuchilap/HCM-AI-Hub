import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  organization: string;

  @Column({ nullable: true })
  role: string;

  @Column({ name: 'organization_type', nullable: true })
  organizationType: string;

  @Column({ type: 'text', nullable: true })
  suggestions: string;

  @Column({ name: 'dietary_requirements', type: 'text', nullable: true })
  dietaryRequirements: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
