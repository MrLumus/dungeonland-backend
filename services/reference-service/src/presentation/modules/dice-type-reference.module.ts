import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { DiceTypeReference } from "../../domain/entities";
import { DiceTypeReferenceService } from "../../application/services";
import { DiceTypeReferenceController } from "../controllers/dice-type-reference.controller";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiceTypeReference]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [DiceTypeReferenceService, JwtStrategy],
  controllers: [DiceTypeReferenceController],
  exports: [DiceTypeReferenceService],
})
export class DiceTypeReferenceModule {}
