import { Character } from "@character/entities";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("personality")
export class Personality {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "" })
  history: string;

  @Column({ default: "" })
  god: string;

  @Column({ default: "" })
  alliesAndGuilds: string;

  @Column({ default: "" })
  temper: string;

  @Column({ default: "" })
  ideals: string;

  @Column({ default: "" })
  attachments: string;

  @Column({ default: "" })
  weaknesses: string;

  @Column({ default: "" })
  appearance: string;

  @Column({ default: "" })
  historyName: string;

  @Column({ default: "" })
  worldview: string;

  @Column({ default: "" })
  eyes: string;

  @Column({ default: "" })
  skin: string;

  @Column({ default: "" })
  hairs: string;

  @Column({ default: null, nullable: true })
  height: number;

  @Column({ default: null, nullable: true })
  weight: number;

  @Column({ default: null, nullable: true })
  age: number;

  @OneToOne(() => Character, (c) => c.personality, { onDelete: "CASCADE" })
  @JoinColumn({ name: "characterId" })
  character: Character;
}
