# DungeonLand Backend - Microservices Architecture

Бэкенд для DungeonLand, построенный на микросервисной архитектуре (MSA) с применением Domain-Driven Design (DDD).

## 🏗️ Архитектура

Проект разделен на два независимых микросервиса:

### 1. **Auth Service** (порт 3001)
- **Ответственность**: Аутентификация и управление пользователями
- **База данных**: `dungeonland_auth` (порт 5433)
- **Основные функции**:
  - Регистрация пользователей
  - Вход в систему (логин)
  - Генерация JWT токенов
  - Управление пользователями

### 2. **Characters Service** (порт 3002)
- **Ответственность**: Управление персонажами
- **База данных**: `dungeonland_characters` (порт 5434)
- **Основные функции**:
  - Создание, чтение, обновление и удаление персонажей
  - Управление инвентарем, атаками и заклинаниями
  - Связь с пользователями через userId (без FK к Auth DB)

## 📁 Структура проекта

```
dungeonland-backend/
├── services/
│   ├── auth-service/              # Auth микросервис
│   │   ├── src/
│   │   │   ├── domain/           # Domain layer (entities)
│   │   │   ├── application/      # Application layer (services, DTOs)
│   │   │   ├── infrastructure/   # Infrastructure (DB config, auth)
│   │   │   ├── presentation/     # Presentation layer (controllers, modules)
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── characters-service/        # Characters микросервис
│       ├── src/
│       │   ├── domain/           # Domain layer (entities)
│       │   ├── application/      # Application layer (services, DTOs)
│       │   ├── infrastructure/   # Infrastructure (DB config, auth)
│       │   ├── presentation/     # Presentation layer (controllers, modules)
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── docker-compose.yml            # Оркестрация всех сервисов
└── README.md
```

## 🚀 Быстрый старт

### Вариант 1: Docker Compose (Рекомендуется)

Самый простой способ запустить все сервисы и базы данных:

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes (БД будут очищены)
docker-compose down -v
```

После запуска сервисы будут доступны:
- **Auth Service**: http://localhost:3001
- **Auth Service API Docs**: http://localhost:3001/api-docs
- **Characters Service**: http://localhost:3002
- **Characters Service API Docs**: http://localhost:3002/api-docs

### Вариант 2: Локальная разработка

Для разработки отдельных сервисов:

#### Auth Service

```bash
cd services/auth-service

# Установка зависимостей
npm install

# Копирование .env
cp .env.example .env
# Отредактируйте .env с настройками БД

# Запуск миграций
npm run migration:run

# Запуск в dev режиме
npm run start:dev
```

#### Characters Service

```bash
cd services/characters-service

# Установка зависимостей
npm install

# Копирование .env
cp .env.example .env
# Отредактируйте .env с настройками БД

# Запуск миграций
npm run migration:run

# Запуск в dev режиме
npm run start:dev
```

## 🗄️ База данных

Каждый сервис имеет собственную базу данных:

| Сервис | База данных | Порт (Docker) | Порт (Local) |
|--------|-------------|---------------|--------------|
| Auth | dungeonland_auth | 5433 | 5432 |
| Characters | dungeonland_characters | 5434 | 5432 |

### Миграции

Каждый сервис управляет своими миграциями независимо:

```bash
# Auth Service
cd services/auth-service
npm run migration:generate -- -n MigrationName
npm run migration:run

# Characters Service
cd services/characters-service
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## 🔑 Аутентификация

1. **Регистрация пользователя** (Auth Service):
```bash
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Player One"
}
```

2. **Вход** (Auth Service):
```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Ответ содержит `accessToken` и `userId`.

3. **Использование токена** (Characters Service):
```bash
GET http://localhost:3002/characters
Authorization: Bearer <accessToken>
```

## 📚 API Документация

Каждый сервис имеет Swagger UI документацию:

- **Auth Service**: http://localhost:3001/api-docs
- **Characters Service**: http://localhost:3002/api-docs

## 🏛️ DDD (Domain-Driven Design) структура

Каждый сервис следует чистой архитектуре:

### Domain Layer (`src/domain/`)
- **Entities**: Доменные сущности (User, Character)
- **Repositories**: Интерфейсы репозиториев (опционально)

### Application Layer (`src/application/`)
- **Services**: Бизнес-логика приложения
- **DTOs**: Data Transfer Objects для валидации

### Infrastructure Layer (`src/infrastructure/`)
- **Database**: Конфигурация БД, миграции
- **Auth**: JWT стратегии, guards
- **Config**: Конфигурационные файлы

### Presentation Layer (`src/presentation/`)
- **Controllers**: HTTP контроллеры
- **Modules**: NestJS модули

## 🔧 Переменные окружения

### Auth Service (.env)
```env
PORT=3001
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5432
AUTH_DB_USER=postgres
AUTH_DB_PASSWORD=postgres
AUTH_DB_NAME=dungeonland_auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Characters Service (.env)
```env
PORT=3002
CHARACTERS_DB_HOST=localhost
CHARACTERS_DB_PORT=5432
CHARACTERS_DB_USER=postgres
CHARACTERS_DB_PASSWORD=postgres
CHARACTERS_DB_NAME=dungeonland_characters
AUTH_SERVICE_URL=http://localhost:3001
JWT_SECRET=your-secret-key  # Должен совпадать с Auth Service!
```

## 🛠️ Команды разработки

```bash
# Генерация миграции
npm run migration:generate -- -n MigrationName

# Запуск миграций
npm run migration:run

# Запуск в dev режиме
npm run start:dev

# Сборка проекта
npm run build

# Запуск production версии
npm start
```

## 🔄 Межсервисная коммуникация

В текущей версии сервисы независимы:
- **Auth Service** управляет пользователями и выдает JWT токены
- **Characters Service** валидирует JWT токены и хранит userId как строку

В будущем можно добавить:
- REST API вызовы между сервисами
- Message broker (RabbitMQ, Kafka)
- gRPC для синхронной коммуникации

## 📊 Мониторинг

Логи сервисов в Docker:
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f auth-service
docker-compose logs -f characters-service
```

## 🧪 Тестирование

Пример запросов для тестирования:

### 1. Регистрация
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","displayName":"Test User"}'
```

### 2. Вход
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 3. Создание персонажа
```bash
curl -X POST http://localhost:3002/characters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"Гендальф","race":"Человек","class":"Волшебник"}'
```

## 🚧 Roadmap

- [ ] Добавить остальные модули персонажей (stats, health, armour и т.д.)
- [ ] Реализовать Event-driven коммуникацию между сервисами
- [ ] Добавить API Gateway
- [ ] Настроить CI/CD
- [ ] Добавить unit и integration тесты
- [ ] Настроить мониторинг (Prometheus, Grafana)
- [ ] Добавить rate limiting
- [ ] Реализовать кеширование (Redis)

## 📝 Миграция из монолита

Старая монолитная версия находится в папке `src/`. Новая MSA архитектура находится в `services/`.

Основные изменения:
- ✅ Разделение на независимые сервисы
- ✅ Отдельные БД для каждого домена
- ✅ DDD структура в каждом сервисе
- ✅ Независимая разработка и деплой
- ✅ Docker контейнеризация

## 📄 Лицензия

MIT
