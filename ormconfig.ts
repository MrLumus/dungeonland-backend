
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.SUPABASE_DB_HOST || undefined,
  port: process.env.SUPABASE_DB_PORT ? Number(process.env.SUPABASE_DB_PORT) : 5432,
  username: process.env.SUPABASE_DB_USER || undefined,
  password: process.env.SUPABASE_DB_PASSWORD || undefined,
  database: process.env.SUPABASE_DB_NAME || undefined,
  url: process.env.DATABASE_URL || undefined,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
};
export default config;
