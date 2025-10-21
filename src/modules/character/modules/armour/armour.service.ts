import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Armour } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class ArmourService {
  constructor(
    @InjectRepository(Armour)
    private readonly armourRepo: Repository<Armour>
  ) {}

  async findArmour(userId: string, characterId: string) {
    const armour = await this.armourRepo.findOne({
      where: {
        character: {
          id: characterId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!armour) {
      throw new NotFoundException(
        "Настройки брони не найдены или нет доступа к персонажу"
      );
    }

    return armour;
  }
}
