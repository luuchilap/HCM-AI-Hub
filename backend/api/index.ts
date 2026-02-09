import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    try {
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
        logger: ['error', 'warn', 'log'],
      });

      app.setGlobalPrefix('api');

      // CORS: allow all origins in production for now
      const frontendUrl = process.env.FRONTEND_URL;
      app.enableCors({
        origin: frontendUrl && frontendUrl !== '*' ? frontendUrl : true,
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
