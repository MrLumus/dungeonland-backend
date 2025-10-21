import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { InventoryItem, Attack, Spell } from "../entities";
import { User } from "@auth/entities";
import { CharacterStat } from "@stats/entities";
import { Level } from "@level/entities";
import { Personality } from "@personality/entities";
import { Health } from "@health/entities";
import { Armour } from "@armour/entities";
import { Speed } from "@speed/entities";
import { Note } from "@note/entities";

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

  @Column({ default: 150 }) // 15 * Сила
  maxWeight: number;

  @Column({ default: 100 }) // Кастомная доработка
  maxCells: number;

  @OneToOne(() => Armour, (a) => a.character, {
    cascade: true,
    eager: true,
  })
  armour: Armour;

  @OneToOne(() => Speed, (s) => s.character, {
    cascade: true,
    eager: true,
  })
  speed: Speed;

  @OneToOne(() => Level, (l) => l.character, {
    cascade: true,
    eager: true,
  })
  level: Level;

  @OneToOne(() => Health, (h) => h.character, {
    cascade: true,
    eager: true,
  })
  health: Health;

  @OneToMany(() => CharacterStat, (s) => s.character, {
    cascade: true,
    eager: true,
  })
  stats: CharacterStat[];

  //TODO - вынести в отдельный модуль
  @OneToMany(() => Attack, (a) => a.character, { cascade: true })
  attacks: Attack[];

  //TODO - вынести в отдельный модуль
  @OneToMany(() => Spell, (sp) => sp.character, { cascade: true })
  spells: Spell[];

  //TODO - вынести в отдельный модуль
  @OneToMany(() => InventoryItem, (it) => it.character, { cascade: true })
  inventory: InventoryItem[];

  @OneToMany(() => Note, (n) => n.character, { cascade: true })
  notes: Note[];

  @OneToOne(() => Personality, (p) => p.character, {
    cascade: true,
    eager: true,
  })
  personality: Personality;

  @ManyToOne(() => User, (u) => u.characters, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;
}
