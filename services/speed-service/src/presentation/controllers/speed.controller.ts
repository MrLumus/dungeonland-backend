import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SpeedService } from "../../application/services";

@ApiTags("Characters/Speed")
@Controller("characters/:characterId/speed")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SpeedController {
  constructor(private readonly service: SpeedService) {}

  @Post()
  @ApiOperation({ summary: "Create Speed for character" })
  create(
    @Request() req: any,
    @Param("characterId") characterId: string,
    @Body() dto: any
  ) {
    return this.service.create(req.user.userId, characterId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get speed for character" })
  findAll(@Request() req: any, @Param("characterId") characterId: string) {
    return this.service.findByCharacter(req.user.userId, characterId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Speed by ID" })
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.service.findOne(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update Speed" })
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: any
  ) {
    return this.service.update(req.user.userId, id, dto);
  }
}
