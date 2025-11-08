import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Character, Attack, Spell, InventoryItem } from "../../domain/entities";
import { CharacterService } from "../../application/services";
import { CharacterController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

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
  ],
  providers: [CharacterService, JwtStrategy],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {}
