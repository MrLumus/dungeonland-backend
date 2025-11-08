import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Armour } from "../../domain/entities";
import { ArmourService } from "../../application/services";
import { ArmourController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([Armour]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [ArmourService, JwtStrategy],
  controllers: [ArmourController],
  exports: [ArmourService],
})
export class ArmourModule {}
