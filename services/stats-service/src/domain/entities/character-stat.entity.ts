import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Character } from "@character/entities";
import { CharacterSkill } from "../entities";
import { StatReference } from "@reference/entities";

@Entity("character_stat")
export class CharacterStat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, (character) => character.stats, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "character_id" })
  character: Character; // Ссылка на персонажа

  @ManyToOne(() => StatReference, { eager: true })
  @JoinColumn({ name: "stat_id" })
  stat: StatReference; // Ссылка на референс характеристики

  @Column({ default: 10 })
  stat_value: number; // Значение характеристики

  @Column({ default: 0 })
  check_value: number; // Проверка характеристики

  @Column({ default: 0 })
  check_bonus: number; // Бонус к проверке характеристики

  @Column({ default: 0 })
  save_throw__value: number; // Значение спасброска

  @Column({ default: 0 })
  save_throw__bonus: number; // Бонус к спасброску

  @Column({ default: false })
  save_throw_proficient: boolean; // Есть ли владение спасброском

  @OneToMany(() => CharacterSkill, (skill) => skill.characterStat, {
    cascade: true,
    eager: true,
  })
  skills: CharacterSkill[]; // Список умений характеристики
}
