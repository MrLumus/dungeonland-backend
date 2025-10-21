import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { NoteService } from "./note.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Characters/Note")
@Controller("characters/:characterId/note")
export class NoteController {
  constructor(private readonly svc: NoteService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  find(@Request() req: any, @Param("characterId") characterId: string) {
    return this.svc.findNotes(req.user.userId, characterId);
  }
}
