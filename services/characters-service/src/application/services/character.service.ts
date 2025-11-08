import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Character } from "../../domain/entities";
import { CreateCharacterDto, UpdateCharacterDto } from "../dto";
import { MicroservicesClientService } from "../../infrastructure/http/microservices-client.service";

/**
 * Character Application Service
 * Handles character management business logic
 */
@Injectable()
export class CharacterService {
  private readonly logger = new Logger(CharacterService.name);

  constructor(
    @InjectRepository(Character)
    private readonly characterRepo: Repository<Character>,
    private readonly microservicesClient: MicroservicesClientService
  ) {}

  async create(userId: string, dto: CreateCharacterDto, token: string): Promise<Character> {
    const character = this.characterRepo.create({
      ...dto,
      userId, // Store userId as reference to Auth service
    });

    const savedCharacter = await this.characterRepo.save(character);

    // Create related entities in other microservices (async, non-blocking)
    this.microservicesClient
      .createRelatedEntities(savedCharacter.id, userId, token, dto.level)
      .catch((error) => {
        this.logger.error(`Failed to create related entities for character ${savedCharacter.id}:`, error.message);
      });

    return savedCharacter;
  }

  async findAllForUser(userId: string): Promise<Character[]> {
    return this.characterRepo.find({
      where: { userId },
      relations: ['attacks', 'spells', 'inventory']
    });
  }

  async findOneForUser(userId: string, id: string, token: string): Promise<any> {
    const character = await this.characterRepo.findOne({
      where: { id, userId },
      relations: ['attacks', 'spells', 'inventory']
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    // Fetch related data from other microservices
    const relatedData = await this.microservicesClient.getCharacterCompleteData(
      character.id,
      userId,
      token
    );

    // Merge character data with related data from other services
    return {
      ...character,
      ...relatedData,
    };
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
