import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatSkillReference1754847435285 implements MigrationInterface {
    name = 'AddStatSkillReference1754847435285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skill_reference" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "stat_id" integer, CONSTRAINT "UQ_2e1c146524db357b7d5b43664e4" UNIQUE ("name"), CONSTRAINT "PK_d9afb69db07b1731e62ed4759e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stat_reference" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_1b897b89ed136dfeaee6ea0ca9f" UNIQUE ("code"), CONSTRAINT "UQ_0a94c4db58edfc1acecb1abca4c" UNIQUE ("name"), CONSTRAINT "PK_131aab954cd840a23c3bf9b85b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "character_skill" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "bonus" integer NOT NULL, "proficient" integer NOT NULL DEFAULT '0', "character_stat_id" integer, "skill_id" integer, CONSTRAINT "PK_835ce87665bea249a62f1a706c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "character_stat" ("id" SERIAL NOT NULL, "stat_value" integer NOT NULL, "check_value" integer NOT NULL, "check_bonus" integer NOT NULL, "save_throw__value" integer NOT NULL, "save_throw__bonus" integer NOT NULL, "save_throw_proficient" boolean NOT NULL DEFAULT false, "character_id" uuid, "stat_id" integer, CONSTRAINT "PK_7a7db5bbafa5832f6b8ee8feae7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelExpFrom" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelExpTo" integer NOT NULL DEFAULT '300'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelExpCurrent" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "levelMastery" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "skill_reference" ADD CONSTRAINT "FK_4a42e7c36bc6fb3afdcb7578392" FOREIGN KEY ("stat_id") REFERENCES "stat_reference"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character_skill" ADD CONSTRAINT "FK_73ae2db3db7c4ca74c95f7583d6" FOREIGN KEY ("character_stat_id") REFERENCES "character_stat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character_skill" ADD CONSTRAINT "FK_8064ba9f219d4c247d7e87943ef" FOREIGN KEY ("skill_id") REFERENCES "skill_reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character_stat" ADD CONSTRAINT "FK_4db90763d021ab4b70859bdf891" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character_stat" ADD CONSTRAINT "FK_1d248769fa903235d40632f2747" FOREIGN KEY ("stat_id") REFERENCES "stat_reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "character_stat" DROP CONSTRAINT "FK_1d248769fa903235d40632f2747"`);
        await queryRunner.query(`ALTER TABLE "character_stat" DROP CONSTRAINT "FK_4db90763d021ab4b70859bdf891"`);
        await queryRunner.query(`ALTER TABLE "character_skill" DROP CONSTRAINT "FK_8064ba9f219d4c247d7e87943ef"`);
        await queryRunner.query(`ALTER TABLE "character_skill" DROP CONSTRAINT "FK_73ae2db3db7c4ca74c95f7583d6"`);
        await queryRunner.query(`ALTER TABLE "skill_reference" DROP CONSTRAINT "FK_4a42e7c36bc6fb3afdcb7578392"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelMastery"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelExpCurrent"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelExpTo"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "levelExpFrom"`);
        await queryRunner.query(`DROP TABLE "character_stat"`);
        await queryRunner.query(`DROP TABLE "character_skill"`);
        await queryRunner.query(`DROP TABLE "stat_reference"`);
        await queryRunner.query(`DROP TABLE "skill_reference"`);
    }

}
