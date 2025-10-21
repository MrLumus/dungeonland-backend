import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CharacterStat, CharacterSkill } from "./entities";
import { StatsService } from "./stats.service";
import { StatsController } from "./stats.controller";
import { StatReference, SkillReference } from "@reference/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatReference,
      SkillReference,
      CharacterStat,
      CharacterSkill,
    ]),
  ],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
