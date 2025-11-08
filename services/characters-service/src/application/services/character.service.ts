import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Character } from "@domain/entities";
import { CreateCharacterDto, UpdateCharacterDto } from "@application/dto";

/**
 * Character Application Service
 * Handles character management business logic
 */
@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepo: Repository<Character>
  ) {}

  async create(userId: string, dto: CreateCharacterDto): Promise<Character> {
    const character = this.characterRepo.create({
      ...dto,
      userId, // Store userId as reference to Auth service
    });

    return this.characterRepo.save(character);
  }

  async findAllForUser(userId: string): Promise<Character[]> {
    return this.characterRepo.find({
      where: { userId },
      relations: ['attacks', 'spells', 'inventory']
    });
  }

  async findOneForUser(userId: string, id: string): Promise<Character> {
    const character = await this.characterRepo.findOne({
      where: { id, userId },
      relations: ['attacks', 'spells', 'inventory']
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    return character;
  }

  async update(userId: string, id: string, dto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterRepo.findOne({
      where: { id, userId }
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    Object.assign(character, dto);
    return this.characterRepo.save(character);
  }

  async remove(userId: string, id: string): Promise<{ success: boolean }> {
    const character = await this.characterRepo.findOne({
      where: { id, userId }
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    await this.characterRepo.delete(id);
    return { success: true };
  }
}
