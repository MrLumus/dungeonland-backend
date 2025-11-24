import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { EquipmentTypeReference } from "../../domain/entities";
import { EquipmentTypeReferenceService } from "../../application/services";
import { EquipmentTypeReferenceController } from "../controllers/equipment-type-reference.controller";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([EquipmentTypeReference]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [EquipmentTypeReferenceService, JwtStrategy],
  controllers: [EquipmentTypeReferenceController],
  exports: [EquipmentTypeReferenceService],
})
export class EquipmentTypeReferenceModule {}
