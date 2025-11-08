#!/usr/bin/env python3
"""
Universal DDD Microservice Generator
Generates a new microservice with full DDD structure
"""

import os
import sys
import re

def generate_microservice(service_name: str, port: int, domain: str = "characters"):
    """
    Generate a complete DDD microservice

    Args:
        service_name: Name of the service (e.g., 'inventory')
        port: Port number (e.g., 3011)
        domain: Domain name ('auth' or 'characters')
    """

    # Normalize names
    service_pascal = service_name.capitalize()
    service_kebab = service_name.lower()

    base_path = f"/home/user/dungeonland-backend/services/{service_kebab}-service"

    print(f"\n🚀 Generating microservice: {service_pascal}")
    print(f"   Port: {port}")
    print(f"   Domain: {domain}")
    print(f"   Path: {base_path}")

    # Create directory structure
    dirs = [
        f"{base_path}/src/domain/entities",
        f"{base_path}/src/domain/constants",
        f"{base_path}/src/application/services",
        f"{base_path}/src/application/dto",
        f"{base_path}/src/infrastructure/config",
        f"{base_path}/src/infrastructure/auth",
        f"{base_path}/src/presentation/controllers",
        f"{base_path}/src/presentation/modules",
    ]

    for d in dirs:
        os.makedirs(d, exist_ok=True)

    print("✓ Created directory structure")

    # Generate files
    generate_entity(base_path, service_name)
    generate_service(base_path, service_name)
    generate_controller(base_path, service_name)
    generate_module(base_path, service_name)
    generate_dto(base_path, service_name)
    generate_app_module(base_path)
    generate_main(base_path, service_name, port)
    generate_ormconfig(base_path, domain)
    generate_jwt_strategy(base_path)
    generate_package_json(base_path, service_name)
    generate_tsconfig(base_path)
    generate_dockerfile(base_path)
    generate_dockerignore(base_path)

    print(f"\n✅ Microservice '{service_pascal}' generated successfully!")
    print(f"\nNext steps:")
    print(f"1. Add to docker-compose.yml:")
    print(f"   - Port: {port}")
    print(f"   - Database: {domain}-db")
    print(f"2. Update entity with your fields")
    print(f"3. Run: docker compose build {service_kebab}-service")
    print(f"4. Run: docker compose up {service_kebab}-service")

def generate_entity(base_path, service_name):
    entity = f"""import {{
  Entity,
  PrimaryGeneratedColumn,
  Column,
}} from "typeorm";

@Entity("{service_name.lower()}")
export class {service_name.capitalize()} {{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({{ type: 'uuid' }})
  characterId: string;

  // TODO: Add your entity fields here
  @Column({{ default: "" }})
  name: string;
}}
"""

    with open(f"{base_path}/src/domain/entities/{service_name.lower()}.entity.ts", "w") as f:
        f.write(entity)

    # index.ts
    with open(f"{base_path}/src/domain/entities/index.ts", "w") as f:
        f.write(f'export {{ {service_name.capitalize()} }} from "./{service_name.lower()}.entity";\n')

    print(f"✓ Generated entity: {service_name.capitalize()}")

def generate_service(base_path, service_name):
    service = f"""import {{ Injectable, NotFoundException }} from "@nestjs/common";
import {{ InjectRepository }} from "@nestjs/typeorm";
import {{ Repository }} from "typeorm";
import {{ {service_name.capitalize()} }} from "../../domain/entities";

@Injectable()
export class {service_name.capitalize()}Service {{
  constructor(
    @InjectRepository({service_name.capitalize()})
    private readonly repository: Repository<{service_name.capitalize()}>
  ) {{}}

  async create(userId: string, characterId: string, dto: any) {{
    const item = this.repository.create({{
      ...dto,
      characterId,
    }});
    return this.repository.save(item);
  }}

  async findByCharacter(userId: string, characterId: string) {{
    const item = await this.repository.findOne({{
      where: {{ characterId }}
    }});
    return item;
  }}

  async findOne(userId: string, id: string) {{
    const item = await this.repository.findOne({{
      where: {{ id }}
    }});

    if (!item) {{
      throw new NotFoundException('{service_name.capitalize()} not found');
    }}

    return item;
  }}

  async update(userId: string, id: string, dto: any) {{
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }}

  async delete(userId: string, id: string) {{
    const item = await this.findOne(userId, id);
    await this.repository.remove(item);
  }}
}}
"""

    with open(f"{base_path}/src/application/services/{service_name.lower()}.service.ts", "w") as f:
        f.write(service)

    # index.ts
    with open(f"{base_path}/src/application/services/index.ts", "w") as f:
        f.write(f'export {{ {service_name.capitalize()}Service }} from "./{service_name.lower()}.service";\n')

    print(f"✓ Generated service: {service_name.capitalize()}Service")

def generate_controller(base_path, service_name):
    controller = f"""import {{
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
}} from "@nestjs/common";
import {{ AuthGuard }} from "@nestjs/passport";
import {{ ApiTags, ApiOperation, ApiBearerAuth }} from "@nestjs/swagger";
import {{ {service_name.capitalize()}Service }} from "../../application/services";

@ApiTags("Characters/{service_name.capitalize()}")
@Controller("characters/:characterId/{service_name.lower()}")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class {service_name.capitalize()}Controller {{
  constructor(private readonly service: {service_name.capitalize()}Service) {{}}

  @Post()
  @ApiOperation({{ summary: "Create {service_name.capitalize()} for character" }})
  create(
    @Request() req: any,
    @Param("characterId") characterId: string,
    @Body() dto: any
  ) {{
    return this.service.create(req.user.userId, characterId, dto);
  }}

  @Get()
  @ApiOperation({{ summary: "Get {service_name.lower()} for character" }})
  findAll(@Request() req: any, @Param("characterId") characterId: string) {{
    return this.service.findByCharacter(req.user.userId, characterId);
  }}

  @Get(":id")
  @ApiOperation({{ summary: "Get {service_name.capitalize()} by ID" }})
  findOne(@Request() req: any, @Param("id") id: string) {{
    return this.service.findOne(req.user.userId, id);
  }}

  @Patch(":id")
  @ApiOperation({{ summary: "Update {service_name.capitalize()}" }})
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: any
  ) {{
    return this.service.update(req.user.userId, id, dto);
  }}

  @Delete(":id")
  @ApiOperation({{ summary: "Delete {service_name.capitalize()}" }})
  remove(@Request() req: any, @Param("id") id: string) {{
    return this.service.delete(req.user.userId, id);
  }}
}}
"""

    with open(f"{base_path}/src/presentation/controllers/{service_name.lower()}.controller.ts", "w") as f:
        f.write(controller)

    # index.ts
    with open(f"{base_path}/src/presentation/controllers/index.ts", "w") as f:
        f.write(f'export {{ {service_name.capitalize()}Controller }} from "./{service_name.lower()}.controller";\n')

    print(f"✓ Generated controller: {service_name.capitalize()}Controller")

def generate_module(base_path, service_name):
    module = f"""import {{ Module }} from "@nestjs/common";
import {{ TypeOrmModule }} from "@nestjs/typeorm";
import {{ PassportModule }} from "@nestjs/passport";
import {{ JwtModule }} from "@nestjs/jwt";
import {{ {service_name.capitalize()} }} from "../../domain/entities";
import {{ {service_name.capitalize()}Service }} from "../../application/services";
import {{ {service_name.capitalize()}Controller }} from "../controllers";
import {{ JwtStrategy }} from "../../infrastructure/auth";

@Module({{
  imports: [
    TypeOrmModule.forFeature([{service_name.capitalize()}]),
    PassportModule,
    JwtModule.register({{
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }}),
  ],
  providers: [{service_name.capitalize()}Service, JwtStrategy],
  controllers: [{service_name.capitalize()}Controller],
  exports: [{service_name.capitalize()}Service],
}})
export class {service_name.capitalize()}Module {{}}
"""

    with open(f"{base_path}/src/presentation/modules/{service_name.lower()}.module.ts", "w") as f:
        f.write(module)

    print(f"✓ Generated module: {service_name.capitalize()}Module")

def generate_dto(base_path, service_name):
    dto = f"""import {{ ApiPropertyOptional }} from "@nestjs/swagger";
import {{ IsOptional, IsString }} from "class-validator";

export class Create{service_name.capitalize()}Dto {{
  @ApiPropertyOptional({{ example: "Example", description: "Name" }})
  @IsOptional()
  @IsString()
  name?: string;

  // TODO: Add your DTO fields here
}}

export class Update{service_name.capitalize()}Dto {{
  @ApiPropertyOptional({{ example: "Example", description: "Name" }})
  @IsOptional()
  @IsString()
  name?: string;

  // TODO: Add your DTO fields here
}}
"""

    with open(f"{base_path}/src/application/dto/index.ts", "w") as f:
        f.write(dto)

    print(f"✓ Generated DTOs")

def generate_app_module(base_path):
    content = """import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "./infrastructure/config/ormconfig";
import { """ + service_name.capitalize() + """Module } from "./presentation/modules/""" + service_name.lower() + """.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({ ...(ormconfig as any) }),
    """ + service_name.capitalize() + """Module,
  ],
})
export class AppModule {}
"""
    with open(f"{base_path}/src/app.module.ts", "w") as f:
        f.write(content)

    print(f"✓ Generated app.module.ts")

def generate_main(base_path, service_name, port):
    content = f"""import "reflect-metadata";
import {{ ValidationPipe }} from "@nestjs/common";
import {{ NestFactory }} from "@nestjs/core";
import {{ AppModule }} from "./app.module";
import * as dotenv from "dotenv";
import {{ DocumentBuilder, SwaggerModule }} from "@nestjs/swagger";

dotenv.config();

async function bootstrap() {{
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({{
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }})
  );

  app.enableCors({{
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }});

  const config = new DocumentBuilder()
    .setTitle("DungeonLand {service_name.capitalize()} Service")
    .setDescription("{service_name.capitalize()} management")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT || {port};
  await app.listen(port);

  console.log(`🚀 {service_name.capitalize()} Service is running on http://localhost:${{port}}`);
  console.log(`📚 API Documentation: http://localhost:${{port}}/api-docs`);
}}

bootstrap();
"""
    with open(f"{base_path}/src/main.ts", "w") as f:
        f.write(content)

    print(f"✓ Generated main.ts")

def generate_ormconfig(base_path, domain):
    db_prefix = domain.upper()

    content = f"""import {{ DataSourceOptions }} from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const ormconfig: DataSourceOptions = {{
  type: "postgres",
  host: process.env.{db_prefix}_DB_HOST || "localhost",
  port: parseInt(process.env.{db_prefix}_DB_PORT || "5432"),
  username: process.env.{db_prefix}_DB_USER || "postgres",
  password: process.env.{db_prefix}_DB_PASSWORD || "postgres",
  database: process.env.{db_prefix}_DB_NAME || "dungeonland_{domain}",
  ssl: process.env.DATABASE_SSL === "true",
  synchronize: true, // Set to false in production
  entities: [__dirname + "/../**/*.entity{{.ts,.js}}"],
}};

export default ormconfig;
"""
    with open(f"{base_path}/src/infrastructure/config/ormconfig.ts", "w") as f:
        f.write(content)

    print(f"✓ Generated ormconfig.ts")

def generate_jwt_strategy(base_path):
    content = """import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
"""
    with open(f"{base_path}/src/infrastructure/auth/jwt.strategy.ts", "w") as f:
        f.write(content)

    with open(f"{base_path}/src/infrastructure/auth/index.ts", "w") as f:
        f.write('export { JwtStrategy } from "./jwt.strategy";\n')

    print(f"✓ Generated JWT strategy")

def generate_package_json(base_path, service_name):
    content = f"""{{
  "name": "dungeonland-{service_name.lower()}-service",
  "version": "1.0.0",
  "description": "{service_name.capitalize()} management microservice",
  "scripts": {{
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "build": "tsc -p tsconfig.build.json"
  }},
  "dependencies": {{
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
  }},
  "devDependencies": {{
    "@nestjs/cli": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^3.0.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  }}
}}
"""
    with open(f"{base_path}/package.json", "w") as f:
        f.write(content)

    print(f"✓ Generated package.json")

def generate_tsconfig(base_path):
    tsconfig = """{
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
    "noFallthroughCasesInSwitch": false,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
"""

    tsconfig_build = """{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "**/*spec.ts"]
}
"""

    with open(f"{base_path}/tsconfig.json", "w") as f:
        f.write(tsconfig)

    with open(f"{base_path}/tsconfig.build.json", "w") as f:
        f.write(tsconfig_build)

    print(f"✓ Generated tsconfig files")

def generate_dockerfile(base_path):
    content = """FROM node:20-alpine AS builder
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
EXPOSE 3000
CMD ["node", "dist/main.js"]
"""
    with open(f"{base_path}/Dockerfile", "w") as f:
        f.write(content)

    print(f"✓ Generated Dockerfile")

def generate_dockerignore(base_path):
    content = """node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env
.env.local
.vscode
.idea
*.log
coverage
.DS_Store
"""
    with open(f"{base_path}/.dockerignore", "w") as f:
        f.write(content)

    print(f"✓ Generated .dockerignore")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 generate-microservice.py <service-name> <port> [domain]")
        print("")
        print("Examples:")
        print("  python3 generate-microservice.py inventory 3011")
        print("  python3 generate-microservice.py inventory 3011 characters")
        print("  python3 generate-microservice.py permissions 3012 auth")
        sys.exit(1)

    service_name = sys.argv[1]
    port = int(sys.argv[2])
    domain = sys.argv[3] if len(sys.argv) > 3 else "characters"

    generate_microservice(service_name, port, domain)
