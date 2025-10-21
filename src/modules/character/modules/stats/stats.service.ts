import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CharacterSkill, CharacterStat } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(CharacterStat)
    private readonly statRepo: Repository<CharacterStat>,
    @InjectRepository(CharacterSkill)
    private readonly skillRepo: Repository<CharacterSkill>
  ) {}

  async findCharacterStats(userId: string, characterId: string) {
    const stats = this.statRepo.find({
      where: {
        character: {
          user: {
            id: userId,
          },
          id: characterId,
        },
      },
    });

    if (!stats) {
      throw new NotFoundException(
        "Характеристики не найдены или нет доступа к персонажу"
      );
    }

    return stats;
  }

  async findCharacterSkills(userId: string, characterId: string) {
    const skills = this.skillRepo.find({
      where: {
        characterStat: {
          character: {
            user: {
              id: userId,
            },
            id: characterId,
          },
        },
      },
    });

    if (!skills) {
      throw new NotFoundException(
        "Умения не найдены или нет доступа к персонажу"
      );
    }

    return skills;
  }
}
