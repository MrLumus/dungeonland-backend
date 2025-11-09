import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import {
  EEquipmentTypes,
  EArmourTypes,
  EDamageTypes,
  ECharacteristics,
  EDiceTypes,
} from "../../domain/constants";

// Nested DTOs for weapon properties
export class WeaponDamageHandDto {
  @ApiProperty({ example: 2, description: "Количество кубиков" })
  @IsNumber()
  diceCount: number;

  @ApiProperty({ enum: EDiceTypes, example: EDiceTypes.D6 })
  @IsEnum(EDiceTypes)
  diceType: EDiceTypes;

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

  @ApiPropertyOptional({ enum: EDamageTypes, example: EDamageTypes.Slashing })
  @IsOptional()
  @IsEnum(EDamageTypes)
  damageType?: EDamageTypes;

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

  @ApiPropertyOptional({ enum: ECharacteristics, example: ECharacteristics.STR })
  @IsOptional()
  @IsEnum(ECharacteristics)
  statRoll?: ECharacteristics;

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
  @IsNumber()
  @Min(1)
  cells?: number;

  @ApiPropertyOptional({ example: 150, description: "Price in gold" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ enum: EEquipmentTypes, example: EEquipmentTypes.Sword })
  @IsEnum(EEquipmentTypes)
  type: EEquipmentTypes;

  // Armor properties
  @ApiPropertyOptional({ example: 14, description: "Base armor class" })
  @IsOptional()
  @IsNumber()
  baseArmour?: number;

  @ApiPropertyOptional({ example: 2, description: "Armor bonus" })
  @IsOptional()
  @IsNumber()
  bonusArmour?: number;

  @ApiPropertyOptional({ enum: EArmourTypes, example: EArmourTypes.Medium })
  @IsOptional()
  @IsEnum(EArmourTypes)
  armourType?: EArmourTypes;

  @ApiPropertyOptional({
    enum: ECharacteristics,
    isArray: true,
    example: [ECharacteristics.DEX],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ECharacteristics, { each: true })
  armourStatRoll?: ECharacteristics[];

  @ApiPropertyOptional({ example: 2, description: "Max stat bonus for armor" })
  @IsOptional()
  @IsNumber()
  armourStatRollMaxBonus?: number;

  @ApiPropertyOptional({ example: 16, description: "Total armor class" })
  @IsOptional()
  @IsNumber()
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
  @IsNumber()
  @Min(1)
  cells?: number;

  @ApiPropertyOptional({ example: 200, description: "Price in gold" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: EEquipmentTypes, example: EEquipmentTypes.Sword })
  @IsOptional()
  @IsEnum(EEquipmentTypes)
  type?: EEquipmentTypes;

  // Armor properties
  @ApiPropertyOptional({ example: 14, description: "Base armor class" })
  @IsOptional()
  @IsNumber()
  baseArmour?: number;

  @ApiPropertyOptional({ example: 3, description: "Armor bonus" })
  @IsOptional()
  @IsNumber()
  bonusArmour?: number;

  @ApiPropertyOptional({ enum: EArmourTypes, example: EArmourTypes.Medium })
  @IsOptional()
  @IsEnum(EArmourTypes)
  armourType?: EArmourTypes;

  @ApiPropertyOptional({
    enum: ECharacteristics,
    isArray: true,
    example: [ECharacteristics.DEX],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ECharacteristics, { each: true })
  armourStatRoll?: ECharacteristics[];

  @ApiPropertyOptional({ example: 2, description: "Max stat bonus for armor" })
  @IsOptional()
  @IsNumber()
  armourStatRollMaxBonus?: number;

  @ApiPropertyOptional({ example: 17, description: "Total armor class" })
  @IsOptional()
  @IsNumber()
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
