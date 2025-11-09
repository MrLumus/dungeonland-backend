import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("armour_type_reference")
export class ArmourTypeReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
}
