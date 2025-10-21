import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NormalizeService } from "./normalize.service";
import { NormalizeController } from "./normalize.controller";
import { NormalizeCharactersHistory } from "./entities";
import { Character, Attack, InventoryItem, Spell } from "@character/entities";
import { StatReference, SkillReference } from "@reference/entities";
import { CharacterSkill, CharacterStat } from "@stats/entities";
import { Personality } from "@personality/entities";
import { Health } from "@health/entities";
import { Armour } from "@armour/entities";
import { Speed } from "@speed/entities";
import { Level } from "@level/entities";
import { User } from "@auth/entities";
import { Note } from "@note/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NormalizeCharactersHistory,
      Character,
      StatReference,
      SkillReference,
      CharacterStat,
      CharacterSkill,
      Armour,
      Speed,
      Level,
      Health,
      Attack,
      Spell,
      InventoryItem,
      Note,
      User,
      Personality,
    ]),
  ],
  providers: [NormalizeService],
  controllers: [NormalizeController],
  exports: [NormalizeService],
})
export class NormalizeModule {}
