import { IsOptional, IsString, IsInt, Min, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCharacterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  race?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  class?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  initiative?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  money?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasInspiration?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  exhaustion?: number;
}
