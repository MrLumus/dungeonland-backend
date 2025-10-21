import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1754838966595 implements MigrationInterface {
    name = 'InitSchema1754838966595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "value" integer NOT NULL, "proficient" boolean NOT NULL DEFAULT false, "characterId" uuid, CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "damage" character varying NOT NULL, "bonus" integer NOT NULL DEFAULT '0', "characterId" uuid, CONSTRAINT "PK_04c8618b0c4d51627f625c55dad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spells" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "level" integer, "school" character varying, "characterId" uuid, CONSTRAINT "PK_19d1052082c20f04349c0b5875c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "weight" double precision NOT NULL DEFAULT '0', "description" character varying, "characterId" uuid, CONSTRAINT "PK_cf2f451407242e132547ac19169" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "characterId" uuid, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "displayName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "characters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL DEFAULT 'Unnamed', "race" character varying, "class" character varying, "level" integer NOT NULL DEFAULT '1', "userId" uuid, CONSTRAINT "PK_9d731e05758f26b9315dac5e378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" integer NOT NULL, "characterId" uuid, CONSTRAINT "PK_c76e93dfef28ba9b6942f578ab1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skills" ADD CONSTRAINT "FK_04158568804dfd7f38431962dab" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attacks" ADD CONSTRAINT "FK_b200e4328b5962b1d382e696643" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spells" ADD CONSTRAINT "FK_c9b7cf1d81115cfed0f3f77ef63" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_4e44ade82702ee4b963801a0e66" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_5498c3d1acc36841c289f31f2b1" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_7c1bf02092d401b55ecc243ef1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stats" ADD CONSTRAINT "FK_6ca2d835ff065b94b84e7719830" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stats" DROP CONSTRAINT "FK_6ca2d835ff065b94b84e7719830"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_7c1bf02092d401b55ecc243ef1f"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_5498c3d1acc36841c289f31f2b1"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_4e44ade82702ee4b963801a0e66"`);
        await queryRunner.query(`ALTER TABLE "spells" DROP CONSTRAINT "FK_c9b7cf1d81115cfed0f3f77ef63"`);
        await queryRunner.query(`ALTER TABLE "attacks" DROP CONSTRAINT "FK_b200e4328b5962b1d382e696643"`);
        await queryRunner.query(`ALTER TABLE "skills" DROP CONSTRAINT "FK_04158568804dfd7f38431962dab"`);
        await queryRunner.query(`DROP TABLE "stats"`);
        await queryRunner.query(`DROP TABLE "characters"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`DROP TABLE "inventory_items"`);
        await queryRunner.query(`DROP TABLE "spells"`);
        await queryRunner.query(`DROP TABLE "attacks"`);
        await queryRunner.query(`DROP TABLE "skills"`);
    }

}
