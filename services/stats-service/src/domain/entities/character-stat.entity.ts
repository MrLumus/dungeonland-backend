import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { CharacterSkill } from "./character-skill.entity";

@Entity("character_stat")
export class CharacterStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  characterId: string; // Reference to Character

  @Column({ type: 'integer' })
  statId: number; // Reference to StatReference (in reference-service)

  @Column({ default: 10 })
  stat_value: number;

  @Column({ default: 0 })
  check_value: number;

  @Column({ default: 0 })
  check_bonus: number;

  @Column({ default: 0 })
  save_throw__value: number;

  @Column({ default: 0 })
  save_throw__bonus: number;

  @Column({ default: false })
  save_throw_proficient: boolean;

  @OneToMany(() => CharacterSkill, (skill) => skill.characterStat, {
    cascade: true,
    eager: true,
  })
  skills: CharacterSkill[];
}
