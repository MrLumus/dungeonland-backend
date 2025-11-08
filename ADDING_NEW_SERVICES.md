# Добавление новых микросервисов

## Быстрый старт

Используйте автоматический генератор для создания нового микросервиса с полной DDD структурой:

```bash
python3 scripts/generate-microservice.py <service-name> <port> [domain]
```

### Примеры:

```bash
# Новый сервис в Characters домене
python3 scripts/generate-microservice.py inventory 3011

# Новый сервис в Auth домене
python3 scripts/generate-microservice.py permissions 3012 auth
```

## Что генерируется автоматически

### 1. DDD Structure (4 слоя)

```
services/<service-name>-service/
├── src/
│   ├── domain/
│   │   ├── entities/          # Entity, Value Objects
│   │   │   ├── <service>.entity.ts
│   │   │   └── index.ts
│   │   └── constants/         # Domain constants
│   ├── application/
│   │   ├── services/          # Business logic
│   │   │   ├── <service>.service.ts
│   │   │   └── index.ts
│   │   └── dto/               # Data Transfer Objects
│   │       └── index.ts
│   ├── infrastructure/
│   │   ├── config/
│   │   │   └── ormconfig.ts
│   │   └── auth/
│   │       ├── jwt.strategy.ts
│   │       └── index.ts
│   └── presentation/
│       ├── controllers/        # REST Controllers
│       │   ├── <service>.controller.ts
│       │   └── index.ts
│       └── modules/           # NestJS Modules
│           └── <service>.module.ts
├── Dockerfile
├── .dockerignore
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

### 2. Базовые CRUD операции

Генерируется полноценный сервис с:
- ✅ Entity с базовыми полями
- ✅ Service с CRUD методами (create, findByCharacter, findOne, update, delete)
- ✅ Controller с REST endpoints (POST, GET, PATCH, DELETE)
- ✅ Module с настроенными зависимостями
- ✅ JWT аутентификация
- ✅ Swagger документация
- ✅ TypeORM интеграция
- ✅ Dockerfile для контейнеризации

## Пошаговая инструкция

### Шаг 1: Сгенерировать сервис

```bash
cd /home/user/dungeonland-backend
python3 scripts/generate-microservice.py inventory 3011
```

**Вывод:**
```
🚀 Generating microservice: Inventory
   Port: 3011
   Domain: characters
   Path: /home/user/dungeonland-backend/services/inventory-service
✓ Created directory structure
✓ Generated entity: Inventory
✓ Generated service: InventoryService
✓ Generated controller: InventoryController
✓ Generated module: InventoryModule
...
✅ Microservice 'Inventory' generated successfully!
```

### Шаг 2: Кастомизировать Entity

Откройте `services/inventory-service/src/domain/entities/inventory.entity.ts` и добавьте свои поля:

```typescript
@Entity("inventory")
export class Inventory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'uuid' })
  characterId: string;

  // Ваши поля:
  @Column()
  itemName: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: 0 })
  weight: number;
}
```

### Шаг 3: Обновить DTO

Откройте `services/inventory-service/src/application/dto/index.ts`:

```typescript
export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;
}
```

### Шаг 4: Добавить в docker-compose.yml

```yaml
  inventory-service:
    build:
      context: ./services/inventory-service
      dockerfile: Dockerfile
    container_name: dungeonland-inventory-service
    environment:
      PORT: 3011
      CHARACTERS_DB_HOST: characters-db
      CHARACTERS_DB_PORT: 5432
      CHARACTERS_DB_USER: postgres
      CHARACTERS_DB_PASSWORD: postgres
      CHARACTERS_DB_NAME: dungeonland_characters
      DATABASE_SSL: "false"
      JWT_SECRET: your-super-secret-jwt-key-change-in-production
      CORS_ORIGIN: "*"
    ports:
      - "3011:3011"
    depends_on:
      characters-db:
        condition: service_healthy
      auth-service:
        condition: service_started
    networks:
      - dungeonland-network
    restart: unless-stopped
```

### Шаг 5: Собрать и запустить

```bash
# Установить зависимости (опционально, если хотите разрабатывать локально)
cd services/inventory-service
npm install

# Собрать Docker образ
cd ../..
docker compose build inventory-service

# Запустить сервис
docker compose up inventory-service
```

### Шаг 6: Проверить

```bash
# API документация
http://localhost:3011/api-docs

# Пример запроса
curl http://localhost:3011/characters/{characterId}/inventory \
  -H "Authorization: Bearer <token>"
```

## Добавление в Characters Service (агрегация)

Если хотите чтобы новый сервис возвращался при `GET /characters/{id}`:

### 1. Добавить в MicroservicesClientService

`services/characters-service/src/infrastructure/http/microservices-client.service.ts`:

```typescript
private readonly INVENTORY_SERVICE = process.env.INVENTORY_SERVICE_URL || "http://inventory-service:3011";

// В createRelatedEntities добавить:
await Promise.allSettled([
  // ...существующие
  this.createInventory(characterId, userId, headers),
]);

// В getCharacterCompleteData добавить:
const [health, level, /* ... */, inventory] = await Promise.allSettled([
  // ...существующие
  this.getInventory(characterId, userId, headers),
]);

return {
  // ...
  inventory: inventory.status === 'fulfilled' ? inventory.value : [],
};

// Добавить методы:
private async createInventory(characterId: string, userId: string, headers: any): Promise<void> {
  const url = `${this.INVENTORY_SERVICE}/characters/${characterId}/inventory`;
  await firstValueFrom(this.httpService.post(url, {}, { headers }));
}

private async getInventory(characterId: string, userId: string, headers: any): Promise<any> {
  const url = `${this.INVENTORY_SERVICE}/characters/${characterId}/inventory`;
  const response = await firstValueFrom(this.httpService.get(url, { headers }));
  return response.data;
}
```

## Структура REST API

Сгенерированный сервис автоматически имеет следующие endpoints:

```
POST   /characters/:characterId/inventory      - Создать
GET    /characters/:characterId/inventory      - Получить для персонажа
GET    /characters/:characterId/inventory/:id  - Получить по ID
PATCH  /characters/:characterId/inventory/:id  - Обновить
DELETE /characters/:characterId/inventory/:id  - Удалить
```

## Параметры генератора

```bash
python3 scripts/generate-microservice.py <service-name> <port> [domain]
```

**service-name** (обязательно):
- Название сервиса (lowercase)
- Примеры: inventory, quests, achievements

**port** (обязательно):
- Порт для сервиса
- Примеры: 3011, 3012, 3013
- Следующий свободный порт: 3011

**domain** (опционально, по умолчанию "characters"):
- Домен к которому относится сервис
- Варианты: `characters` или `auth`
- Определяет какую БД использовать:
  - `characters` → characters-db (port 5434)
  - `auth` → auth-db (port 5433)

## Примеры использования

### OneToOne сервис (как Health, Level, Speed)

```bash
python3 scripts/generate-microservice.py experience 3011
```

Затем в сервисе измените `findByCharacter` чтобы возвращал один объект:

```typescript
async findByCharacter(userId: string, characterId: string) {
  const item = await this.repository.findOne({
    where: { characterId }
  });
  return item; // один объект, не массив
}
```

### OneToMany сервис (как Notes, Attacks, Spells)

```bash
python3 scripts/generate-microservice.py quests 3012
```

Оставьте `findByCharacter` как есть (возвращает массив).

### Сервис с reference data (как Stats)

```bash
python3 scripts/generate-microservice.py achievements 3013
```

Добавьте обогащение данными из reference-service в методе `findByCharacter`.

## Часто задаваемые вопросы

**Q: Нужно ли вручную создавать таблицы в БД?**
A: Нет, TypeORM создаст таблицы автоматически (synchronize: true). В продакшене нужно использовать миграции.

**Q: Как добавить relations между entities?**
A: В микросервисной архитектуре избегайте foreign keys между сервисами. Используйте только ID для связи.

**Q: Можно ли использовать Nest CLI?**
A: Да, для добавления новых элементов ВНУТРИ сервиса:
```bash
cd services/inventory-service
nest g service domain/value-objects/item
```

**Q: Как добавить зависимость от другого сервиса?**
A: Используйте HttpModule и делайте HTTP запросы, как в characters-service → stats-service.

**Q: Порты заканчиваются, что делать?**
A: Используйте любые свободные порты, например 3100+, 4000+, 5000+.

## Checklist для нового сервиса

- [ ] Сгенерирован через `generate-microservice.py`
- [ ] Обновлена Entity с нужными полями
- [ ] Обновлены DTOs
- [ ] Добавлен в `docker-compose.yml`
- [ ] Собран образ (`docker compose build`)
- [ ] Запущен и протестирован (`docker compose up`)
- [ ] Добавлен в characters-service для агрегации (если нужно)
- [ ] Проверена Swagger документация
- [ ] Созданы тесты (опционально)

## Полезные команды

```bash
# Проверить структуру проекта
tree services/inventory-service/src

# Установить зависимости
cd services/inventory-service && npm install

# Локальная разработка
npm run start:dev

# Собрать TypeScript
npm run build

# Проверить логи
docker logs dungeonland-inventory-service -f

# Перезапустить один сервис
docker compose restart inventory-service

# Пересобрать и перезапустить
docker compose up --build inventory-service
```

## Альтернатива: Nest CLI

Если генератор не подходит, можно использовать Nest CLI вручную:

```bash
# Создать новый NestJS проект
nest new inventory-service

# Переместить в services/
mv inventory-service services/

# Добавить DDD структуру вручную
cd services/inventory-service
mkdir -p src/{domain,application,infrastructure,presentation}/{entities,services,controllers,modules}

# Генерировать элементы
nest g module presentation/modules/inventory
nest g controller presentation/controllers/inventory
nest g service application/services/inventory
```

Но генератор Python гораздо быстрее и создает правильную DDD структуру сразу!
