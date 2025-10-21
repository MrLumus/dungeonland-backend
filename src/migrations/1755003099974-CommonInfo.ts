import { MigrationInterface, QueryRunner } from "typeorm";

export class CommonInfo1755003099974 implements MigrationInterface {
    name = 'CommonInfo1755003099974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" ADD "money" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "initiative" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "hasInspiration" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "exhaustion" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "maxWeight" integer NOT NULL DEFAULT '150'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "maxCells" integer NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "characters" ALTER COLUMN "name" SET DEFAULT 'Новый персонаж'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" ALTER COLUMN "name" SET DEFAULT 'Unnamed'`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "maxCells"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "maxWeight"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "exhaustion"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "hasInspiration"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "initiative"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "money"`);
    }

}
