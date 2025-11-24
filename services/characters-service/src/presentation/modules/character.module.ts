import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { Character, Attack, Spell, InventoryItem } from "../../domain/entities";
import { CharacterService } from "../../application/services";
import { CharacterController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";
import { MicroservicesClientService } from "../../infrastructure/http/microservices-client.service";

/**
 * Character Module
 * Encapsulates all character-related functionality
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Attack, Spell, InventoryItem]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [CharacterService, JwtStrategy, MicroservicesClientService],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {}
