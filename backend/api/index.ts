import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let cachedApp: any = null;

async function bootstrap() {
  if (cachedApp) return server;

  try {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { logger: ['error', 'warn', 'log'] },
    );

    app.setGlobalPrefix('api');

    // CORS — allow Vercel frontend URLs and localhost for dev
    const frontendUrl = process.env.FRONTEND_URL;
    app.enableCors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (server-to-server, curl, etc.)
        if (!origin) return callback(null, true);
        const allowed = [
          frontendUrl,
          'http://localhost:5173',
          'http://localhost:3000',
        ].filter(Boolean);
        // Also allow any *.vercel.app subdomain
        if (allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
      },
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
    // Register fallback error handler
    server.use('/api', (_req: any, res: any) => {
      res.status(500).json({
        statusCode: 500,
        message: 'Server initialization failed',
        error: String(error),
      });
    });
  }

  return server;
}

export default async (req: any, res: any) => {
  const s = await bootstrap();
  s(req, res);
};
