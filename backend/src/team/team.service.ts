import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TeamMember } from './entities/team-member.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {}

  async findAll() {
    return this.memberRepo.find({
      order: { isCoreMember: 'DESC', sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findByKey(memberKey: string) {
    const member = await this.memberRepo.findOne({ where: { memberKey } });
    if (!member) {
      throw new NotFoundException('Team member not found');
    }
    return member;
  }

  async findByEmails(emails: string[]) {
    if (!emails.length) return [];
    return this.memberRepo.find({
      where: { email: In(emails.map((e) => e.toLowerCase())) },
    });
  }
}
