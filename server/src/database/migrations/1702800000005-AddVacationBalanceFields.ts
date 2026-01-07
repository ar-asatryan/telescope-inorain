import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVacationBalanceFields1702800000005 implements MigrationInterface {
  name = 'AddVacationBalanceFields1702800000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add vacation balance columns to employees table
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN IF NOT EXISTS "annualVacationDays" integer NOT NULL DEFAULT 20
    `);

    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN IF NOT EXISTS "bonusVacationDays" integer NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN IF NOT EXISTS "annualSickLeaveDays" integer NOT NULL DEFAULT 10
    `);

    console.log('✅ Added vacation balance fields to employees table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "employees" DROP COLUMN IF EXISTS "annualVacationDays"
    `);
    await queryRunner.query(`
      ALTER TABLE "employees" DROP COLUMN IF EXISTS "bonusVacationDays"
    `);
    await queryRunner.query(`
      ALTER TABLE "employees" DROP COLUMN IF EXISTS "annualSickLeaveDays"
    `);
  }
}

