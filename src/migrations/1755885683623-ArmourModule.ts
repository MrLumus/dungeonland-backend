import { MigrationInterface, QueryRunner } from "typeorm";

export class ArmourModule1755885683623 implements MigrationInterface {
    name = 'ArmourModule1755885683623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "armour" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "baseArmour" integer NOT NULL DEFAULT '10', "totalArmour" integer NOT NULL DEFAULT '10', "characterId" uuid, CONSTRAINT "REL_64a90a6279ebe71f29860245f6" UNIQUE ("characterId"), CONSTRAINT "PK_69664ed626d4eea4e314c851f4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "baseArmour"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "totalArmour"`);
        await queryRunner.query(`ALTER TABLE "armour" ADD CONSTRAINT "FK_64a90a6279ebe71f29860245f68" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "armour" DROP CONSTRAINT "FK_64a90a6279ebe71f29860245f68"`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "totalArmour" integer NOT NULL DEFAULT '10'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "baseArmour" integer NOT NULL DEFAULT '10'`);
        await queryRunner.query(`DROP TABLE "armour"`);
    }

}
