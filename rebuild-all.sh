#!/bin/bash

# Скрипт для полной пересборки всех сервисов
# Использовать когда Docker cache поврежден или после обновления зависимостей

set -e

echo "========================================="
echo "Полная пересборка всех сервисов"
echo "========================================="
echo ""

echo "1. Останавливаем все контейнеры..."
docker-compose down

echo ""
echo "2. Удаляем старые образы проекта..."
docker images | grep dungeonland | awk '{print $3}' | xargs -r docker rmi -f || true

echo ""
echo "3. Очищаем build cache..."
docker builder prune -f

echo ""
echo "4. Очищаем системный кэш..."
docker system prune -f

echo ""
echo "5. Пересобираем ВСЕ сервисы БЕЗ кэша..."
docker-compose build --no-cache

echo ""
echo "6. Запускаем все сервисы..."
docker-compose up -d

echo ""
echo "========================================="
echo "Пересборка завершена!"
echo "========================================="
echo ""
echo "Проверьте логи сервисов:"
echo "  docker-compose logs -f equipment-service"
echo "  docker-compose logs -f reference-service"
echo ""
echo "Проверьте статус:"
echo "  docker-compose ps"
