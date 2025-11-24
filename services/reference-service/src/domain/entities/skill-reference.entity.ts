import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StatReference } from "./stat-reference.entity";

@Entity("skill_reference")
export class SkillReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => StatReference, (stat) => stat.skills, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "stat_id" })
  stat: StatReference;
}
