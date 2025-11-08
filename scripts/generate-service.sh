#!/bin/bash

# Microservice Generator Script
# Generates base structure for Characters domain microservices

SERVICE_NAME=$1
PORT=$2
DESCRIPTION=$3

if [ -z "$SERVICE_NAME" ] || [ -z "$PORT" ] || [ -z "$DESCRIPTION" ]; then
  echo "Usage: $0 <service-name> <port> <description>"
  exit 1
fi

SERVICE_DIR="/home/user/dungeonland-backend/services/${SERVICE_NAME}"

# Create package.json
cat > "${SERVICE_DIR}/package.json" <<EOF
{
  "name": "dungeonland-${SERVICE_NAME}",
  "version": "1.0.0",
  "description": "${DESCRIPTION}",
  "scripts": {
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "build": "tsc -p tsconfig.build.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.4.2",
    "@nestjs/typeorm": "^10.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "dotenv": "^16.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "pg": "^8.10.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0",
    "swagger-ui-express": "^5.0.1",
    "typeorm": "^0.3.17"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^3.0.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  }
}
EOF

# Create tsconfig.json
cat > "${SERVICE_DIR}/tsconfig.json" <<EOF
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Create tsconfig.build.json
cat > "${SERVICE_DIR}/tsconfig.build.json" <<EOF
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
EOF

# Create Dockerfile
cat > "${SERVICE_DIR}/Dockerfile" <<EOF
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]
EOF

# Create .env.example
cat > "${SERVICE_DIR}/.env.example" <<EOF
PORT=${PORT}
CHARACTERS_DB_HOST=localhost
CHARACTERS_DB_PORT=5432
CHARACTERS_DB_USER=postgres
CHARACTERS_DB_PASSWORD=postgres
CHARACTERS_DB_NAME=dungeonland_characters
DATABASE_SSL=false
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=*
EOF

# Create .gitignore
cat > "${SERVICE_DIR}/.gitignore" <<EOF
node_modules
dist
.env
*.log
.DS_Store
EOF

echo "Generated base structure for ${SERVICE_NAME} on port ${PORT}"
