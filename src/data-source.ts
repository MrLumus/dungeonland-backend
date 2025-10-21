import "tsconfig-paths/register";
import "dotenv/config";
import { DataSource } from "typeorm";

const databaseUrl = process.env.DATABASE_URL?.trim();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl || undefined,

  // Только если DATABASE_URL не задан — взять по частям
  host: databaseUrl ? undefined : process.env.DB_HOST,
  port: databaseUrl ? undefined : Number(process.env.DB_PORT || 6543),
  username: databaseUrl ? undefined : process.env.DB_USER,
  password: databaseUrl ? undefined : process.env.DB_PASSWORD,
  database: databaseUrl ? undefined : process.env.DB_NAME,

  // Supabase требует SSL; включаем по флагу (по умолчанию true)
  ssl:
    process.env.DATABASE_SSL === "true" || !!process.env.DATABASE_URL
      ? { rejectUnauthorized: false }
      : false,

  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  synchronize: false,
});
