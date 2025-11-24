#!/usr/bin/env ts-node
/**
 * Universal DDD Microservice Generator
 * Generates a new microservice with full DDD structure
 *
 * Usage: npm run generate:service <name> <port> [domain]
 * Example: npm run generate:service inventory 3011
 */

import * as fs from 'fs';
import * as path from 'path';

interface ServiceConfig {
  name: string;
  pascalName: string;
  port: number;
  domain: 'auth' | 'characters';
  dbPrefix: string;
}

function generateMicroservice(serviceName: string, port: number, domain: 'auth' | 'characters' = 'characters') {
  const config: ServiceConfig = {
    name: serviceName.toLowerCase(),
    pascalName: capitalize(serviceName),
    port,
    domain,
    dbPrefix: domain.toUpperCase(),
  };

  const basePath = path.join(process.cwd(), 'services', `${config.name}-service`);

  console.log(`\n🚀 Generating microservice: ${config.pascalName}`);
  console.log(`   Port: ${port}`);
  console.log(`   Domain: ${domain}`);
  console.log(`   Path: ${basePath}`);

  // Create directory structure
  const dirs = [
    'src/domain/entities',
    'src/domain/constants',
    'src/application/services',
    'src/application/dto',
    'src/infrastructure/config',
    'src/infrastructure/auth',
    'src/presentation/controllers',
    'src/presentation/modules',
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(basePath, dir);
    fs.mkdirSync(fullPath, { recursive: true });
  });

  console.log('✓ Created directory structure');

  // Generate all files
  generateEntity(basePath, config);
  generateService(basePath, config);
  generateController(basePath, config);
  generateModule(basePath, config);
  generateDto(basePath, config);
  generateAppModule(basePath, config);
  generateMain(basePath, config);
  generateOrmConfig(basePath, config);
  generateJwtStrategy(basePath);
  generatePackageJson(basePath, config);
  generateTsConfig(basePath);
  generateDockerfile(basePath);
  generateDockerignore(basePath);

  console.log(`\n✅ Microservice '${config.pascalName}' generated successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. cd services/${config.name}-service && npm install`);
  console.log(`2. Update entity with your fields`);
  console.log(`3. Add to docker-compose.yml`);
  console.log(`4. docker compose build ${config.name}-service`);
  console.log(`5. docker compose up ${config.name}-service`);
}

function generateEntity(basePath: string, config: ServiceConfig) {
  const content = `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("${config.name}")
export class ${config.pascalName} {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'uuid' })
  characterId: string;

  // TODO: Add your entity fields here
  @Column({ default: "" })
  name: string;
}
`;

  writeFile(basePath, `src/domain/entities/${config.name}.entity.ts`, content);
  writeFile(basePath, 'src/domain/entities/index.ts', `export { ${config.pascalName} } from "./${config.name}.entity";\n`);
  console.log(`✓ Generated entity: ${config.pascalName}`);
}

function generateService(basePath: string, config: ServiceConfig) {
  const content = `import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ${config.pascalName} } from "../../domain/entities";

@Injectable()
export class ${config.pascalName}Service {
  constructor(
    @InjectRepository(${config.pascalName})
    private readonly repository: Repository<${config.pascalName}>
  ) {}

  async create(userId: string, characterId: string, dto: any) {
    const item = this.repository.create({
      ...dto,
      characterId,
    });
    return this.repository.save(item);
  }

  async findByCharacter(userId: string, characterId: string) {
    const item = await this.repository.findOne({
      where: { characterId }
    });
    return item; // Returns single object or null
  }

  async findOne(userId: string, id: string) {
    const item = await this.repository.findOne({
      where: { id }
    });

    if (!item) {
      throw new NotFoundException('${config.pascalName} not found');
    }

    return item;
  }

  async update(userId: string, id: string, dto: any) {
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async delete(userId: string, id: string) {
    const item = await this.findOne(userId, id);
    await this.repository.remove(item);
  }
}
`;

  writeFile(basePath, `src/application/services/${config.name}.service.ts`, content);
  writeFile(basePath, 'src/application/services/index.ts', `export { ${config.pascalName}Service } from "./${config.name}.service";\n`);
  console.log(`✓ Generated service: ${config.pascalName}Service`);
}

function generateController(basePath: string, config: ServiceConfig) {
  const content = `import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ${config.pascalName}Service } from "../../application/services";

@ApiTags("Characters/${config.pascalName}")
@Controller("characters/:characterId/${config.name}")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ${config.pascalName}Controller {
  constructor(private readonly service: ${config.pascalName}Service) {}

  @Post()
  @ApiOperation({ summary: "Create ${config.pascalName} for character" })
  create(
    @Request() req: any,
    @Param("characterId") characterId: string,
    @Body() dto: any
  ) {
    return this.service.create(req.user.userId, characterId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get ${config.name} for character" })
  findAll(@Request() req: any, @Param("characterId") characterId: string) {
    return this.service.findByCharacter(req.user.userId, characterId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get ${config.pascalName} by ID" })
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.service.findOne(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update ${config.pascalName}" })
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: any
  ) {
    return this.service.update(req.user.userId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete ${config.pascalName}" })
  remove(@Request() req: any, @Param("id") id: string) {
    return this.service.delete(req.user.userId, id);
  }
}
`;

  writeFile(basePath, `src/presentation/controllers/${config.name}.controller.ts`, content);
  writeFile(basePath, 'src/presentation/controllers/index.ts', `export { ${config.pascalName}Controller } from "./${config.name}.controller";\n`);
  console.log(`✓ Generated controller: ${config.pascalName}Controller`);
}

function generateModule(basePath: string, config: ServiceConfig) {
  const content = `import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ${config.pascalName} } from "../../domain/entities";
import { ${config.pascalName}Service } from "../../application/services";
import { ${config.pascalName}Controller } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([${config.pascalName}]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [${config.pascalName}Service, JwtStrategy],
  controllers: [${config.pascalName}Controller],
  exports: [${config.pascalName}Service],
})
export class ${config.pascalName}Module {}
`;

  writeFile(basePath, `src/presentation/modules/${config.name}.module.ts`, content);
  console.log(`✓ Generated module: ${config.pascalName}Module`);
}

function generateDto(basePath: string, config: ServiceConfig) {
  const content = `import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class Create${config.pascalName}Dto {
  @ApiPropertyOptional({ example: "Example", description: "Name" })
  @IsOptional()
  @IsString()
  name?: string;

  // TODO: Add your DTO fields here
}

export class Update${config.pascalName}Dto {
  @ApiPropertyOptional({ example: "Example", description: "Name" })
  @IsOptional()
  @IsString()
  name?: string;

  // TODO: Add your DTO fields here
}
`;

  writeFile(basePath, 'src/application/dto/index.ts', content);
  console.log(`✓ Generated DTOs`);
}

function generateAppModule(basePath: string, config: ServiceConfig) {
  const content = `import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "./infrastructure/config/ormconfig";
import { ${config.pascalName}Module } from "./presentation/modules/${config.name}.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({ ...(ormconfig as any) }),
    ${config.pascalName}Module,
  ],
})
export class AppModule {}
`;

  writeFile(basePath, 'src/app.module.ts', content);
  console.log(`✓ Generated app.module.ts`);
}

function generateMain(basePath: string, config: ServiceConfig) {
  const content = `import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("DungeonLand ${config.pascalName} Service")
    .setDescription("${config.pascalName} management")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT || ${config.port};
  await app.listen(port);

  console.log(\`🚀 ${config.pascalName} Service is running on http://localhost:\${port}\`);
  console.log(\`📚 API Documentation: http://localhost:\${port}/api-docs\`);
}

bootstrap();
`;

  writeFile(basePath, 'src/main.ts', content);
  console.log(`✓ Generated main.ts`);
}

function generateOrmConfig(basePath: string, config: ServiceConfig) {
  const content = `import { DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const ormconfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.${config.dbPrefix}_DB_HOST || "localhost",
  port: parseInt(process.env.${config.dbPrefix}_DB_PORT || "5432"),
  username: process.env.${config.dbPrefix}_DB_USER || "postgres",
  password: process.env.${config.dbPrefix}_DB_PASSWORD || "postgres",
  database: process.env.${config.dbPrefix}_DB_NAME || "dungeonland_${config.domain}",
  ssl: process.env.DATABASE_SSL === "true",
  synchronize: true, // Set to false in production
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
};

export default ormconfig;
`;

  writeFile(basePath, 'src/infrastructure/config/ormconfig.ts', content);
  console.log(`✓ Generated ormconfig.ts`);
}

function generateJwtStrategy(basePath: string) {
  const content = `import { Injectable } from "@nestjs/common";
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
`;

  writeFile(basePath, 'src/infrastructure/auth/jwt.strategy.ts', content);
  writeFile(basePath, 'src/infrastructure/auth/index.ts', 'export { JwtStrategy } from "./jwt.strategy";\n');
  console.log(`✓ Generated JWT strategy`);
}

function generatePackageJson(basePath: string, config: ServiceConfig) {
  const content = {
    name: `dungeonland-${config.name}-service`,
    version: "1.0.0",
    description: `${config.pascalName} management microservice`,
    scripts: {
      start: "node dist/main.js",
      "start:dev": "nest start --watch",
      build: "tsc -p tsconfig.build.json"
    },
    dependencies: {
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
    devDependencies: {
      "@nestjs/cli": "^10.0.0",
      "@types/node": "^20.0.0",
      "@types/passport-jwt": "^3.0.0",
      "ts-node": "^10.9.1",
      "typescript": "^5.1.6"
    }
  };

  writeFile(basePath, 'package.json', JSON.stringify(content, null, 2));
  console.log(`✓ Generated package.json`);
}

function generateTsConfig(basePath: string) {
  const tsconfig = {
    compilerOptions: {
      module: "commonjs",
      declaration: true,
      removeComments: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowSyntheticDefaultImports: true,
      target: "ES2021",
      sourceMap: true,
      outDir: "./dist",
      baseUrl: "./",
      incremental: true,
      skipLibCheck: true,
      strictNullChecks: false,
      noImplicitAny: false,
      strictBindCallApply: false,
      forceConsistentCasingInFileNames: false,
      noFallthroughCasesInSwitch: false,
      esModuleInterop: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"]
  };

  const tsconfigBuild = {
    extends: "./tsconfig.json",
    exclude: ["node_modules", "dist", "**/*spec.ts"]
  };

  writeFile(basePath, 'tsconfig.json', JSON.stringify(tsconfig, null, 2));
  writeFile(basePath, 'tsconfig.build.json', JSON.stringify(tsconfigBuild, null, 2));
  console.log(`✓ Generated tsconfig files`);
}

function generateDockerfile(basePath: string) {
  const content = `FROM node:20-alpine AS builder
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
`;

  writeFile(basePath, 'Dockerfile', content);
  console.log(`✓ Generated Dockerfile`);
}

function generateDockerignore(basePath: string) {
  const content = `node_modules
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
`;

  writeFile(basePath, '.dockerignore', content);
  console.log(`✓ Generated .dockerignore`);
}

// Helper functions
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function writeFile(basePath: string, relativePath: string, content: string) {
  const fullPath = path.join(basePath, relativePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: npm run generate:service <name> <port> [domain]');
  console.log('');
  console.log('Examples:');
  console.log('  npm run generate:service inventory 3011');
  console.log('  npm run generate:service inventory 3011 characters');
  console.log('  npm run generate:service permissions 3012 auth');
  process.exit(1);
}

const serviceName = args[0];
const port = parseInt(args[1]);
const domain = (args[2] || 'characters') as 'auth' | 'characters';

if (isNaN(port)) {
  console.error('Error: Port must be a number');
  process.exit(1);
}

if (domain !== 'auth' && domain !== 'characters') {
  console.error('Error: Domain must be either "auth" or "characters"');
  process.exit(1);
}

generateMicroservice(serviceName, port, domain);
