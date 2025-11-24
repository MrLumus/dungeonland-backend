import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ArmourTypeReference } from "../../domain/entities";
import { ArmourTypeReferenceService } from "../../application/services";
import { ArmourTypeReferenceController } from "../controllers/armour-type-reference.controller";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([ArmourTypeReference]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [ArmourTypeReferenceService, JwtStrategy],
  controllers: [ArmourTypeReferenceController],
  exports: [ArmourTypeReferenceService],
})
export class ArmourTypeReferenceModule {}
