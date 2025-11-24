import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { seedStatReferences } from "./seeds/init-stats.seed";

dotenv.config();

async function bootstrap() {
  // Seed reference data before starting the app
  try {
    await seedStatReferences();
  } catch (error) {
    console.error("Warning: Failed to seed reference data:", error.message);
  }

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
    .setTitle("DungeonLand Reference Data (Stats, Skills)")
    .setDescription("Reference data (stats, skills)")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT || 3010;
  await app.listen(port);

  console.log(`🚀 Reference Data (Stats, Skills) is running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
}

bootstrap();
