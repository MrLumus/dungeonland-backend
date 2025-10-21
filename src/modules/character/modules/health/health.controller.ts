import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { HealthService } from "./health.service";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Characters/Health")
@Controller("characters/:characterId/health")
export class HealthController {
  constructor(private readonly svc: HealthService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  find(@Request() req: any, @Param("characterId") characterId: string) {
    return this.svc.findHealth(req.user.userId, characterId);
  }
}
