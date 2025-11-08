import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.CHARACTERS_DB_HOST || 'localhost',
  port: process.env.CHARACTERS_DB_PORT ? Number(process.env.CHARACTERS_DB_PORT) : 5432,
  username: process.env.CHARACTERS_DB_USER || 'postgres',
  password: process.env.CHARACTERS_DB_PASSWORD || 'postgres',
  database: process.env.CHARACTERS_DB_NAME || 'dungeonland_characters',
  url: process.env.DATABASE_URL || undefined,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
};

export default config;
