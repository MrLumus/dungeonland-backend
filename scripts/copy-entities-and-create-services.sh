#!/bin/bash

# Copy entities from original code and create full microservice structure

BASE_DIR="/home/user/dungeonland-backend"
SRC_DIR="${BASE_DIR}/src/modules/character/modules"
SERVICES_DIR="${BASE_DIR}/services"

# Health Service
echo "Creating Health Service..."
SERVICE="health-service"
cp -r "${SRC_DIR}/health/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"

# Level Service
echo "Creating Level Service..."
SERVICE="level-service"
cp -r "${SRC_DIR}/level/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"
cp -r "${SRC_DIR}/level/constants" "${SERVICES_DIR}/${SERVICE}/src/domain/"

# Speed Service
echo "Creating Speed Service..."
SERVICE="speed-service"
cp -r "${SRC_DIR}/speed/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"

# Armour Service
echo "Creating Armour Service..."
SERVICE="armour-service"
cp -r "${SRC_DIR}/armour/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"

# Stats Service
echo "Creating Stats Service..."
SERVICE="stats-service"
cp -r "${SRC_DIR}/stats/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"

# Personality Service
echo "Creating Personality Service..."
SERVICE="personality-service"
cp -r "${SRC_DIR}/personality/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"

# Note Service
echo "Creating Note Service..."
SERVICE="note-service"
cp -r "${SRC_DIR}/note/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"

# Reference Service (from different location)
echo "Creating Reference Service..."
SERVICE="reference-service"
cp -r "${BASE_DIR}/src/modules/reference/entities/"* "${SERVICES_DIR}/${SERVICE}/src/domain/entities/"
cp -r "${BASE_DIR}/src/modules/reference/dto" "${SERVICES_DIR}/${SERVICE}/src/application/"

echo "All entities copied successfully!"
