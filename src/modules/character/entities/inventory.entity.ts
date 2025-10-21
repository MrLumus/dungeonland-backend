
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Character } from './character.entity';

@Entity({ name: 'inventory_items' })
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('integer', { default: 1 })
  quantity: number;

  @Column('float', { default: 0 })
  weight: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Character, (c) => c.inventory, { onDelete: 'CASCADE' })
  character: Character;
}
