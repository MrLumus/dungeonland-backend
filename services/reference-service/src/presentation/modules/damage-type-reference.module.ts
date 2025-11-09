import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { DamageTypeReference } from "../../domain/entities";
import { DamageTypeReferenceService } from "../../application/services";
import { DamageTypeReferenceController } from "../controllers/damage-type-reference.controller";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([DamageTypeReference]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [DamageTypeReferenceService, JwtStrategy],
  controllers: [DamageTypeReferenceController],
  exports: [DamageTypeReferenceService],
})
export class DamageTypeReferenceModule {}
