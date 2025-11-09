import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

// Nested DTOs for weapon properties
export class WeaponDamageHandDto {
  @ApiProperty({ example: 2, description: "Количество кубиков" })
  @IsNumber()
  diceCount: number;

  @ApiProperty({ example: 3, description: "ID типа кубика (reference to DiceTypeReference)" })
  @IsInt()
  diceTypeId: number;

  @ApiPropertyOptional({ example: 2, description: "Бонус к урону" })
  @IsOptional()
  @IsNumber()
  bonus?: number;

  @ApiPropertyOptional({ example: 5, description: "Итоговый бонус к урону" })
  @IsOptional()
  @IsNumber()
  totalAttackBonus?: number;
}

export class WeaponDamageDto {
  @ApiPropertyOptional({ type: WeaponDamageHandDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeaponDamageHandDto)
  oneHanded?: WeaponDamageHandDto;

  @ApiPropertyOptional({ type: WeaponDamageHandDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeaponDamageHandDto)
  twoHanded?: WeaponDamageHandDto;
}

export class WeaponRangeDto {
  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  normal?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  max?: number;
}

export class WeaponPropertiesDto {
  @ApiProperty({ type: WeaponDamageDto })
  @ValidateNested()
  @Type(() => WeaponDamageDto)
  damage: WeaponDamageDto;

  @ApiPropertyOptional({ example: 2, description: "ID типа урона (reference to DamageTypeReference)" })
  @IsOptional()
  @IsInt()
  damageTypeId?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVersatile?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  hasMastery?: boolean;

  @ApiPropertyOptional({ type: WeaponRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeaponRangeDto)
  range?: WeaponRangeDto;

  @ApiPropertyOptional({ example: 1, description: "ID характеристики для атаки (reference to StatReference)" })
  @IsOptional()
  @IsInt()
  statRollId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  attackRollBonus?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  totalRollBonus?: number;
}

export class CreateEquipmentDto {
  @ApiProperty({ example: "Longsword", description: "Equipment name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "Длинный меч", description: "Display label" })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: "Versatile weapon", description: "Description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3.0, description: "Weight in kg" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 2, description: "Inventory cells" })
  @IsOptional()
  @IsInt()
  @Min(1)
  cells?: number;

  @ApiPropertyOptional({ example: 150, description: "Price in gold" })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 11, description: "ID типа снаряжения (reference to EquipmentTypeReference)" })
  @IsInt()
  equipmentTypeId: number;

  // Armor properties
  @ApiPropertyOptional({ example: 14, description: "Base armor class" })
  @IsOptional()
  @IsInt()
  baseArmour?: number;

  @ApiPropertyOptional({ example: 2, description: "Armor bonus" })
  @IsOptional()
  @IsInt()
  bonusArmour?: number;

  @ApiPropertyOptional({ example: 3, description: "ID типа брони (reference to ArmourTypeReference)" })
  @IsOptional()
  @IsInt()
  armourTypeId?: number;

  @ApiPropertyOptional({
    type: [Number],
    example: [2],
    description: "Array of StatReference IDs for AC calculation"
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  armourStatRoll?: number[];

  @ApiPropertyOptional({ example: 2, description: "Max stat bonus for armor" })
  @IsOptional()
  @IsInt()
  armourStatRollMaxBonus?: number;

  @ApiPropertyOptional({ example: 16, description: "Total armor class" })
  @IsOptional()
  @IsInt()
  totalArmour?: number;

  // Flags
  @ApiPropertyOptional({ example: false, description: "Is equipped" })
  @IsOptional()
  @IsBoolean()
  isEquiped?: boolean;

  @ApiPropertyOptional({ example: false, description: "Is magic item" })
  @IsOptional()
  @IsBoolean()
  isMagic?: boolean;

  // Weapon properties
  @ApiPropertyOptional({ type: WeaponPropertiesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeaponPropertiesDto)
  weaponProperties?: WeaponPropertiesDto;
}

export class UpdateEquipmentDto {
  @ApiPropertyOptional({ example: "Longsword +1", description: "Equipment name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "Длинный меч +1", description: "Display label" })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ example: "Magic versatile weapon", description: "Description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3.0, description: "Weight in kg" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 2, description: "Inventory cells" })
  @IsOptional()
  @IsInt()
  @Min(1)
  cells?: number;

  @ApiPropertyOptional({ example: 200, description: "Price in gold" })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 11, description: "ID типа снаряжения (reference to EquipmentTypeReference)" })
  @IsOptional()
  @IsInt()
  equipmentTypeId?: number;

  // Armor properties
  @ApiPropertyOptional({ example: 14, description: "Base armor class" })
  @IsOptional()
  @IsInt()
  baseArmour?: number;

  @ApiPropertyOptional({ example: 3, description: "Armor bonus" })
  @IsOptional()
  @IsInt()
  bonusArmour?: number;

  @ApiPropertyOptional({ example: 3, description: "ID типа брони (reference to ArmourTypeReference)" })
  @IsOptional()
  @IsInt()
  armourTypeId?: number;

  @ApiPropertyOptional({
    type: [Number],
    example: [2],
    description: "Array of StatReference IDs for AC calculation"
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  armourStatRoll?: number[];

  @ApiPropertyOptional({ example: 2, description: "Max stat bonus for armor" })
  @IsOptional()
  @IsInt()
  armourStatRollMaxBonus?: number;

  @ApiPropertyOptional({ example: 17, description: "Total armor class" })
  @IsOptional()
  @IsInt()
  totalArmour?: number;

  // Flags
  @ApiPropertyOptional({ example: true, description: "Is equipped" })
  @IsOptional()
  @IsBoolean()
  isEquiped?: boolean;

  @ApiPropertyOptional({ example: true, description: "Is magic item" })
  @IsOptional()
  @IsBoolean()
  isMagic?: boolean;

  // Weapon properties
  @ApiPropertyOptional({ type: WeaponPropertiesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeaponPropertiesDto)
  weaponProperties?: WeaponPropertiesDto;
}
