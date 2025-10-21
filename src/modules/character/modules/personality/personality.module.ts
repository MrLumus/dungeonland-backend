import { Module } from "@nestjs/common";
import { Personality } from "./entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonalityService } from "./personality.service";
import { PersonalityController } from "./personality.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Personality])],
  providers: [PersonalityService],
  controllers: [PersonalityController],
})
export class PersonalityModule {}
