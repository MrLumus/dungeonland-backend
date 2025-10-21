import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { LevelService } from "./level.service";

@ApiTags("Characters/Level")
@Controller("characters/:characterId/level")
export class LevelController {
  constructor(private readonly svc: LevelService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  find(@Param("characterId") characterId: string, @Request() req: any) {
    return this.svc.find(req.user.userId, characterId);
  }
}
