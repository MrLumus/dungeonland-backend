import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character, Attack, InventoryItem, Spell } from "./entities";
import { PersonalityModule } from "@personality/index";
import { LevelModule } from "@level/index";
import { StatsModule } from "@stats/index";
import { User } from "@auth/entities";
import { CharacterStat, CharacterSkill } from "@stats/entities";
import { Level } from "@level/entities";
import { CharacterService } from "./character.service";
import { CharacterController } from ".";
import { StatReference, SkillReference } from "@reference/entities";
import { HealthModule } from "@health/health.module";
import { Health } from "@health/entities";
import { ArmourModule } from "@armour/armour.module";
import { SpeedModule } from "@speed/speed.module";
import { Armour } from "@armour/entities";
import { Speed } from "@speed/entities";
import { NoteModule } from "@note/note.module";
import { Note } from "@note/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    ]),
    PersonalityModule,
    LevelModule,
    StatsModule,
    HealthModule,
    ArmourModule,
    SpeedModule,
    NoteModule,
  ],
  providers: [CharacterService],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {}
