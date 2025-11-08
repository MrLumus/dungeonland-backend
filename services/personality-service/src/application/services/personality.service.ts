import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Personality } from "../../domain/entities";

@Injectable()
export class PersonalityService {
  constructor(
    @InjectRepository(Personality)
    private readonly repository: Repository<Personality>
  ) {}

  async create(userId: string, characterId: string, dto: any) {
    const item = this.repository.create({
      ...dto,
      characterId,
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
      throw new NotFoundException('Personality not found');
    }

    return item;
  }

  async update(userId: string, id: string, dto: any) {
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }
}
