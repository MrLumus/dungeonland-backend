import {
  Column,
  Entity,
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

  @Column({ type: 'uuid' })
  characterId: string;
}
