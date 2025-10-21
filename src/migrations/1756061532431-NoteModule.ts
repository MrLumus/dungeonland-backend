import { MigrationInterface, QueryRunner } from "typeorm";

export class NoteModule1756061532431 implements MigrationInterface {
    name = 'NoteModule1756061532431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL DEFAULT 'Новая заметка', "content" text NOT NULL DEFAULT '', "characterId" uuid, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_c94f298d9cde38a409be2e734ba" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_c94f298d9cde38a409be2e734ba"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}
