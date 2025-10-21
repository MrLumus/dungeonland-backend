import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SpeedService } from "./speed.service";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Characters/Speed")
@Controller("characters/:characterId/speed")
export class SpeedController {
  constructor(private readonly svc: SpeedService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  find(@Request() req: any, @Param("characterId") characterId: string) {
    return this.svc.findSpeed(req.user.userId, characterId);
  }
}
