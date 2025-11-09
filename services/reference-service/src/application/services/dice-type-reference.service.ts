import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiceTypeReference } from "../../domain/entities";

@Injectable()
export class DiceTypeReferenceService {
  constructor(
    @InjectRepository(DiceTypeReference)
    private readonly repository: Repository<DiceTypeReference>
  ) {}

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('DiceTypeReference not found');
    }
    return item;
  }

  async findByCode(code: string) {
    const item = await this.repository.findOne({ where: { code } });
    if (!item) {
      throw new NotFoundException('DiceTypeReference not found');
    }
    return item;
  }

  async create(dto: any) {
    const item = this.repository.create(dto);
    return this.repository.save(item);
  }

  async update(id: number, dto: any) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async delete(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
  }
}
