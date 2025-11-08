import { Character } from "@modules/character/entities";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("note")
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { default: "Новая заметка" })
  title: string;

  @Column("text", { default: "" })
  content: string;

  @ManyToOne(() => Character, (c) => c.notes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "characterId" })
  character: Character;
}
