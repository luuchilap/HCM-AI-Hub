import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('members')
  async findAll() {
    return this.teamService.findAll();
  }

  @Get('members/:memberKey')
  async findByKey(@Param('memberKey') memberKey: string) {
    return this.teamService.findByKey(memberKey);
  }
}
