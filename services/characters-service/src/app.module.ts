import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "./infrastructure/config/ormconfig";
import { CharacterModule } from "./presentation/modules/character.module";

/**
 * Characters Service - Main Application Module
 * Microservice responsible for character management
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({ ...(ormconfig as any) }),
    CharacterModule,
  ],
})
export class AppModule {}
