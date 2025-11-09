import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("dice_type_reference")
export class DiceTypeReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
}
