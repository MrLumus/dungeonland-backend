import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "test@email.ru", description: "E-mail пользователя" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "123456789abc", description: "Пароль пользователя" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: "TestUser",
    description: "Отображаемое имя пользователя",
  })
  @IsOptional()
  @IsString()
  displayName?: string;
}
