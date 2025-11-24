# DungeonLand Backend - Full Microservices Architecture

Полная MSA DDD архитектура с 10 независимыми микросервисами и 2 доменными базами данных.

## 🏗️ Архитектура

### Auth Domain (AuthDB - порт 5433)
- **auth-service** (3001) - Аутентификация и управление пользователями

### Characters Domain (CharactersDB - порт 5434)
Все сервисы используют общую БД CharactersDB, но работают независимо:

- **characters-service** (3002) - Управление персонажами (основной)
- **health-service** (3003) - Здоровье персонажей
- **level-service** (3004) - Уровни и опыт
- **speed-service** (3005) - Скорость персонажей
- **armour-service** (3006) - Броня персонажей  
- **stats-service** (3007) - Характеристики и навыки
- **personality-service** (3008) - Личность персонажей
- **note-service** (3009) - Заметки персонажей
- **reference-service** (3010) - Справочники (stats, skills)

## 🚀 Быстрый старт

```bash
# Запустить все 10 сервисов + 2 БД
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## 📊 API Documentation

Каждый сервис имеет Swagger UI:
- Auth: http://localhost:3001/api-docs
- Characters: http://localhost:3002/api-docs
- Health: http://localhost:3003/api-docs
- Level: http://localhost:3004/api-docs
- Speed: http://localhost:3005/api-docs
- Armour: http://localhost:3006/api-docs
- Stats: http://localhost:3007/api-docs
- Personality: http://localhost:3008/api-docs
- Notes: http://localhost:3009/api-docs
- References: http://localhost:3010/api-docs

## 🏛️ DDD Structure

Каждый сервис следует DDD принципам:

```
service/
├── src/
│   ├── domain/           # Entities, Value Objects
│   ├── application/      # Services, DTOs, Use Cases
│   ├── infrastructure/   # DB config, External services
│   └── presentation/     # Controllers, Modules
```

## 🔑 Аутентификация

1. Регистрация/Вход через auth-service (3001)
2. Получение JWT токена
3. Использование токена для доступа к остальным сервисам

## 📁 Структура проекта

```
dungeonland-backend/
├── services/
│   ├── auth-service/         # Auth domain
│   ├── characters-service/   # Characters domain
│   ├── health-service/       # Characters domain  
│   ├── level-service/        # Characters domain
│   ├── speed-service/        # Characters domain
│   ├── armour-service/       # Characters domain
│   ├── stats-service/        # Characters domain
│   ├── personality-service/  # Characters domain
│   ├── note-service/         # Characters domain
│   └── reference-service/    # Characters domain
├── scripts/                  # Generation scripts
├── docker-compose.yml        # Orchestration
└── README.md
```

## 🛠️ Development

### Local Development

```bash
cd services/<service-name>
npm install
npm run start:dev
```

### Database Migration

Автоматическая синхронизация включена (`synchronize: true`).  
Для production используйте миграции.

## 🔒 Security

- JWT аутентификация
- CORS настройки
- Database per domain pattern
- Независимая масштабируемость

## 📝 Принципы архитектуры

- ✅ **Microservices** - каждый модуль = отдельный сервис
- ✅ **DDD** - четкое разделение слоев
- ✅ **Database per Domain** - AuthDB и CharactersDB
- ✅ **Shared Database within Domain** - сервисы Characters используют общую БД
- ✅ **Independent Deployment** - каждый сервис деплоится отдельно
- ✅ **Docker Ready** - полная контейнеризация

## 🚧 Roadmap

- [ ] API Gateway
- [ ] Service Discovery  
- [ ] Message Broker (RabbitMQ/Kafka)
- [ ] Distributed Tracing
- [ ] Monitoring (Prometheus/Grafana)
- [ ] CI/CD Pipeline

## 📄 License

MIT
