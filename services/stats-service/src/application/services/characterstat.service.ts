import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CharacterStat, CharacterSkill } from "../../domain/entities";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CharacterStatService {
  private readonly logger = new Logger(CharacterStatService.name);
  private readonly REFERENCE_SERVICE = process.env.REFERENCE_SERVICE_URL || "http://reference-service:3010";

  constructor(
    @InjectRepository(CharacterStat)
    private readonly repository: Repository<CharacterStat>,
    @InjectRepository(CharacterSkill)
    private readonly skillRepository: Repository<CharacterSkill>,
    private readonly httpService: HttpService
  ) {}

  /**
   * Create all 6 character stats based on StatReference data from reference-service
   */
  async createAllForCharacter(userId: string, characterId: string): Promise<CharacterStat[]> {
    try {
      // Fetch all stat references from reference-service
      const url = `${this.REFERENCE_SERVICE}/stats`;
      const response = await firstValueFrom(this.httpService.get(url));
      const statsRefs = response.data;

      if (!statsRefs || statsRefs.length === 0) {
        this.logger.warn('No stat references found in reference-service');
        return [];
      }

      // Create CharacterStat for each StatReference
      const characterStats: CharacterStat[] = [];

      for (const statRef of statsRefs) {
        const characterStat = this.repository.create({
          characterId,
          statId: statRef.id,
          stat_value: 10, // Default value
          check_value: 0,
          check_bonus: 0,
          save_throw__value: 0,
          save_throw__bonus: 0,
          save_throw_proficient: false,
        });

        // Create CharacterSkills for each SkillReference
        if (statRef.skills && statRef.skills.length > 0) {
          characterStat.skills = statRef.skills.map((skillRef: any) =>
            this.skillRepository.create({
              skillId: skillRef.id,
              value: 0,
              bonus: 0,
              proficient: 0,
            })
          );
        }

        characterStats.push(characterStat);
      }

      // Save all stats with their skills (cascade)
      return await this.repository.save(characterStats);
    } catch (error) {
      this.logger.error(`Failed to create stats for character ${characterId}:`, error.message);
      throw error;
    }
  }

  async findByCharacter(userId: string, characterId: string) {
    const items = await this.repository.find({
      where: { characterId },
      relations: ['skills']
    });

    // Enrich with reference data (stat names, skill names)
    try {
      const url = `${this.REFERENCE_SERVICE}/stats`;
      const response = await firstValueFrom(this.httpService.get(url));
      const statsRefs = response.data;

      // Create maps for quick lookup
      const statRefMap = new Map();
      const skillRefMap = new Map();

      for (const statRef of statsRefs) {
        statRefMap.set(statRef.id, statRef);
        if (statRef.skills) {
          for (const skillRef of statRef.skills) {
            skillRefMap.set(skillRef.id, skillRef);
          }
        }
      }

      // Enrich CharacterStats with reference data
      return items.map(characterStat => {
        const statRef = statRefMap.get(characterStat.statId);

        // Build enriched stat (exclude statId to avoid duplication)
        const enrichedStat: any = {
          id: characterStat.id,
          characterId: characterStat.characterId,
          stat_value: characterStat.stat_value,
          check_value: characterStat.check_value,
          check_bonus: characterStat.check_bonus,
          save_throw__value: characterStat.save_throw__value,
          save_throw__bonus: characterStat.save_throw__bonus,
          save_throw_proficient: characterStat.save_throw_proficient,
          stat: statRef ? { id: statRef.id, code: statRef.code, name: statRef.name } : null
        };

        // Enrich skills (exclude skillId to avoid duplication)
        if (characterStat.skills) {
          enrichedStat.skills = characterStat.skills.map(characterSkill => {
            const skillRef = skillRefMap.get(characterSkill.skillId);
            return {
              id: characterSkill.id,
              value: characterSkill.value,
              bonus: characterSkill.bonus,
              proficient: characterSkill.proficient,
              skill: skillRef ? { id: skillRef.id, name: skillRef.name } : null
            };
          });
        }

        return enrichedStat;
      });
    } catch (error) {
      this.logger.error('Failed to enrich stats with reference data:', error.message);
      // Return stats without enrichment if reference-service is unavailable
      return items;
    }
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
