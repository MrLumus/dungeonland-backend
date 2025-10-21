import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SkillReference, StatReference } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(StatReference)
    private readonly statRepo: Repository<StatReference>,
    @InjectRepository(SkillReference)
    private readonly skillRepo: Repository<SkillReference>
  ) {}

  async finAllStats() {
    return await this.statRepo.find({});
  }

  async findAllSkills() {
    return await this.skillRepo.find({
      relations: ["stat"],
      select: {
        id: true,
        name: true,
        stat: {
          id: true,
        },
      },
    });
  }

  async finAllStatsSkills() {
    return await this.statRepo.find({
      relations: ["skills"],
    });
  }

  async findStatById(statId: number) {
    return await this.statRepo.findOne({
      where: { id: statId },
    });
  }

  async findSkillById(skillId: number) {
    return await this.skillRepo.find({
      where: { id: skillId },
      relations: ["stat"],
      select: {
        id: true,
        name: true,
        stat: {
          id: true,
        },
      },
    });
  }
}
