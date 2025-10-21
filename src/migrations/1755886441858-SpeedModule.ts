import { MigrationInterface, QueryRunner } from "typeorm";

export class SpeedModule1755886441858 implements MigrationInterface {
    name = 'SpeedModule1755886441858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "speed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "baseMovementSpeed" integer NOT NULL DEFAULT '30', "totalMovementSpeed" integer NOT NULL DEFAULT '30', "characterId" uuid, CONSTRAINT "REL_84722a6070552358970e13e9b0" UNIQUE ("characterId"), CONSTRAINT "PK_3725257a5ff7a71c525874d4444" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "baseMovementSpeed"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "totalMovementSpeed"`);
        await queryRunner.query(`ALTER TABLE "speed" ADD CONSTRAINT "FK_84722a6070552358970e13e9b0d" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "speed" DROP CONSTRAINT "FK_84722a6070552358970e13e9b0d"`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "totalMovementSpeed" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "baseMovementSpeed" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`DROP TABLE "speed"`);
    }

}
