import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import {
  EEquipmentTypes,
  EArmourTypes,
  EDamageTypes,
  ECharacteristics,
  EDiceTypes,
} from "../constants";

export interface IWeaponDamage {
  oneHanded?: {
    diceCount: number;
    diceType: EDiceTypes;
    bonus?: number;
    totalAttackBonus?: number;
  };
  twoHanded?: {
    diceCount: number;
    diceType: EDiceTypes;
    bonus?: number;
    totalAttackBonus?: number;
  };
}

export interface IWeaponProperties {
  damage: IWeaponDamage;
  damageType?: EDamageTypes;
  isVersatile?: boolean;
  hasMastery?: boolean;
  range?: {
    normal?: number;
    max?: number;
  };
  statRoll?: ECharacteristics;
  attackRollBonus?: number;
  totalRollBonus?: number;
}

@Entity("equipment")
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  characterId: string;

  @Column()
  name: string;

  @Column({ default: "" })
  label: string;

  @Column({ type: "text", default: "" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  weight: number;

  @Column({ type: "int", default: 1 })
  cells: number;

  @Column({ type: "int", default: 0 })
  price: number;

  @Column({
    type: "enum",
    enum: EEquipmentTypes,
  })
  type: EEquipmentTypes;

  // Armor properties
  @Column({ type: "int", nullable: true })
  baseArmour?: number;

  @Column({ type: "int", nullable: true })
  bonusArmour?: number;

  @Column({
    type: "enum",
    enum: EArmourTypes,
    nullable: true,
  })
  armourType?: EArmourTypes;

  @Column({ type: "simple-array", nullable: true })
  armourStatRoll?: ECharacteristics[];

  @Column({ type: "int", nullable: true })
  armourStatRollMaxBonus?: number;

  @Column({ type: "int", nullable: true })
  totalArmour?: number;

  // Flags
  @Column({ default: false })
  isEquiped: boolean;

  @Column({ default: false })
  isMagic: boolean;

  // Weapon properties (stored as JSON)
  @Column({ type: "jsonb", nullable: true })
  weaponProperties?: IWeaponProperties;
}
