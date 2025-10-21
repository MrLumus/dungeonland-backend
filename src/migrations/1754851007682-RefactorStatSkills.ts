import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorStatSkills1754851007682 implements MigrationInterface {
    name = 'RefactorStatSkills1754851007682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character_skill" ALTER COLUMN "value" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "character_skill" ALTER COLUMN "bonus" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "stat_value" SET DEFAULT '10'`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "check_value" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "check_bonus" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "save_throw__value" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "save_throw__bonus" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "save_throw__bonus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "save_throw__value" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "check_bonus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "check_value" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character_stat" ALTER COLUMN "stat_value" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character_skill" ALTER COLUMN "bonus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "character_skill" ALTER COLUMN "value" DROP DEFAULT`);
    }

}
