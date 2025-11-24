import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("equipment_type_reference")
export class EquipmentTypeReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
}
