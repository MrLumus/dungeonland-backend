import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Health } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Health)
    private readonly healthRepo: Repository<Health>
  ) {}

  async findHealth(userId: string, characterId: string) {
    const health = await this.healthRepo.findOne({
      where: {
        character: {
          id: characterId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!health) {
      throw new NotFoundException(
        "Настройки здоровья не найдены или нет доступа к персонажу"
      );
    }

    return health;
  }
}
