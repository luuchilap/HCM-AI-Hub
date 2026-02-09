import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_key', unique: true })
  memberKey: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ name: 'role_title', nullable: true })
  roleTitle: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'is_core_member', default: false })
  isCoreMember: boolean;

  @Column({ name: 'exec_role', nullable: true })
  execRole: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
