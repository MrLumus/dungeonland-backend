import { MigrationInterface, QueryRunner } from "typeorm";

export class Armour1755002381411 implements MigrationInterface {
    name = 'Armour1755002381411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" ADD "baseArmour" integer NOT NULL DEFAULT '10'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "totalArmour" integer NOT NULL DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "totalArmour"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "baseArmour"`);
    }

}
