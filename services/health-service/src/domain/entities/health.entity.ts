import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "health" })
export class Health {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 10 })
  max: number;

  @Column({ default: 10 })
  current: number;

  @Column({ default: 0 })
  timeless: number;

  @Column({ default: 0 })
  permanent: number;

  @Column({ default: 0 })
  deathSuccessSaveThrows: number;

  @Column({ default: 0 })
  deathFailSaveThrows: number;

  @Column({ type: 'uuid' })
  characterId: string;
}
