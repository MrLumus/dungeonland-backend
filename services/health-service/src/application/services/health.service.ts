import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Health } from "../../domain/entities";

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Health)
    private readonly repository: Repository<Health>
  ) {}

  async create(userId: string, characterId: string, dto: any) {
    const item = this.repository.create({
      ...dto,
      characterId,
    });
    return this.repository.save(item);
  }

  async findByCharacter(userId: string, characterId: string) {
    const items = await this.repository.find({
      where: { characterId }
    });
    return items;
  }

  async findOne(userId: string, id: string) {
    const item = await this.repository.findOne({
      where: { id }
    });

    if (!item) {
      throw new NotFoundException('Health not found');
    }

    return item;
  }

  async update(userId: string, id: string, dto: any) {
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }
}
