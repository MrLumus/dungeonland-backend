import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CharacterStat } from "../../domain/entities";

@Injectable()
export class CharacterStatService {
  constructor(
    @InjectRepository(CharacterStat)
    private readonly repository: Repository<CharacterStat>
  ) {}

  async findByCharacter(userId: string, characterId: string) {
    const items = await this.repository.find({
      where: { characterId }
    });
    return items;
  }

  async findOne(userId: string, id: number) {
    const item = await this.repository.findOne({
      where: { id }
    });

    if (!item) {
      throw new NotFoundException('CharacterStat not found');
    }

    return item;
  }

  async update(userId: string, id: number, dto: any) {
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }
}
