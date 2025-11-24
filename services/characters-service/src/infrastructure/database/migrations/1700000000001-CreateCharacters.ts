import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCharacters1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create characters table
    await queryRunner.createTable(
      new Table({
        name: "characters",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            default: "'Новый персонаж'",
          },
          {
            name: "race",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "class",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "initiative",
            type: "integer",
            default: 0,
          },
          {
            name: "money",
            type: "integer",
            default: 0,
          },
          {
            name: "hasInspiration",
            type: "boolean",
            default: false,
          },
          {
            name: "exhaustion",
            type: "integer",
            default: 0,
          },
          {
            name: "maxWeight",
            type: "integer",
            default: 150,
          },
          {
            name: "maxCells",
            type: "integer",
            default: 100,
          },
          {
            name: "userId",
            type: "uuid",
            comment: "Reference to user in Auth service (no FK)",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // Create attacks table
    await queryRunner.createTable(
      new Table({
        name: "attacks",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "damage",
            type: "varchar",
          },
          {
            name: "bonus",
            type: "integer",
            default: 0,
          },
          {
            name: "characterId",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["characterId"],
            referencedTableName: "characters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );

    // Create spells table
    await queryRunner.createTable(
      new Table({
        name: "spells",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "level",
            type: "integer",
            isNullable: true,
          },
          {
            name: "school",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "characterId",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["characterId"],
            referencedTableName: "characters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );

    // Create inventory_items table
    await queryRunner.createTable(
      new Table({
        name: "inventory_items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "quantity",
            type: "integer",
            default: 1,
          },
          {
            name: "weight",
            type: "float",
            default: 0,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "characterId",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["characterId"],
            referencedTableName: "characters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("inventory_items");
    await queryRunner.dropTable("spells");
    await queryRunner.dropTable("attacks");
    await queryRunner.dropTable("characters");
  }
}
