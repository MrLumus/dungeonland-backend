import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { PersonalityService } from "../../application/services";

@ApiTags("Characters/Personality")
@Controller("characters/:characterId/personality")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PersonalityController {
  constructor(private readonly service: PersonalityService) {}

  @Get()
  @ApiOperation({ summary: "Get personality for character" })
  findAll(@Request() req: any, @Param("characterId") characterId: string) {
    return this.service.findByCharacter(req.user.userId, characterId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Personality by ID" })
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.service.findOne(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update Personality" })
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: any
  ) {
    return this.service.update(req.user.userId, id, dto);
  }
}
