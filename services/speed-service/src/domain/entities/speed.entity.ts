import { Character } from "@character/entities";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "speed" })
export class Speed {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 30 })
  baseMovementSpeed: number;

  @Column({ default: 30 })
  totalMovementSpeed: number;

  @OneToOne(() => Character, (c) => c.speed, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "characterId" })
  character: Character;
}
