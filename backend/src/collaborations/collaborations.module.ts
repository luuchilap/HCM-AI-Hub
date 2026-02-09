import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaborationRequest } from './entities/collaboration-request.entity';
import { CollaborationsController } from './collaborations.controller';
import { CollaborationsService } from './collaborations.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollaborationRequest])],
  controllers: [CollaborationsController],
  providers: [CollaborationsService],
})
export class CollaborationsModule {}
