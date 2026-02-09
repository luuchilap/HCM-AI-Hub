import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollaborationRequest } from './entities/collaboration-request.entity';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';

@Injectable()
export class CollaborationsService {
  constructor(
    @InjectRepository(CollaborationRequest)
    private readonly repo: Repository<CollaborationRequest>,
  ) {}

  async create(dto: CreateCollaborationDto) {
    const request = this.repo.create({
      type: dto.type,
      name: dto.name,
      organization: dto.organization,
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone,
      title: dto.title,
      description: dto.description,
    });

    const saved = await this.repo.save(request);
    return {
      id: saved.id,
      message: 'Collaboration request submitted successfully',
    };
  }
}
