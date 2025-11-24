
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Character } from './character.entity';

@Entity({ name: 'spells' })
export class Spell {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  level: number;

  @Column({ nullable: true })
  school: string;

  @ManyToOne(() => Character, (c) => c.spells, { onDelete: 'CASCADE' })
  character: Character;
}
