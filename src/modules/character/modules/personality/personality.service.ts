import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Personality } from "./entities";

@Injectable()
export class PersonalityService {
  constructor(
    @InjectRepository(Personality)
    private readonly personRepo: Repository<Personality>
  ) {}

  async find(userId: string, characterId: string) {
    const personality = await this.personRepo.findOne({
      where: {
        character: {
          id: characterId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!personality) {
      throw new NotFoundException(
        "Настройки личности не найдены или персонаж не принадлежит пользователю"
      );
    }

    return personality;
  }
}
