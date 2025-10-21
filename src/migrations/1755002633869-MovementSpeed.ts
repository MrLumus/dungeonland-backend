import { MigrationInterface, QueryRunner } from "typeorm";

export class MovementSpeed1755002633869 implements MigrationInterface {
    name = 'MovementSpeed1755002633869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" ADD "baseMovementSpeed" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "totalMovementSpeed" integer NOT NULL DEFAULT '30'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "totalMovementSpeed"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "baseMovementSpeed"`);
    }

}
