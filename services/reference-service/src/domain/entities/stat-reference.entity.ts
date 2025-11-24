import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SkillReference } from "./skill-reference.entity";

@Entity("stat_reference")
export class StatReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => SkillReference, (skill) => skill.stat)
  skills: SkillReference[];
}
