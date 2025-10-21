import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { PersonalityService } from "./personality.service";

@ApiTags("Characters/Personality")
@Controller("characters/:characterId/personality")
export class PersonalityController {
  constructor(private readonly svc: PersonalityService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  find(@Param("characterId") characterId: string, @Request() req: any) {
    return this.svc.find(req.user.userId, characterId);
  }
}
