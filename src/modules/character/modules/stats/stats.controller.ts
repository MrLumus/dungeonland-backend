import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Character/Stats")
@Controller("characters/:characterId/stats")
export class StatsController {
  constructor(private readonly svc: StatsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("/all-stats")
  findAllStats(@Request() req: any, @Param("characterId") characterId: string) {
    return this.svc.findCharacterStats(req.user.userId, characterId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/all-skills")
  findAllSkills(
    @Request() req: any,
    @Param("characterId") characterId: string
  ) {
    return this.svc.findCharacterSkills(req.user.userId, characterId);
  }
}
