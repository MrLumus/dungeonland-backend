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
import { NoteService } from "../../application/services";

@ApiTags("Characters/Note")
@Controller("characters/:characterId/notes")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class NoteController {
  constructor(private readonly service: NoteService) {}

  @Post()
  @ApiOperation({ summary: "Create Note for character" })
  create(
    @Request() req: any,
    @Param("characterId") characterId: string,
    @Body() dto: any
  ) {
    return this.service.create(req.user.userId, characterId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get notes for character" })
  findAll(@Request() req: any, @Param("characterId") characterId: string) {
    return this.service.findByCharacter(req.user.userId, characterId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Note by ID" })
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.service.findOne(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update Note" })
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: any
  ) {
    return this.service.update(req.user.userId, id, dto);
  }
}
