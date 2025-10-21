import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHealtLevelTables1754928352720 implements MigrationInterface {
    name = 'AddHealtLevelTables1754928352720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "health" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "max" integer NOT NULL DEFAULT '10', "current" integer NOT NULL DEFAULT '10', "timeless" integer NOT NULL DEFAULT '0', "permanent" integer NOT NULL DEFAULT '0', "deathSuccessSaveThrows" integer NOT NULL DEFAULT '0', "deathFailSaveThrows" integer NOT NULL DEFAULT '0', "characterId" uuid, CONSTRAINT "REL_164d73f36a96426552bc12fd84" UNIQUE ("characterId"), CONSTRAINT "PK_8a1d6d8c0c85c1791b359854e83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "level" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "level" integer NOT NULL DEFAULT '1', "expFrom" integer NOT NULL DEFAULT '0', "expTo" integer NOT NULL DEFAULT '300', "expCurrent" integer NOT NULL DEFAULT '0', "mastery" integer NOT NULL DEFAULT '2', "characterId" uuid, CONSTRAINT "REL_8837d02e73f3ae90c787de32c2" UNIQUE ("characterId"), CONSTRAINT "PK_d3f1a7a6f09f1c3144bacdc6bcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelExpFrom"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelExpTo"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelExpCurrent"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelMastery"`);
        await queryRunner.query(`ALTER TABLE "health" ADD CONSTRAINT "FK_164d73f36a96426552bc12fd844" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "level" ADD CONSTRAINT "FK_8837d02e73f3ae90c787de32c21" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "level" DROP CONSTRAINT "FK_8837d02e73f3ae90c787de32c21"`);
        await queryRunner.query(`ALTER TABLE "health" DROP CONSTRAINT "FK_164d73f36a96426552bc12fd844"`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelMastery" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelExpCurrent" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelExpTo" integer NOT NULL DEFAULT '300'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelExpFrom" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "level" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`DROP TABLE "level"`);
        await queryRunner.query(`DROP TABLE "health"`);
    }

}
