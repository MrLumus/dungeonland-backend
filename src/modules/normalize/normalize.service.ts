import { Injectable } from "@nestjs/common";
import { Character } from "@character/entities";
import { Repository } from "typeorm";
import { Level } from "@level/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { NormalizeCharactersHistory } from "./entities";
import { CharacterSkill, CharacterStat } from "@stats/entities";
import { Personality } from "@personality/entities";
import { LEVELS_CONFIG } from "@level/constants";
import { StatReference } from "@reference/entities";
import { Health } from "@health/entities";
import { Armour } from "@armour/entities";
import { Speed } from "@speed/entities";

@Injectable()
export class NormalizeService {
  constructor(
    @InjectRepository(Character)
    private readonly charRepo: Repository<Character>,
    @InjectRepository(Armour)
    private readonly armourRepo: Repository<Armour>,
    @InjectRepository(Speed)
    private readonly speedRepo: Repository<Speed>,
    @InjectRepository(Level)
    private readonly levelRepo: Repository<Level>,
    @InjectRepository(Health)
    private readonly healthRepo: Repository<Health>,
    @InjectRepository(StatReference)
    private readonly statsRepo: Repository<StatReference>,
    @InjectRepository(CharacterStat)
    private readonly charStatsRepo: Repository<CharacterStat>,
    @InjectRepository(CharacterSkill)
    private readonly charSkillsRepo: Repository<CharacterSkill>,
    @InjectRepository(Personality)
    private readonly personRepo: Repository<Personality>,
    @InjectRepository(NormalizeCharactersHistory)
    private readonly normalizeCharactersHistoryRepo: Repository<NormalizeCharactersHistory>
  ) {}

  async normalizeCharacters() {
    const characters = await this.charRepo.find();

    const statsRefs = await this.statsRepo.find({ relations: ["skills"] });

    const report: Array<{
      id: string;
      name: string;
      normalizedFields: string[];
    }> = [];
    const history: NormalizeCharactersHistory[] = [];

    for (const character of characters) {
      const characterReport = {
        id: character.id,
        name: character.name,
        normalizedFields: [] as string[],
      };

      // Personality
      if (!character.personality) {
        character.personality = this.personRepo.create({});
        characterReport.normalizedFields.push("personality");
      }

      // Armour
      if (!character.armour) {
        character.armour = this.armourRepo.create({});
        characterReport.normalizedFields.push("armour");
      }

      // Speed
      if (!character.speed) {
        character.speed = this.speedRepo.create({});
        characterReport.normalizedFields.push("speed");
      }

      // Level
      if (!character.level) {
        const { from, to, mastery } = LEVELS_CONFIG[1];
        character.level = this.levelRepo.create({
          expFrom: from,
          expTo: to,
          expCurrent: from,
          mastery,
          level: 1,
        });
        characterReport.normalizedFields.push("level");
      }

      // Health
      if (!character.health) {
        character.health = this.healthRepo.create({});
        characterReport.normalizedFields.push("health");
      }

      // Stats
      if (!character.stats) {
        character.stats = [];
      }

      const existingStatIds = character.stats.map((s) => s.stat.id);
      const missingStats = statsRefs.filter(
        (ref) => !existingStatIds.includes(ref.id)
      );

      if (missingStats.length > 0) {
        character.stats.push(
          ...missingStats.map((statRef) =>
            this.charStatsRepo.create({
              stat: statRef,
              skills: statRef.skills.map((skillRef) =>
                this.charSkillsRepo.create({ skill: skillRef })
              ),
            })
          )
        );
        characterReport.normalizedFields.push(
          ...missingStats.map((s) => `stat:${s.code || s.name}`)
        );
      }

      // Skills for existing stats
      for (const charStat of character.stats) {
        const ref = statsRefs.find((r) => r.id === charStat.stat.id);
        if (!ref) continue;

        if (!charStat.skills) {
          charStat.skills = [];
        }

        const existingSkillIds = charStat.skills.map((cs) => cs.skill.id);
        const missingSkills = ref.skills.filter(
          (skillRef) => !existingSkillIds.includes(skillRef.id)
        );

        if (missingSkills.length > 0) {
          charStat.skills.push(
            ...missingSkills.map((skillRef) =>
              this.charSkillsRepo.create({ skill: skillRef })
            )
          );
          characterReport.normalizedFields.push(
            `skills:${ref.code || ref.name}`
          );
        }

        // Сортируем скиллы по эталону
        charStat.skills.sort(
          (a, b) =>
            ref.skills.findIndex((rs) => rs.id === a.skill.id) -
            ref.skills.findIndex((rs) => rs.id === b.skill.id)
        );
      }

      // Сортируем статы по эталону
      character.stats.sort(
        (a, b) =>
          statsRefs.findIndex((sr) => sr.id === a.stat.id) -
          statsRefs.findIndex((sr) => sr.id === b.stat.id)
      );

      // Report + history
      if (characterReport.normalizedFields.length) {
        report.push(characterReport);
        history.push(
          this.normalizeCharactersHistoryRepo.create({
            characterId: character.id,
            characterName: character.name,
            normalizedFields: characterReport.normalizedFields,
          })
        );
      }
    }

    const updatedCharacters = characters.filter((c) =>
      report.some((r) => r.id === c.id)
    );

    if (updatedCharacters.length) {
      await this.charRepo.save(updatedCharacters);
      await this.normalizeCharactersHistoryRepo.save(history);
    }

    console.log(
      `Нормализация завершена ✅. Обновлено: ${updatedCharacters.length}`
    );
    return { updatedCount: updatedCharacters.length, details: report };
  }
}
