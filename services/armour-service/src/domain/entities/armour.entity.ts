import { Character } from "@character/entities";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "armour" })
export class Armour {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 10 })
  baseArmour: number;

  @Column({ default: 10 })
  totalArmour: number;

  @OneToOne(() => Character, (c) => c.armour, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "characterId" })
  character: Character;
}
