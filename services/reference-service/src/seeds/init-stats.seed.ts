import { StatReference } from "../domain/entities/stat-reference.entity";
import { SkillReference } from "../domain/entities/skill-reference.entity";
import { DataSource } from "typeorm";
import ormconfig from "../infrastructure/config/ormconfig";

export async function seedStatReferences() {
  const dataSource = new DataSource(ormconfig as any);
  await dataSource.initialize();

  const statRepo = dataSource.getRepository(StatReference);
  const skillRepo = dataSource.getRepository(SkillReference);

  // Check if already seeded
  const existingStats = await statRepo.count();
  if (existingStats > 0) {
    console.log("✓ Stats already seeded, skipping...");
    await dataSource.destroy();
    return;
  }

  const stats = [
    { code: "STR", name: "Сила", skills: ["Атлетика"] },
    {
      code: "DEX",
      name: "Ловкость",
      skills: ["Акробатика", "Ловкость рук", "Скрытность"],
    },
    { code: "CON", name: "Телосложение", skills: [] },
    {
      code: "INT",
      name: "Интеллект",
      skills: ["Магия", "История", "Анализ", "Природа", "Религия"],
    },
    {
      code: "WIS",
      name: "Мудрость",
      skills: [
        "Внимательность",
        "Выживание",
        "Медицина",
        "Проницательность",
        "Уход за животными",
      ],
    },
    {
      code: "CHA",
      name: "Харизма",
      skills: ["Выступление", "Запугивание", "Обман", "Убеждение"],
    },
  ];

  for (const stat of stats) {
    const statEntity = statRepo.create({ code: stat.code, name: stat.name });
    await statRepo.save(statEntity);

    for (const skillName of stat.skills) {
      const skillEntity = skillRepo.create({
        stat: statEntity,
        name: skillName,
      });
      await skillRepo.save(skillEntity);
    }
  }

  console.log("✅ Stats & Skills seeded successfully");
  await dataSource.destroy();
}

// Run if called directly
if (require.main === module) {
  seedStatReferences()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error seeding stats:", error);
      process.exit(1);
    });
}
