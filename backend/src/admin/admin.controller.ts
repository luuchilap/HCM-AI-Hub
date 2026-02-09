import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ---- Dashboard Stats ----
  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  // ---- Contact Messages ----
  @Get('contacts')
  async getContacts(@Query('unread') unread?: string) {
    return this.adminService.getContacts(unread === 'true');
  }

  @Patch('contacts/:id/read')
  async markContactRead(@Param('id') id: string) {
    return this.adminService.markContactRead(id);
  }

  @Delete('contacts/:id')
  async deleteContact(@Param('id') id: string) {
    return this.adminService.deleteContact(id);
  }

  // ---- Newsletter Subscribers ----
  @Get('newsletter')
  async getSubscribers() {
    return this.adminService.getSubscribers();
  }

  @Delete('newsletter/:id')
  async deleteSubscriber(@Param('id') id: string) {
    return this.adminService.deleteSubscriber(id);
  }

  // ---- Events CRUD ----
  @Get('events')
  async getEvents() {
    return this.adminService.getEvents();
  }

  @Get('events/:id')
  async getEvent(@Param('id') id: string) {
    return this.adminService.getEventById(id);
  }

  @Post('events')
  async createEvent(@Body() dto: CreateEventDto) {
    return this.adminService.createEvent(dto);
  }

  @Put('events/:id')
  async updateEvent(@Param('id') id: string, @Body() dto: CreateEventDto) {
    return this.adminService.updateEvent(id, dto);
  }

  @Delete('events/:id')
  async deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  // ---- Registrations ----
  @Get('events/:eventId/registrations')
  async getRegistrations(@Param('eventId') eventId: string) {
    return this.adminService.getRegistrations(eventId);
  }

  @Patch('registrations/:id/status')
  async updateRegistrationStatus(
    @Param('id') id: string,
    @Query('status') status: string,
  ) {
    return this.adminService.updateRegistrationStatus(id, status);
  }

  @Delete('registrations/:id')
  async deleteRegistration(@Param('id') id: string) {
    return this.adminService.deleteRegistration(id);
  }

  // ---- Collaboration Requests ----
  @Get('collaborations')
  async getCollaborations() {
    return this.adminService.getCollaborations();
  }

  @Patch('collaborations/:id/read')
  async markCollaborationRead(@Param('id') id: string) {
    return this.adminService.markCollaborationRead(id);
  }

  @Delete('collaborations/:id')
  async deleteCollaboration(@Param('id') id: string) {
    return this.adminService.deleteCollaboration(id);
  }

  // ---- Users ----
  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Query('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role);
  }
}
