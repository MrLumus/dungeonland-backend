#!/usr/bin/env python3
"""
Microservices Generator
Generates complete microservice structure for all Characters domain services
"""

import os
import json

BASE_DIR = "/home/user/dungeonland-backend/services"

# Service configurations
SERVICES = {
    "health-service": {
        "port": 3003,
        "entity": "Health",
        "route": "health",
        "description": "Health management"
    },
    "level-service": {
        "port": 3004,
        "entity": "Level",
        "route": "levels",
        "description": "Level and experience management"
    },
    "speed-service": {
        "port": 3005,
        "entity": "Speed",
        "route": "speed",
        "description": "Character speed management"
    },
    "armour-service": {
        "port": 3006,
        "entity": "Armour",
        "route": "armour",
        "description": "Character armour management"
    },
    "stats-service": {
        "port": 3007,
        "entity": "CharacterStat",
        "route": "stats",
        "description": "Stats and skills management"
    },
    "personality-service": {
        "port": 3008,
        "entity": "Personality",
        "route": "personality",
        "description": "Character personality management"
    },
    "note-service": {
        "port": 3009,
        "entity": "Note",
        "route": "notes",
        "description": "Character notes management"
    },
    "reference-service": {
        "port": 3010,
        "entity": "StatReference",
        "route": "references",
        "description": "Reference data (stats, skills)"
    },
}

def create_service_file(service_name, config):
    """Create service file"""
    entity = config["entity"]
    entity_lower = entity.lower()

    return f"""import {{ Injectable, NotFoundException }} from "@nestjs/common";
import {{ InjectRepository }} from "@nestjs/typeorm";
import {{ Repository }} from "typeorm";
import {{ {entity} }} from "../../domain/entities";

@Injectable()
export class {entity}Service {{
  constructor(
    @InjectRepository({entity})
    private readonly repository: Repository<{entity}>
  ) {{}}

  async findByCharacter(userId: string, characterId: string) {{
    const items = await this.repository.find({{
      where: {{ characterId }}
    }});
    return items;
  }}

  async findOne(userId: string, id: string) {{
    const item = await this.repository.findOne({{
      where: {{ id }}
    }});

    if (!item) {{
      throw new NotFoundException('{entity} not found');
    }}

    return item;
  }}

  async update(userId: string, id: string, dto: any) {{
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }}
}}
"""

def create_controller_file(service_name, config):
    """Create controller file"""
    entity = config["entity"]
    route = config["route"]

    return f"""import {{
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
}} from "@nestjs/common";
import {{ AuthGuard }} from "@nestjs/passport";
import {{ ApiTags, ApiOperation, ApiBearerAuth }} from "@nestjs/swagger";
import {{ {entity}Service }} from "../../application/services";

@ApiTags("Characters/{entity}")
@Controller("characters/:characterId/{route}")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class {entity}Controller {{
  constructor(private readonly service: {entity}Service) {{}}

  @Get()
  @ApiOperation({{ summary: "Get {route} for character" }})
  findAll(@Request() req: any, @Param("characterId") characterId: string) {{
    return this.service.findByCharacter(req.user.userId, characterId);
  }}

  @Get(":id")
  @ApiOperation({{ summary: "Get {entity} by ID" }})
  findOne(@Request() req: any, @Param("id") id: string) {{
    return this.service.findOne(req.user.userId, id);
  }}

  @Patch(":id")
  @ApiOperation({{ summary: "Update {entity}" }})
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: any
  ) {{
    return this.service.update(req.user.userId, id, dto);
  }}
}}
"""

def create_module_file(service_name, config):
    """Create module file"""
    entity = config["entity"]

    return f"""import {{ Module }} from "@nestjs/common";
import {{ TypeOrmModule }} from "@nestjs/typeorm";
import {{ PassportModule }} from "@nestjs/passport";
import {{ JwtModule }} from "@nestjs/jwt";
import {{ {entity} }} from "../../domain/entities";
import {{ {entity}Service }} from "../../application/services";
import {{ {entity}Controller }} from "../controllers";
import {{ JwtStrategy }} from "../../infrastructure/auth";

@Module({{
  imports: [
    TypeOrmModule.forFeature([{entity}]),
    PassportModule,
    JwtModule.register({{
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }}),
  ],
  providers: [{entity}Service, JwtStrategy],
  controllers: [{entity}Controller],
  exports: [{entity}Service],
}})
export class {entity}Module {{}}
"""

def create_app_module(service_name, config):
    """Create app.module.ts"""
    entity = config["entity"]

    return f"""import {{ Module }} from "@nestjs/common";
import {{ ConfigModule }} from "@nestjs/config";
import {{ TypeOrmModule }} from "@nestjs/typeorm";
import ormconfig from "./infrastructure/config/ormconfig";
import {{ {entity}Module }} from "./presentation/modules/{entity.lower()}.module";

@Module({{
  imports: [
    ConfigModule.forRoot({{
      isGlobal: true,
      envFilePath: '.env'
    }}),
    TypeOrmModule.forRoot({{ ...(ormconfig as any) }}),
    {entity}Module,
  ],
}})
export class AppModule {{}}
"""

def create_main_ts(service_name, config):
    """Create main.ts"""
    port = config["port"]
    description = config["description"]

    return f"""import "reflect-metadata";
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
    .setTitle("DungeonLand {description.title()}")
    .setDescription("{description}")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT || {port};
  await app.listen(port);

  console.log(`🚀 {description.title()} is running on http://localhost:${{port}}`);
  console.log(`📚 API Documentation: http://localhost:${{port}}/api-docs`);
}}

bootstrap();
"""

def main():
    """Main generator function"""
    for service_name, config in SERVICES.items():
        service_dir = os.path.join(BASE_DIR, service_name)
        entity = config["entity"]
        entity_lower = entity.lower()

        print(f"Generating {service_name}...")

        # Create service
        service_file = os.path.join(service_dir, "src/application/services", f"{entity_lower}.service.ts")
        os.makedirs(os.path.dirname(service_file), exist_ok=True)
        with open(service_file, 'w') as f:
            f.write(create_service_file(service_name, config))

        # Create service index
        with open(os.path.join(service_dir, "src/application/services/index.ts"), 'w') as f:
            f.write(f"export {{ {entity}Service }} from './{entity_lower}.service';\n")

        # Create controller
        controller_file = os.path.join(service_dir, "src/presentation/controllers", f"{entity_lower}.controller.ts")
        os.makedirs(os.path.dirname(controller_file), exist_ok=True)
        with open(controller_file, 'w') as f:
            f.write(create_controller_file(service_name, config))

        # Create controller index
        with open(os.path.join(service_dir, "src/presentation/controllers/index.ts"), 'w') as f:
            f.write(f"export {{ {entity}Controller }} from './{entity_lower}.controller';\n")

        # Create module
        module_file = os.path.join(service_dir, "src/presentation/modules", f"{entity_lower}.module.ts")
        os.makedirs(os.path.dirname(module_file), exist_ok=True)
        with open(module_file, 'w') as f:
            f.write(create_module_file(service_name, config))

        # Create app.module.ts
        with open(os.path.join(service_dir, "src/app.module.ts"), 'w') as f:
            f.write(create_app_module(service_name, config))

        # Create main.ts
        with open(os.path.join(service_dir, "src/main.ts"), 'w') as f:
            f.write(create_main_ts(service_name, config))

        print(f"✅ {service_name} generated successfully!")

    print("\n🎉 All microservices generated successfully!")

if __name__ == "__main__":
    main()
