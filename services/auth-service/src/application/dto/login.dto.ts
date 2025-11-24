import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "test@email.ru", description: "E-mail пользователя" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "123456789abc", description: "Пароль пользователя" })
  @IsString()
  password: string;
}
