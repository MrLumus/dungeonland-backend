import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetStatSkillByNameDto {
  @ApiProperty({
    example: "тика",
    description: "Название характеристики или его часть",
  })
  @IsString()
  searchText: string;
}
