import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaImprovements1702800000002 implements MigrationInterface {
  name = 'SchemaImprovements1702800000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ================================================
    // NEW ENUM TYPES
    // ================================================
    await queryRunner.query(`
      CREATE TYPE "employment_type_enum" AS ENUM ('full_time', 'part_time', 'contractor', 'intern')
    `);

    await queryRunner.query(`
      CREATE TYPE "work_location_enum" AS ENUM ('remote', 'office', 'hybrid')
    `);

    // ================================================
    // USERS TABLE IMPROVEMENTS
    // ================================================

    // Security: Track last login
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "lastLoginAt" TIMESTAMP
    `);

    // Security: Track password changes to invalidate old tokens
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "passwordChangedAt" TIMESTAMP
    `);

    // Security: Brute force protection
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0
    `);

    // Security: Account lockout
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "lockedUntil" TIMESTAMP
    `);

    // Compliance: Email verification
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "emailVerifiedAt" TIMESTAMP
    `);

    // Audit: Soft delete
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "deletedAt" TIMESTAMP
    `);

    // Add index for soft delete queries
    await queryRunner.query(`
      CREATE INDEX "IDX_users_deleted_at" ON "users" ("deletedAt")
    `);

    // ================================================
    // EMPLOYEES TABLE IMPROVEMENTS
    // ================================================

    // Personal: Alternative contact email
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN "personalEmail" VARCHAR
    `);

    // HR: Birth date (optional)
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN "birthDate" DATE
    `);

    // Work: Employment type
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN "employmentType" "employment_type_enum" NOT NULL DEFAULT 'full_time'
    `);

    // Work: Location preference
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN "workLocation" "work_location_enum" NOT NULL DEFAULT 'office'
    `);

    // Work: Timezone for distributed teams
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN "timezone" VARCHAR NOT NULL DEFAULT 'UTC'
    `);

    // HR: When they left the company
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN "terminationDate" DATE
    `);

    // Audit: Soft delete
    await queryRunner.query(`
      ALTER TABLE "employees" 
      ADD COLUMN "deletedAt" TIMESTAMP
    `);

    // Add indexes for new columns
    await queryRunner.query(`
      CREATE INDEX "IDX_employees_employment_type" ON "employees" ("employmentType")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employees_work_location" ON "employees" ("workLocation")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employees_deleted_at" ON "employees" ("deletedAt")
    `);

    // ================================================
    // PROPER FOREIGN KEY FOR users.employeeId
    // ================================================

    // Add FK constraint if not exists (users -> employees)
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "FK_users_employee"
      FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL
    `);

    // Add unique constraint for one-to-one relationship
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_employee_unique" ON "users" ("employeeId") WHERE "employeeId" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK and unique constraint
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_employee_unique"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_users_employee"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_deleted_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_work_location"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_employment_type"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_deleted_at"`);

    // Drop employees columns
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "terminationDate"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "timezone"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "workLocation"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "employmentType"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "birthDate"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "personalEmail"`);

    // Drop users columns
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "emailVerifiedAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lockedUntil"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "failedLoginAttempts"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "passwordChangedAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lastLoginAt"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "work_location_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "employment_type_enum"`);
  }
}

