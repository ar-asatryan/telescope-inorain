import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.host', 'localhost'),
  port: configService.get<number>('database.port', 5432),
  username: configService.get<string>('database.username', 'telescope'),
  password: configService.get<string>('database.password', 'telescope123'),
  database: configService.get<string>('database.database', 'telescope_db'),
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: configService.get<boolean>('database.synchronize', false),
  logging: configService.get<boolean>('database.logging', false),
  
  // Connection pool settings for optimization
  extra: {
    // Maximum number of clients in the pool
    max: 20,
    // Minimum number of clients in the pool
    min: 5,
    // Connection timeout in milliseconds
    connectionTimeoutMillis: 10000,
    // Idle timeout in milliseconds
    idleTimeoutMillis: 30000,
  },

  // Cache settings for query optimization
  cache: {
    duration: 60000, // 1 minute cache
  },
});

