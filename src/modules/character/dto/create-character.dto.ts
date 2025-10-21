import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsInt, Min } from "class-validator";

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

  @ApiPropertyOptional({ example: "1", description: "Уровень персонажа" })
  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;
}
