import {
  Column,
  Entity,
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

  @Column({ type: 'uuid' })
  characterId: string;
}
