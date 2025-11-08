import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { CharacterStat } from "../../domain/entities";
import { CharacterStatService } from "../../application/services";
import { CharacterStatController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([CharacterStat]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [CharacterStatService, JwtStrategy],
  controllers: [CharacterStatController],
  exports: [CharacterStatService],
})
export class CharacterStatModule {}
