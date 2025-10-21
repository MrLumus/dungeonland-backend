import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Level } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private readonly lvlRepo: Repository<Level>
  ) {}

  async find(userId: string, characterId: string) {
    const level = await this.lvlRepo.findOne({
      where: {
        character: {
          id: characterId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!level) {
      throw new NotFoundException(
        "Настройки уровня не найдены или персонаж не принадлежит пользователю"
      );
    }

    return level;
  }
}
