import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "normalize_characters_history" })
export class NormalizeCharactersHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  characterId: string;

  @Column()
  characterName: string;

  @Column("text", { array: true })
  normalizedFields: string[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
