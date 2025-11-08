import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Character } from "@character/entities";
import { LEVELS_CONFIG } from "../constants";

@Entity({ name: "level" })
export class Level {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: LEVELS_CONFIG[1].from })
  expFrom: number;

  @Column({ default: LEVELS_CONFIG[1].to })
  expTo: number;

  @Column({ default: LEVELS_CONFIG[1].from })
  expCurrent: number;

  @Column({ default: LEVELS_CONFIG[1].mastery })
  mastery: number;

  @OneToOne(() => Character, (c) => c.level, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "characterId" })
  character: Character;
}
