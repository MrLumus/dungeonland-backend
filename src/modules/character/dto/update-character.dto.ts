
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  race?: string;

  @IsOptional()
  @IsString()
  class?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;
}
