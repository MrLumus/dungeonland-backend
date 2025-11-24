import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CharacterStatService } from "../../application/services";

@ApiTags("Characters/CharacterStat")
@Controller("characters/:characterId/stats")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CharacterStatController {
  constructor(private readonly service: CharacterStatService) {}

  @Post()
  @ApiOperation({ summary: "Create all 6 stats for character (STR, DEX, CON, INT, WIS, CHA)" })
  createAll(@Request() req: any, @Param("characterId") characterId: string) {
    return this.service.createAllForCharacter(req.user.userId, characterId);
  }

  @Get()
  @ApiOperation({ summary: "Get stats for character" })
  findAll(@Request() req: any, @Param("characterId") characterId: string) {
    return this.service.findByCharacter(req.user.userId, characterId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get CharacterStat by ID" })
  findOne(@Request() req: any, @Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update CharacterStat" })
  update(
    @Request() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.update(req.user.userId, id, dto);
  }
}
