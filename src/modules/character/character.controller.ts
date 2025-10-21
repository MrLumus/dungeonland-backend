import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateCharacterDto, UpdateCharacterDto } from "./dto";
import { CharacterService } from "./character.service";

@ApiTags("Characters")
@Controller("characters")
export class CharacterController {
  constructor(private readonly svc: CharacterService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  @ApiResponse({ status: 201, description: "Успешное создание персонажа" })
  @ApiResponse({ status: 400, description: "Невалидный payload" })
  @ApiResponse({ status: 401, description: "Пользователь не авторизован" })
  create(@Request() req: any, @Body() dto: CreateCharacterDto) {
    return this.svc.create(req.user.userId, dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  findAll(@Request() req: any) {
    return this.svc.findAllForUser(req.user.userId);
  }

  @ApiResponse({ status: 200, description: "Успешное получение персонажа" })
  @ApiResponse({ status: 400, description: "Невалидный запрос" })
  @ApiResponse({ status: 401, description: "Пользователь не авторизован" })
  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.svc.findOneForUser(req.user.userId, id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateCharacterDto
  ) {
    return this.svc.update(req.user.userId, id, dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  remove(@Request() req: any, @Param("id") id: string) {
    return this.svc.remove(req.user.userId, id);
  }
}
