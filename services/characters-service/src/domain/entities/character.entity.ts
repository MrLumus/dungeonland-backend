import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { InventoryItem } from "./inventory.entity";
import { Attack } from "./attack.entity";
import { Spell } from "./spell.entity";

/**
 * Character Domain Entity
 * Represents a player's character in the game
 * Note: userId is stored as string reference to Auth service
 */
@Entity({ name: "characters" })
export class Character {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "Новый персонаж" })
  name: string;

  @Column({ nullable: true })
  race: string;

  @Column({ nullable: true })
  class: string;

  @Column({ default: 0 })
  initiative: number;

  @Column({ default: 0 })
  money: number;

  @Column({ default: false })
  hasInspiration: boolean;

  @Column({ default: 0 })
  exhaustion: number;

  @Column({ default: 150 })
  maxWeight: number;

  @Column({ default: 100 })
  maxCells: number;

  // Reference to user in Auth service (no FK constraint)
  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => Attack, (a) => a.character, { cascade: true })
  attacks: Attack[];

  @OneToMany(() => Spell, (sp) => sp.character, { cascade: true })
  spells: Spell[];

  @OneToMany(() => InventoryItem, (it) => it.character, { cascade: true })
  inventory: InventoryItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
