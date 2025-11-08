import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Personality } from "../../domain/entities";
import { PersonalityService } from "../../application/services";
import { PersonalityController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([Personality]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [PersonalityService, JwtStrategy],
  controllers: [PersonalityController],
  exports: [PersonalityService],
})
export class PersonalityModule {}
