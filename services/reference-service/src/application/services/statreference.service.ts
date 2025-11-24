import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StatReference } from "../../domain/entities";

@Injectable()
export class StatReferenceService {
  constructor(
    @InjectRepository(StatReference)
    private readonly repository: Repository<StatReference>
  ) {}

  async findAll() {
    const items = await this.repository.find({
      relations: ['skills']
    });
    return items;
  }

  async findOne(id: number) {
    const item = await this.repository.findOne({
      where: { id },
      relations: ['skills']
    });

    if (!item) {
      throw new NotFoundException('StatReference not found');
    }

    return item;
  }

  async findByCode(code: string) {
    const item = await this.repository.findOne({
      where: { code },
      relations: ['skills']
    });

    if (!item) {
      throw new NotFoundException('StatReference not found');
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
