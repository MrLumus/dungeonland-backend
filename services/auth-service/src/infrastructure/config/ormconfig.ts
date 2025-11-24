import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.AUTH_DB_HOST || 'localhost',
  port: process.env.AUTH_DB_PORT ? Number(process.env.AUTH_DB_PORT) : 5432,
  username: process.env.AUTH_DB_USER || 'postgres',
  password: process.env.AUTH_DB_PASSWORD || 'postgres',
  database: process.env.AUTH_DB_NAME || 'dungeonland_auth',
  url: process.env.DATABASE_URL || undefined,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: true, // Auto-create tables (use migrations in production!)
  migrationsRun: false,
  logging: true,
};

export default config;
