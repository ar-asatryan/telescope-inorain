import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

// Configuration
import configuration from './config/configuration';
import { typeOrmConfig } from './database/typeorm.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SkillsModule } from './modules/skills/skills.module';
import { VacationsModule } from './modules/vacations/vacations.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Winston Logger
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: configService.get('NODE_ENV') === 'development' ? 'debug' : 'info',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.colorize({ all: true }),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
          }),
        ),
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/all.log',
          }),
        ],
      }),
      inject: [ConfigService],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL', 60) * 1000,
            limit: configService.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    EmployeesModule,
    DepartmentsModule,
    TeamsModule,
    ProjectsModule,
    SkillsModule,
    VacationsModule,
    HealthModule,
  ],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Add any global middleware here if needed
  }
}

