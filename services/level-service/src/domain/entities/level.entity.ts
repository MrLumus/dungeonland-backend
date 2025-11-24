import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
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

  @Column({ type: 'uuid' })
  characterId: string;
}
