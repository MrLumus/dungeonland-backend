import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { StatReference } from "../../domain/entities";
import { StatReferenceService } from "../../application/services";
import { StatReferenceController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([StatReference]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [StatReferenceService, JwtStrategy],
  controllers: [StatReferenceController],
  exports: [StatReferenceService],
})
export class StatReferenceModule {}
