import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class GetStatSkillByIdDto {
  @ApiProperty({ example: 1, description: "ID характеристики" })
  @IsNumber()
  id: number;
}
