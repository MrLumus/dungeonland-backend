import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ReferenceService } from "./reference.service";
import { AuthGuard } from "@nestjs/passport";
import { GetStatSkillByIdDto, GetStatSkillByNameDto } from "./dto";

@ApiTags("Reference")
@Controller("reference")
export class ReferenceController {
  constructor(private readonly svc: ReferenceService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("/all-stats")
  findAllStats() {
    return this.svc.finAllStats();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/all-skills")
  findAllSkills() {
    return this.svc.findAllSkills();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/all-stats-skills")
  findAllStatsSkills() {
    return this.svc.finAllStatsSkills();
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("/stat-by-id")
  findStatById(@Body() dto: GetStatSkillByIdDto) {
    return this.svc.findStatById(dto.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("/skill-by-id")
  findSkillById(@Body() dto: GetStatSkillByIdDto) {
    return this.svc.findSkillById(dto.id);
  }
}
