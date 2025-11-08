import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Speed } from "../../domain/entities";
import { SpeedService } from "../../application/services";
import { SpeedController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([Speed]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [SpeedService, JwtStrategy],
  controllers: [SpeedController],
  exports: [SpeedService],
})
export class SpeedModule {}
