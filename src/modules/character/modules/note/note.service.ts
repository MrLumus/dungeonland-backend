import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>
  ) {}

  async findNotes(userId: string, characterId: string) {
    const notes = await this.noteRepo.find({
      where: {
        character: {
          id: characterId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!notes) {
      throw new NotFoundException(
        "Заметки не найдены или нет доступа к персонажу"
      );
    }

    return notes;
  }
}
