# Docker Cleanup Guide

## Проблема
Docker накапливает промежуточные образы, build cache, и неиспользуемые volumes при каждой сборке, что может забивать диск.

## Быстрые решения

### 1. Автоматическая очистка (безопасная)
Удаляет только старые (>24ч) неиспользуемые данные:
```bash
./scripts/docker-cleanup.sh
```

### 2. Полная очистка (агрессивная)
⚠️ ВНИМАНИЕ: Удалит ВСЕ неиспользуемые образы, volumes, и build cache!
```bash
docker system prune -a --volumes
```

### 3. Проверить использование диска
```bash
docker system df
```

## Регулярная очистка по частям

### Удалить остановленные контейнеры
```bash
docker container prune
```

### Удалить неиспользуемые образы
```bash
docker image prune -a
```

### Очистить build cache
```bash
docker builder prune
```

### Удалить неиспользуемые volumes
```bash
docker volume prune
```

## Оптимизация для экономии места

### .dockerignore
Все сервисы теперь имеют `.dockerignore` файлы, которые исключают:
- `node_modules` - не копировать в образ (устанавливаются внутри)
- `dist` - не копировать старую сборку
- `.git`, `.env`, логи - не нужны в образе

### Multi-stage builds
Все Dockerfiles используют multi-stage builds, что уменьшает финальный размер образа.

## Рекомендации

1. **Запускайте очистку регулярно** (раз в неделю):
   ```bash
   ./scripts/docker-cleanup.sh
   ```

2. **При разработке** используйте:
   ```bash
   docker compose up --build  # Пересобрать только изменённые сервисы
   ```
   Вместо:
   ```bash
   docker compose build       # Собрать все сервисы
   ```

3. **Мониторьте диск**:
   ```bash
   docker system df -v        # Подробная информация
   ```

4. **Удаляйте старые образы вручную**:
   ```bash
   docker images | grep dungeonland
   docker rmi <image-id>
   ```

## Размеры образов

Примерные размеры для каждого сервиса:
- Builder stage: ~500-700 MB (промежуточный, удаляется)
- Final stage: ~200-300 MB (остаётся)

При 10 сервисах:
- Все билды: ~2-3 GB
- Все финальные образы: ~2-3 GB
- Build cache: ~1-2 GB

**Итого**: 5-8 GB для всего проекта (нормально для Docker)

## Автоматизация

Добавьте в crontab для автоматической еженедельной очистки:
```bash
crontab -e
# Добавьте строку:
0 3 * * 0 cd /home/user/dungeonland-backend && ./scripts/docker-cleanup.sh
```
