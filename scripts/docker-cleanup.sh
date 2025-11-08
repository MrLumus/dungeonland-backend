#!/bin/bash
# Docker cleanup script - removes unused images, containers, volumes, and build cache

echo "🧹 Docker Cleanup Script"
echo "======================="

# Show current disk usage
echo -e "\n📊 Current Docker disk usage:"
docker system df

echo -e "\n🗑️  Cleaning up..."

# Remove stopped containers
echo "1. Removing stopped containers..."
docker container prune -f

# Remove dangling images (intermediate build stages)
echo "2. Removing dangling images..."
docker image prune -f

# Remove unused images
echo "3. Removing unused images..."
docker image prune -a -f --filter "until=24h"

# Remove build cache older than 24h
echo "4. Removing old build cache..."
docker builder prune -f --filter "until=24h"

# Remove unused volumes
echo "5. Removing unused volumes..."
docker volume prune -f

echo -e "\n✅ Cleanup complete!"
echo -e "\n📊 Disk usage after cleanup:"
docker system df

echo -e "\n💡 To remove ALL unused data (not just old), run:"
echo "   docker system prune -a --volumes"
