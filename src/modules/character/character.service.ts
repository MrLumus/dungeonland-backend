import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Character } from "./entities";
import { CreateCharacterDto, UpdateCharacterDto } from "./dto";
import { CharacterSkill, CharacterStat } from "@stats/entities";
import { Level } from "@level/entities";
import { LEVELS_CONFIG } from "@level/constants";
import { Health } from "@health/entities";
import { StatReference } from "@reference/entities";

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly charRepo: Repository<Character>,
    @InjectRepository(StatReference)
    private readonly statsRepo: Repository<StatReference>,
    @InjectRepository(CharacterStat)
    private readonly charStatsRepo: Repository<CharacterStat>,
    @InjectRepository(CharacterSkill)
    private readonly charSkillsRepo: Repository<CharacterSkill>,
    @InjectRepository(Level)
    private readonly levelRepo: Repository<Level>
  ) {}

  async create(userId: string, dto: CreateCharacterDto) {
    const character: Character = this.charRepo.create({
      ...dto,
      user: { id: userId },
    } as DeepPartial<Character>);

    // Заполнение уровня, на основе уровня из dto
    const { from, to, mastery } = LEVELS_CONFIG[dto.level || 1];
    character.level = this.levelRepo.create({
      expFrom: from,
      expTo: to,
      expCurrent: from,
      mastery,
      level: dto.level || 1,
    });

    // Создание новой записи о здоровье
    character.health = new Health();

    // Поиск всех характеристик из таблицы с референсами
    const statsRefs = await this.statsRepo.find({
      relations: ["skills"],
    });

    // Заполнение характеристик персонажа на основе референсов
    character.stats = statsRefs.map((statRef) =>
      this.charStatsRepo.create({
        stat: statRef,
        // Заполнение скиллов у каждой характеристики, на основе референса
        skills: statRef.skills.map((skillRef) =>
          this.charSkillsRepo.create({ skill: skillRef })
        ),
      })
    );

    return this.charRepo.save(character);
  }

  findAllForUser(userId: string) {
    return this.charRepo.find({ where: { user: { id: userId } } });
  }

  async findOneForUser(userId: string, id: string) {
    const c = await this.charRepo.findOne({
      where: { id, user: { id: userId } },
      relations: [
        "stats",
        "stats.skills",
        "attacks",
        "spells",
        "inventory",
        "notes",
        "user",
      ],
    });
    if (!c) throw new NotFoundException("Character not found");
    return c;
  }

  async update(userId: string, id: string, dto: UpdateCharacterDto) {
    const c = await this.charRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!c) throw new NotFoundException("Character not found");
    Object.assign(c, dto);
    return this.charRepo.save(c);
  }

  async remove(userId: string, id: string) {
    const c = await this.charRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!c) throw new NotFoundException("Character not found");
    await this.charRepo.delete(id);
    return { success: true };
  }
}
