import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CharacterStat } from "../entities";
import { SkillReference } from "@reference/entities";

@Entity("character_skill")
export class CharacterSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CharacterStat, (stat) => stat.skills, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "character_stat_id" })
  characterStat: CharacterStat; // Ссылка на стат перонажа

  @ManyToOne(() => SkillReference, { eager: true })
  @JoinColumn({ name: "skill_id" })
  skill: SkillReference; // Ссылка на референс умения

  @Column({ default: 0 })
  value: number; // Проверка умения

  @Column({ default: 0 })
  bonus: number; // Бонус к првоерке умения

  @Column({ default: 0 })
  proficient: number; // Уровень владения: 0 - нет владения, 1 - полувладение, 2 - владение, 3 - компетенция
}
