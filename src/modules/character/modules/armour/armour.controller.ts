import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { ArmourService } from "./armour.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Characters/Armour")
@Controller("characters/:characterId/armour")
export class ArmourController {
  constructor(private readonly svc: ArmourService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  find(@Request() req: any, @Param("characterId") characterId: string) {
    return this.svc.findArmour(req.user.userId, characterId);
  }
}
