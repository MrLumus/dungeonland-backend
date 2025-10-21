import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { NormalizeService } from "./normalize.service";

@ApiTags("Normalize")
@Controller("normalize")
export class NormalizeController {
  constructor(private readonly svc: NormalizeService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("characters")
  @ApiResponse({ status: 201, description: "Успешная нормализация персонажей" })
  @ApiResponse({ status: 400, description: "Невалидный запрос" })
  @ApiResponse({ status: 401, description: "Пользователь не авторизован" })
  characters() {
    return this.svc.normalizeCharacters();
  }
}
