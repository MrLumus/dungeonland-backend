import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

export interface IWeaponDamage {
  oneHanded?: {
    diceCount: number;
    diceTypeId: number; // Reference to DiceTypeReference
    bonus?: number;
    totalAttackBonus?: number;
  };
  twoHanded?: {
    diceCount: number;
    diceTypeId: number; // Reference to DiceTypeReference
    bonus?: number;
    totalAttackBonus?: number;
  };
}

export interface IWeaponProperties {
  damage: IWeaponDamage;
  damageTypeId?: number; // Reference to DamageTypeReference
  isVersatile?: boolean;
  hasMastery?: boolean;
  range?: {
    normal?: number;
    max?: number;
  };
  statRollId?: number; // Reference to StatReference (which stat to use for attack rolls)
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

  @Column({ type: "int" })
  equipmentTypeId: number; // Reference to EquipmentTypeReference

  // Armor properties
  @Column({ type: "int", nullable: true })
  baseArmour?: number;

  @Column({ type: "int", nullable: true })
  bonusArmour?: number;

  @Column({ type: "int", nullable: true })
  armourTypeId?: number; // Reference to ArmourTypeReference

  @Column({ type: "simple-array", nullable: true })
  armourStatRoll?: number[]; // Array of StatReference IDs (which stats contribute to AC)

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
