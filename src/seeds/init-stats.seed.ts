import { StatReference, SkillReference } from "@reference/entities";
import { AppDataSource } from "../data-source";

export async function run() {
  await AppDataSource.initialize();

  const statRepo = AppDataSource.getRepository(StatReference);
  const skillRepo = AppDataSource.getRepository(SkillReference);

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

  console.log("✅ Stats & Skills seeded");
  await AppDataSource.destroy();
}
