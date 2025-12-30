import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get config service
  const configService = app.get(ConfigService);

  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Security
  app.use(helmet());

  // CORS
  const corsOrigins = configService.get<string>('CORS_ORIGIN', 'http://localhost:3001,http://localhost:3002');
  app.enableCors({
    origin: corsOrigins.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', '/api');
  app.setGlobalPrefix(apiPrefix.replace(/^\//, ''));

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert primitive types
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger documentation
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Telescope API')
      .setDescription('People Management Platform API Documentation')
      .setVersion('2.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management endpoints')
      .addTag('Employees', 'Employee management endpoints')
      .addTag('Departments', 'Department management endpoints')
      .addTag('Teams', 'Team management endpoints')
      .addTag('Projects', 'Project management endpoints')
      .addTag('Skills', 'Skill management endpoints')
      .addTag('Vacations', 'Vacation management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // Start server
  const port = configService.get<number>('PORT', 9999);
  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📚 API available at http://localhost:${port}${apiPrefix}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();

