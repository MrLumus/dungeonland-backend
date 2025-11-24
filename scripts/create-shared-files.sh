#!/bin/bash

# Create shared files for all Characters domain services

SERVICES=("health-service" "level-service" "speed-service" "armour-service" "stats-service" "personality-service" "note-service" "reference-service")

for SERVICE in "${SERVICES[@]}"; do
  SERVICE_DIR="/home/user/dungeonland-backend/services/${SERVICE}"

  # Create ormconfig.ts
  cat > "${SERVICE_DIR}/src/infrastructure/config/ormconfig.ts" <<'EOF'
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.CHARACTERS_DB_HOST || 'localhost',
  port: process.env.CHARACTERS_DB_PORT ? Number(process.env.CHARACTERS_DB_PORT) : 5432,
  username: process.env.CHARACTERS_DB_USER || 'postgres',
  password: process.env.CHARACTERS_DB_PASSWORD || 'postgres',
  database: process.env.CHARACTERS_DB_NAME || 'dungeonland_characters',
  url: process.env.DATABASE_URL || undefined,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};

export default config;
EOF

  # Create JWT Strategy
  cat > "${SERVICE_DIR}/src/infrastructure/auth/jwt.strategy.ts" <<'EOF'
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_this_to_a_secure_value',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
EOF

  # Create index file for auth
  cat > "${SERVICE_DIR}/src/infrastructure/auth/index.ts" <<'EOF'
export { JwtStrategy } from './jwt.strategy';
EOF

  echo "Created shared files for ${SERVICE}"
done

echo "All shared files created successfully!"
