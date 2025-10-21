import { MigrationInterface, QueryRunner } from "typeorm";

export class Personality1755006814507 implements MigrationInterface {
    name = 'Personality1755006814507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "personality" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "history" character varying NOT NULL DEFAULT '', "god" character varying NOT NULL DEFAULT '', "alliesAndGuilds" character varying NOT NULL DEFAULT '', "temper" character varying NOT NULL DEFAULT '', "ideals" character varying NOT NULL DEFAULT '', "attachments" character varying NOT NULL DEFAULT '', "weaknesses" character varying NOT NULL DEFAULT '', "appearance" character varying NOT NULL DEFAULT '', "historyName" character varying NOT NULL DEFAULT '', "worldview" character varying NOT NULL DEFAULT '', "eyes" character varying NOT NULL DEFAULT '', "skin" character varying NOT NULL DEFAULT '', "hairs" character varying NOT NULL DEFAULT '', "height" integer, "weight" integer, "age" integer, "characterId" uuid, CONSTRAINT "REL_c50a9e7e39606ef9db458024dc" UNIQUE ("characterId"), CONSTRAINT "PK_97c40c392c5c1660fe601a376d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "personality" ADD CONSTRAINT "FK_c50a9e7e39606ef9db458024dcd" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "personality" DROP CONSTRAINT "FK_c50a9e7e39606ef9db458024dcd"`);
        await queryRunner.query(`DROP TABLE "personality"`);
    }

}
