import { MigrationInterface, QueryRunner } from "typeorm";

export class NormilzeAndAudit1754930718111 implements MigrationInterface {
    name = 'NormilzeAndAudit1754930718111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "normalize_characters_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "characterId" character varying NOT NULL, "characterName" character varying NOT NULL, "normalizedFields" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b4ba34ef6169d3457acc8a70867" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "normalize_characters_history"`);
    }

}
