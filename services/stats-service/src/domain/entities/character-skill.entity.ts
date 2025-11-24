import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CharacterStat } from "./character-stat.entity";

@Entity("character_skill")
export class CharacterSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CharacterStat, (stat) => stat.skills, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "character_stat_id" })
  characterStat: CharacterStat;

  @Column({ type: 'integer' })
  skillId: number; // Reference to SkillReference (in reference-service)

  @Column({ default: 0 })
  value: number;

  @Column({ default: 0 })
  bonus: number;

  @Column({ default: 0 })
  proficient: number; // 0-нет, 1-полу, 2-владение, 3-компетенция
}
