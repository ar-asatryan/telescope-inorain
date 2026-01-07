import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the server root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'telescope',
  password: process.env.DB_PASSWORD || 'telescope123',
  database: process.env.DB_DATABASE || 'telescope_db',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [],
};

export const AppDataSource = new DataSource(options);

