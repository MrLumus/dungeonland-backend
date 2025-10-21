import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Speed } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class SpeedService {
  constructor(
    @InjectRepository(Speed)
    private readonly speedRepo: Repository<Speed>
  ) {}

  async findSpeed(userId: string, characterId: string) {
    const speed = await this.speedRepo.findOne({
      where: {
        character: {
          id: characterId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!speed) {
      throw new NotFoundException(
        "Настройки скорости не найдены или нет доступа к персонажу"
      );
    }

    return speed;
  }
}
