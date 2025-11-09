import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Equipment } from "../../domain/entities";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class EquipmentService {
  private readonly logger = new Logger(EquipmentService.name);
  private readonly REFERENCE_SERVICE = process.env.REFERENCE_SERVICE_URL || "http://reference-service:3010";

  constructor(
    @InjectRepository(Equipment)
    private readonly repository: Repository<Equipment>,
    private readonly httpService: HttpService
  ) {}

  async create(userId: string, characterId: string, dto: any) {
    const item = this.repository.create({
      ...dto,
      characterId,
    });
    const saved = await this.repository.save(item);
    
    // Return enriched data
    return this.enrichSingleEquipment(saved);
  }

  async findByCharacter(userId: string, characterId: string) {
    const items = await this.repository.find({
      where: { characterId }
    });
    
    // Enrich with reference data
    return this.enrichEquipmentArray(items);
  }

  async findOne(userId: string, id: string) {
    const item = await this.repository.findOne({
      where: { id }
    });

    if (!item) {
      throw new NotFoundException('Equipment not found');
    }

    // Return enriched data
    return this.enrichSingleEquipment(item);
  }

  async update(userId: string, id: string, dto: any) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Equipment not found');
    }
    Object.assign(item, dto);
    const saved = await this.repository.save(item);
    
    // Return enriched data
    return this.enrichSingleEquipment(saved);
  }

  async delete(userId: string, id: string) {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Equipment not found');
    }
    await this.repository.remove(item);
  }

  /**
   * Enrich array of equipment with reference data
   */
  private async enrichEquipmentArray(items: Equipment[]): Promise<any[]> {
    if (!items || items.length === 0) {
      return [];
    }

    try {
      // Fetch all reference data in parallel
      const [equipmentTypes, armourTypes, damageTypes, diceTypes, stats] = await Promise.all([
        this.fetchEquipmentTypes(),
        this.fetchArmourTypes(),
        this.fetchDamageTypes(),
        this.fetchDiceTypes(),
        this.fetchStats(),
      ]);

      // Create maps for quick lookup
      const equipmentTypeMap = new Map(equipmentTypes.map((et: any) => [et.id, et]));
      const armourTypeMap = new Map(armourTypes.map((at: any) => [at.id, at]));
      const damageTypeMap = new Map(damageTypes.map((dt: any) => [dt.id, dt]));
      const diceTypeMap = new Map(diceTypes.map((dt: any) => [dt.id, dt]));
      const statMap = new Map(stats.map((s: any) => [s.id, s]));

      // Enrich each equipment item
      return items.map(item => this.enrichEquipmentItem(
        item, 
        equipmentTypeMap, 
        armourTypeMap, 
        damageTypeMap, 
        diceTypeMap, 
        statMap
      ));
    } catch (error) {
      this.logger.error('Failed to enrich equipment with reference data:', error.message);
      // Return items without enrichment if reference-service is unavailable
      return items;
    }
  }

  /**
   * Enrich single equipment item with reference data
   */
  private async enrichSingleEquipment(item: Equipment): Promise<any> {
    try {
      // Fetch all reference data in parallel
      const [equipmentTypes, armourTypes, damageTypes, diceTypes, stats] = await Promise.all([
        this.fetchEquipmentTypes(),
        this.fetchArmourTypes(),
        this.fetchDamageTypes(),
        this.fetchDiceTypes(),
        this.fetchStats(),
      ]);

      // Create maps for quick lookup
      const equipmentTypeMap = new Map(equipmentTypes.map((et: any) => [et.id, et]));
      const armourTypeMap = new Map(armourTypes.map((at: any) => [at.id, at]));
      const damageTypeMap = new Map(damageTypes.map((dt: any) => [dt.id, dt]));
      const diceTypeMap = new Map(diceTypes.map((dt: any) => [dt.id, dt]));
      const statMap = new Map(stats.map((s: any) => [s.id, s]));

      return this.enrichEquipmentItem(
        item, 
        equipmentTypeMap, 
        armourTypeMap, 
        damageTypeMap, 
        diceTypeMap, 
        statMap
      );
    } catch (error) {
      this.logger.error('Failed to enrich equipment with reference data:', error.message);
      // Return item without enrichment if reference-service is unavailable
      return item;
    }
  }

  /**
   * Enrich equipment item using reference maps
   */
  private enrichEquipmentItem(
    item: Equipment,
    equipmentTypeMap: Map<number, any>,
    armourTypeMap: Map<number, any>,
    damageTypeMap: Map<number, any>,
    diceTypeMap: Map<number, any>,
    statMap: Map<number, any>
  ): any {
    const enriched: any = {
      id: item.id,
      characterId: item.characterId,
      name: item.name,
      label: item.label,
      description: item.description,
      weight: item.weight,
      cells: item.cells,
      price: item.price,
      equipmentType: equipmentTypeMap.get(item.equipmentTypeId) || null,
      isEquiped: item.isEquiped,
      isMagic: item.isMagic,
    };

    // Enrich armor properties
    if (item.baseArmour !== null && item.baseArmour !== undefined) {
      enriched.baseArmour = item.baseArmour;
    }
    if (item.bonusArmour !== null && item.bonusArmour !== undefined) {
      enriched.bonusArmour = item.bonusArmour;
    }
    if (item.armourTypeId) {
      enriched.armourType = armourTypeMap.get(item.armourTypeId) || null;
    }
    if (item.armourStatRoll && item.armourStatRoll.length > 0) {
      enriched.armourStatRoll = item.armourStatRoll.map(statId => statMap.get(statId) || null);
    }
    if (item.armourStatRollMaxBonus !== null && item.armourStatRollMaxBonus !== undefined) {
      enriched.armourStatRollMaxBonus = item.armourStatRollMaxBonus;
    }
    if (item.totalArmour !== null && item.totalArmour !== undefined) {
      enriched.totalArmour = item.totalArmour;
    }

    // Enrich weapon properties
    if (item.weaponProperties) {
      enriched.weaponProperties = {
        ...item.weaponProperties,
        damageType: item.weaponProperties.damageTypeId 
          ? damageTypeMap.get(item.weaponProperties.damageTypeId) || null 
          : null,
        statRoll: item.weaponProperties.statRollId 
          ? statMap.get(item.weaponProperties.statRollId) || null 
          : null,
      };

      // Enrich damage dice types
      if (item.weaponProperties.damage) {
        enriched.weaponProperties.damage = {};
        
        if (item.weaponProperties.damage.oneHanded) {
          enriched.weaponProperties.damage.oneHanded = {
            ...item.weaponProperties.damage.oneHanded,
            diceType: diceTypeMap.get(item.weaponProperties.damage.oneHanded.diceTypeId) || null,
          };
        }

        if (item.weaponProperties.damage.twoHanded) {
          enriched.weaponProperties.damage.twoHanded = {
            ...item.weaponProperties.damage.twoHanded,
            diceType: diceTypeMap.get(item.weaponProperties.damage.twoHanded.diceTypeId) || null,
          };
        }
      }
    }

    return enriched;
  }

  /**
   * Fetch equipment types from reference-service
   */
  private async fetchEquipmentTypes(): Promise<any[]> {
    const url = `${this.REFERENCE_SERVICE}/equipment-types`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data || [];
  }

  /**
   * Fetch armour types from reference-service
   */
  private async fetchArmourTypes(): Promise<any[]> {
    const url = `${this.REFERENCE_SERVICE}/armour-types`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data || [];
  }

  /**
   * Fetch damage types from reference-service
   */
  private async fetchDamageTypes(): Promise<any[]> {
    const url = `${this.REFERENCE_SERVICE}/damage-types`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data || [];
  }

  /**
   * Fetch dice types from reference-service
   */
  private async fetchDiceTypes(): Promise<any[]> {
    const url = `${this.REFERENCE_SERVICE}/dice-types`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data || [];
  }

  /**
   * Fetch stats from reference-service
   */
  private async fetchStats(): Promise<any[]> {
    const url = `${this.REFERENCE_SERVICE}/stats`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data || [];
  }
}
