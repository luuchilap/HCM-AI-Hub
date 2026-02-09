import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepo: Repository<ContactMessage>,
    private readonly config: ConfigService,
  ) {
    // Create nodemailer transporter
    const mailUser = this.config.get('MAIL_USER');
    const mailPass = this.config.get('MAIL_PASS');

    if (mailUser && mailPass) {
      this.transporter = nodemailer.createTransport({
        host: this.config.get('MAIL_HOST', 'smtp.gmail.com'),
        port: parseInt(this.config.get('MAIL_PORT', '587')),
        secure: false,
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      });
    }
  }

  async create(dto: CreateContactDto) {
    // Save to database
    const message = this.contactRepo.create(dto);
    const saved = await this.contactRepo.save(message);

    // Send email notification
    await this.sendEmail(dto);

    return {
      id: saved.id,
      message: 'Message received successfully',
      createdAt: saved.createdAt,
    };
  }

  private async sendEmail(dto: CreateContactDto) {
    const mailTo = this.config.get('MAIL_TO', 'luuchilap@gmail.com');

    if (!this.transporter) {
      this.logger.warn(
        'Email transporter not configured. Skipping email send. Set MAIL_USER and MAIL_PASS in .env',
      );
      this.logger.log(`[Contact Form] Would send to: ${mailTo}`);
      this.logger.log(
        `From: ${dto.name} <${dto.email}> | Subject: ${dto.subject}`,
      );
      this.logger.log(`Message: ${dto.message}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"HCMC AI Hub Contact" <${this.config.get('MAIL_USER')}>`,
        to: mailTo,
        subject: `[HCMC AI Hub] Contact: ${dto.subject || 'No Subject'}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${dto.name}</p>
          <p><strong>Email:</strong> ${dto.email}</p>
          <p><strong>Subject:</strong> ${dto.subject || 'N/A'}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${dto.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #888; font-size: 12px;">
            Sent from HCMC AI Hub contact form at ${new Date().toISOString()}
          </p>
        `,
        replyTo: dto.email,
      });
      this.logger.log(`Contact email sent to ${mailTo}`);
    } catch (error) {
      this.logger.error('Failed to send contact email:', error);
      // Don't throw - the message is saved to DB even if email fails
    }
  }
}
