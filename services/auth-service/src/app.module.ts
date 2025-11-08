import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "./infrastructure/config/ormconfig";
import { AuthModule } from "./presentation/modules/auth.module";

/**
 * Auth Service - Main Application Module
 * Microservice responsible for authentication and user management
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({ ...(ormconfig as any) }),
    AuthModule,
  ],
})
export class AppModule {}
