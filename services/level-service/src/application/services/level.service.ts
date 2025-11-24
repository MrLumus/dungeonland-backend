import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Level } from "../../domain/entities";
import { LEVELS_CONFIG } from "../../domain/constants";

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private readonly repository: Repository<Level>
  ) {}

  async create(userId: string, characterId: string, dto: any) {
    const levelValue = dto.level || 1;
    const { from, to, mastery } = LEVELS_CONFIG[levelValue];

    const item = this.repository.create({
      characterId,
      level: levelValue,
      expFrom: from,
      expTo: to,
      expCurrent: from,
      mastery,
    });
    return this.repository.save(item);
  }

  async findByCharacter(userId: string, characterId: string) {
    const item = await this.repository.findOne({
      where: { characterId }
    });
    return item; // Returns single object or null
  }

  async findOne(userId: string, id: string) {
    const item = await this.repository.findOne({
      where: { id }
    });

    if (!item) {
      throw new NotFoundException('Level not found');
    }

    return item;
  }

  async update(userId: string, id: string, dto: any) {
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }
}
