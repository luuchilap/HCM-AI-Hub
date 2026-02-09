import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let cachedApp: any;

// Health check that works even if NestJS fails to boot
server.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function bootstrap() {
  if (!cachedApp) {
    try {
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
        logger: ['error', 'warn', 'log'],
      });

      app.setGlobalPrefix('api');
      app.enableCors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
      });
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );

      await app.init();
      cachedApp = app;
    } catch (error) {
      console.error('NestJS bootstrap error:', error);
      // Return error handler so requests don't hang
      server.use('/api', (_req, res) => {
        res.status(500).json({
          statusCode: 500,
          message: 'Server initialization failed',
          error: String(error),
        });
      });
    }
  }
  return server;
}

export default async (req: any, res: any) => {
  const s = await bootstrap();
  s(req, res);
};
