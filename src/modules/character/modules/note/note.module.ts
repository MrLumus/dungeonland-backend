import { Module } from "@nestjs/common";
import { NoteService } from "./note.service";
import { NoteController } from "./note.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
