import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

/**
 * Microservices HTTP Client
 * Handles communication with other microservices
 */
@Injectable()
export class MicroservicesClientService {
  private readonly logger = new Logger(MicroservicesClientService.name);

  // Microservice URLs (from environment or defaults)
  private readonly HEALTH_SERVICE = process.env.HEALTH_SERVICE_URL || "http://health-service:3003";
  private readonly LEVEL_SERVICE = process.env.LEVEL_SERVICE_URL || "http://level-service:3004";
  private readonly SPEED_SERVICE = process.env.SPEED_SERVICE_URL || "http://speed-service:3005";
  private readonly ARMOUR_SERVICE = process.env.ARMOUR_SERVICE_URL || "http://armour-service:3006";
  private readonly STATS_SERVICE = process.env.STATS_SERVICE_URL || "http://stats-service:3007";
  private readonly PERSONALITY_SERVICE = process.env.PERSONALITY_SERVICE_URL || "http://personality-service:3008";
  private readonly NOTE_SERVICE = process.env.NOTE_SERVICE_URL || "http://note-service:3009";
  private readonly EQUIPMENT_SERVICE = process.env.EQUIPMENT_SERVICE_URL || "http://equipment-service:3011";

  constructor(private readonly httpService: HttpService) {}

  /**
   * Create all related entities for a new character across all microservices
   */
  async createRelatedEntities(characterId: string, userId: string, token: string, level?: number): Promise<void> {
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Create entities in parallel for better performance
      await Promise.allSettled([
        this.createHealth(characterId, userId, headers),
        this.createLevel(characterId, userId, headers, level),
        this.createSpeed(characterId, userId, headers),
        this.createArmour(characterId, userId, headers),
        this.createStats(characterId, userId, headers),
        this.createPersonality(characterId, userId, headers),
      ]);

      this.logger.log(`Created all related entities for character ${characterId}`);
    } catch (error) {
      this.logger.error(`Error creating related entities for character ${characterId}:`, error.message);
      // Don't throw - allow character creation to succeed even if some related entities fail
    }
  }

  /**
   * Fetch all related data for a character from all microservices
   */
  async getCharacterCompleteData(characterId: string, userId: string, token: string): Promise<any> {
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [health, level, speed, armour, stats, personality, notes, equipment] = await Promise.allSettled([
        this.getHealth(characterId, userId, headers),
        this.getLevel(characterId, userId, headers),
        this.getSpeed(characterId, userId, headers),
        this.getArmour(characterId, userId, headers),
        this.getStats(characterId, userId, headers),
        this.getPersonality(characterId, userId, headers),
        this.getNotes(characterId, userId, headers),
        this.getEquipment(characterId, userId, headers),
      ]);

      return {
        health: health.status === 'fulfilled' ? health.value : null,
        level: level.status === 'fulfilled' ? level.value : null,
        speed: speed.status === 'fulfilled' ? speed.value : null,
        armour: armour.status === 'fulfilled' ? armour.value : null,
        stats: stats.status === 'fulfilled' ? stats.value : [],
        personality: personality.status === 'fulfilled' ? personality.value : null,
        notes: notes.status === 'fulfilled' ? notes.value : [],
        equipment: equipment.status === 'fulfilled' ? equipment.value : [],
      };
    } catch (error) {
      this.logger.error(`Error fetching complete data for character ${characterId}:`, error.message);
      return {};
    }
  }

  // ==================== Private Methods for Each Service ====================

  private async createHealth(characterId: string, userId: string, headers: any): Promise<void> {
    const url = `${this.HEALTH_SERVICE}/characters/${characterId}/health`;
    await firstValueFrom(
      this.httpService.post(url, { max: 10, current: 10 }, { headers })
    );
  }

  private async createLevel(characterId: string, userId: string, headers: any, level?: number): Promise<void> {
    const url = `${this.LEVEL_SERVICE}/characters/${characterId}/level`;
    await firstValueFrom(
      this.httpService.post(url, { level: level || 1 }, { headers })
    );
  }

  private async createSpeed(characterId: string, userId: string, headers: any): Promise<void> {
    const url = `${this.SPEED_SERVICE}/characters/${characterId}/speed`;
    await firstValueFrom(
      this.httpService.post(url, { baseMovementSpeed: 30 }, { headers })
    );
  }

  private async createArmour(characterId: string, userId: string, headers: any): Promise<void> {
    const url = `${this.ARMOUR_SERVICE}/characters/${characterId}/armour`;
    await firstValueFrom(
      this.httpService.post(url, { baseArmour: 10 }, { headers })
    );
  }

  private async createStats(characterId: string, userId: string, headers: any): Promise<void> {
    const url = `${this.STATS_SERVICE}/characters/${characterId}/stats`;
    await firstValueFrom(
      this.httpService.post(url, {}, { headers }) // Creates all 6 stats (STR, DEX, CON, INT, WIS, CHA)
    );
  }

  private async createPersonality(characterId: string, userId: string, headers: any): Promise<void> {
    const url = `${this.PERSONALITY_SERVICE}/characters/${characterId}/personality`;
    await firstValueFrom(
      this.httpService.post(url, {}, { headers }) // Uses defaults from entity
    );
  }

  private async getHealth(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.HEALTH_SERVICE}/characters/${characterId}/health`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  private async getLevel(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.LEVEL_SERVICE}/characters/${characterId}/level`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  private async getSpeed(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.SPEED_SERVICE}/characters/${characterId}/speed`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  private async getArmour(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.ARMOUR_SERVICE}/characters/${characterId}/armour`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  private async getStats(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.STATS_SERVICE}/characters/${characterId}/stats`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  private async getPersonality(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.PERSONALITY_SERVICE}/characters/${characterId}/personality`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  private async getNotes(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.NOTE_SERVICE}/characters/${characterId}/notes`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  private async getEquipment(characterId: string, userId: string, headers: any): Promise<any> {
    const url = `${this.EQUIPMENT_SERVICE}/characters/${characterId}/equipment`;
    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }
}
