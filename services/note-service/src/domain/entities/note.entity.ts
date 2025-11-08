import {
  Column,
  Entity,
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

  @Column({ type: 'uuid' })
  characterId: string;
}
