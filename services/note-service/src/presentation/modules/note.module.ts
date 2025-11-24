import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Note } from "../../domain/entities";
import { NoteService } from "../../application/services";
import { NoteController } from "../controllers";
import { JwtStrategy } from "../../infrastructure/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "change_this_to_a_secure_value",
    }),
  ],
  providers: [NoteService, JwtStrategy],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule {}
