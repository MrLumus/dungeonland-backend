import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { User } from "@domain/entities";
import { AuthService } from "@application/services";
import { AuthController } from "@presentation/controllers";
import { JwtStrategy } from "@infrastructure/auth";

/**
 * Auth Module
 * Encapsulates all authentication-related functionality
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || "24h"
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
