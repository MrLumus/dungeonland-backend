import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Character } from "@character/entities";

@Entity({ name: "health" })
export class Health {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 10 })
  max: number;

  @Column({ default: 10 })
  current: number;

  @Column({ default: 0 })
  timeless: number;

  @Column({ default: 0 })
  permanent: number;

  @Column({ default: 0 })
  deathSuccessSaveThrows: number;

  @Column({ default: 0 })
  deathFailSaveThrows: number;

  @OneToOne(() => Character, (c) => c.health, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "characterId" })
  character: Character;
}
