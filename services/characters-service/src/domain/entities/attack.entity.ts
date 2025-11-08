
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Character } from './character.entity';

@Entity({ name: 'attacks' })
export class Attack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  damage: string;

  @Column('integer', { default: 0 })
  bonus: number;

  @ManyToOne(() => Character, (c) => c.attacks, { onDelete: 'CASCADE' })
  character: Character;
}
