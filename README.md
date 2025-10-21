# DungeonLand Backend

This project scaffold includes:

- TypeORM DataSource at `src/data-source.ts`
- Entities and initial migration at `src/migrations/1691580000000-InitSchema.ts`
- Auth (register/login) with JWT
- Characters module with related entities

## Setup

1. Copy `.env.example` to `.env` and fill DB credentials (use your Supabase DB host/password)
2. Install deps: `npm install`
3. Run migrations: `npm run migration:run`
4. Start dev server: `npm run start:dev`

Notes:

- The migration file includes `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` which requires that your DB user has permission to create extensions (Supabase supports pgcrypto/uuid-ossp).
- In Supabase, run the migration or ensure extensions are available.

## Команды

nest g <module|service|controller> <path|name> - генерация модуля/сервиса/контроллера
npm run migration:generate - генерация миграции (править название в package.json)
npm run migration:run - запуск миграции
npm run start:dev - запуск сервера в dev режиме
