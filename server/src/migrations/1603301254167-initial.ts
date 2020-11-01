import {MigrationInterface, QueryRunner} from 'typeorm';

export class Initial1603301254167 implements MigrationInterface {
    name = 'Initial1603301254167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" integer NOT NULL, "is_deleted" boolean NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "deposit" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bankName" varchar NOT NULL, "accountNumber" varchar NOT NULL, "initialAmount" integer NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "interestPercentage" integer NOT NULL, "taxesPercentage" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_deposit" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bankName" varchar NOT NULL, "accountNumber" varchar NOT NULL, "initialAmount" integer NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "interestPercentage" integer NOT NULL, "taxesPercentage" integer NOT NULL, "userId" integer, CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_deposit"("id", "bankName", "accountNumber", "initialAmount", "startDate", "endDate", "interestPercentage", "taxesPercentage", "userId") SELECT "id", "bankName", "accountNumber", "initialAmount", "startDate", "endDate", "interestPercentage", "taxesPercentage", "userId" FROM "deposit"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
        await queryRunner.query(`ALTER TABLE "temporary_deposit" RENAME TO "deposit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" RENAME TO "temporary_deposit"`);
        await queryRunner.query(`CREATE TABLE "deposit" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bankName" varchar NOT NULL, "accountNumber" varchar NOT NULL, "initialAmount" integer NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "interestPercentage" integer NOT NULL, "taxesPercentage" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "deposit"("id", "bankName", "accountNumber", "initialAmount", "startDate", "endDate", "interestPercentage", "taxesPercentage", "userId") SELECT "id", "bankName", "accountNumber", "initialAmount", "startDate", "endDate", "interestPercentage", "taxesPercentage", "userId" FROM "temporary_deposit"`);
        await queryRunner.query(`DROP TABLE "temporary_deposit"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
