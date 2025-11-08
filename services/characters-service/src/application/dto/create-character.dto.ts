import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsInt, Min, IsNumber } from "class-validator";

export class CreateCharacterDto {
  @ApiProperty({ example: "Гендальф Белый", description: "Имя персонажа" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: "Человек", description: "Раса персонажа" })
  @IsOptional()
  @IsString()
  race?: string;

  @ApiPropertyOptional({ example: "Волшебник", description: "Класс персонажа" })
  @IsOptional()
  @IsString()
  class?: string;

  @ApiPropertyOptional({ example: 0, description: "Инициатива" })
  @IsOptional()
  @IsNumber()
  initiative?: number;

  @ApiPropertyOptional({ example: 100, description: "Деньги" })
  @IsOptional()
  @IsNumber()
  money?: number;
}
