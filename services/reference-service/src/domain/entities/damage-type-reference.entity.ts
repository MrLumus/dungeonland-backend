import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("damage_type_reference")
export class DamageTypeReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
}
