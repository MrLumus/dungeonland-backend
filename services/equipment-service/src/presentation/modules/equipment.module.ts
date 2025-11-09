import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { Equipment } from "../../domain/entities";
import { EquipmentService } from "../../application/services";
import { EquipmentController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
    HttpModule,
  ],
  providers: [EquipmentService, JwtStrategy],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {}
