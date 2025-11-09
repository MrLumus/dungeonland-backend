import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.REFERENCE_DB_HOST || 'localhost',
  port: process.env.REFERENCE_DB_PORT ? Number(process.env.REFERENCE_DB_PORT) : 5432,
  username: process.env.REFERENCE_DB_USER || 'postgres',
  password: process.env.REFERENCE_DB_PASSWORD || 'postgres',
  database: process.env.REFERENCE_DB_NAME || 'dungeonland_reference',
  url: process.env.DATABASE_URL || undefined,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};

export default config;
