import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1702800000000 implements MigrationInterface {
  name = 'InitialSchema1702800000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM ('admin', 'manager', 'employee')
    `)
    await queryRunner.query(`
      CREATE TYPE "employees_englishlevel_enum" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
    `)
    await queryRunner.query(`
      CREATE TYPE "employees_status_enum" AS ENUM ('active', 'vacation', 'inactive')
    `)
    await queryRunner.query(`
      CREATE TYPE "skills_category_enum" AS ENUM ('frontend', 'backend', 'devops', 'design', 'management', 'other')
    `)
    await queryRunner.query(`
      CREATE TYPE "employee_skills_level_enum" AS ENUM ('1', '2', '3', '4', '5')
    `)
    await queryRunner.query(`
      CREATE TYPE "vacations_type_enum" AS ENUM ('vacation', 'sick_leave', 'day_off', 'remote')
    `)
    await queryRunner.query(`
      CREATE TYPE "vacations_status_enum" AS ENUM ('pending', 'approved', 'rejected', 'cancelled')
    `)
    await queryRunner.query(`
      CREATE TYPE "projects_status_enum" AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled')
    `)
    await queryRunner.query(`
      CREATE TYPE "projects_priority_enum" AS ENUM ('low', 'medium', 'high')
    `)

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        "role" "users_role_enum" NOT NULL DEFAULT 'employee',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "employeeId" INTEGER,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    // Create departments table
    await queryRunner.query(`
      CREATE TABLE "departments" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL UNIQUE,
        "description" TEXT,
        "headId" INTEGER,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    // Create teams table
    await queryRunner.query(`
      CREATE TABLE "teams" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "departmentId" INTEGER NOT NULL,
        "leadId" INTEGER,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    // Create employees table
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" SERIAL PRIMARY KEY,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "phone" VARCHAR,
        "position" VARCHAR NOT NULL,
        "departmentId" INTEGER,
        "teamId" INTEGER,
        "managerId" INTEGER,
        "englishLevel" "employees_englishlevel_enum" NOT NULL DEFAULT 'B1',
        "hireDate" DATE NOT NULL,
        "status" "employees_status_enum" NOT NULL DEFAULT 'active',
        "avatarUrl" VARCHAR,
        "bio" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    // Create skills table
    await queryRunner.query(`
      CREATE TABLE "skills" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL UNIQUE,
        "category" "skills_category_enum" NOT NULL DEFAULT 'other',
        "description" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    // Create employee_skills table
    await queryRunner.query(`
      CREATE TABLE "employee_skills" (
        "id" SERIAL PRIMARY KEY,
        "employeeId" INTEGER NOT NULL,
        "skillId" INTEGER NOT NULL,
        "level" "employee_skills_level_enum" NOT NULL DEFAULT '1',
        "yearsOfExperience" DECIMAL(3,1) NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_employee_skill" UNIQUE ("employeeId", "skillId")
      )
    `)

    // Create vacations table
    await queryRunner.query(`
      CREATE TABLE "vacations" (
        "id" SERIAL PRIMARY KEY,
        "employeeId" INTEGER NOT NULL,
        "type" "vacations_type_enum" NOT NULL DEFAULT 'vacation',
        "startDate" DATE NOT NULL,
        "endDate" DATE NOT NULL,
        "status" "vacations_status_enum" NOT NULL DEFAULT 'pending',
        "reason" TEXT,
        "approvedById" INTEGER,
        "approvedAt" TIMESTAMP,
        "rejectionReason" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "status" "projects_status_enum" NOT NULL DEFAULT 'planning',
        "priority" "projects_priority_enum" NOT NULL DEFAULT 'medium',
        "startDate" DATE NOT NULL,
        "endDate" DATE,
        "progress" DECIMAL(5,2) NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    // Create project_assignments table
    await queryRunner.query(`
      CREATE TABLE "project_assignments" (
        "id" SERIAL PRIMARY KEY,
        "projectId" INTEGER NOT NULL,
        "employeeId" INTEGER NOT NULL,
        "role" VARCHAR NOT NULL,
        "startDate" DATE NOT NULL,
        "endDate" DATE,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_project_employee" UNIQUE ("projectId", "employeeId")
      )
    `)

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "teams"
      ADD CONSTRAINT "FK_teams_department"
      FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE
    `)

    await queryRunner.query(`
      ALTER TABLE "teams"
      ADD CONSTRAINT "FK_teams_lead"
      FOREIGN KEY ("leadId") REFERENCES "employees"("id") ON DELETE SET NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "departments"
      ADD CONSTRAINT "FK_departments_head"
      FOREIGN KEY ("headId") REFERENCES "employees"("id") ON DELETE SET NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "employees"
      ADD CONSTRAINT "FK_employees_department"
      FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "employees"
      ADD CONSTRAINT "FK_employees_team"
      FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "employees"
      ADD CONSTRAINT "FK_employees_manager"
      FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "employee_skills"
      ADD CONSTRAINT "FK_employee_skills_employee"
      FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE
    `)

    await queryRunner.query(`
      ALTER TABLE "employee_skills"
      ADD CONSTRAINT "FK_employee_skills_skill"
      FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE
    `)

    await queryRunner.query(`
      ALTER TABLE "vacations"
      ADD CONSTRAINT "FK_vacations_employee"
      FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE
    `)

    await queryRunner.query(`
      ALTER TABLE "vacations"
      ADD CONSTRAINT "FK_vacations_approver"
      FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE SET NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "project_assignments"
      ADD CONSTRAINT "FK_project_assignments_project"
      FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE
    `)

    await queryRunner.query(`
      ALTER TABLE "project_assignments"
      ADD CONSTRAINT "FK_project_assignments_employee"
      FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE
    `)

    // Create indexes for better query performance
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`)
    await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role")`)
    await queryRunner.query(`CREATE INDEX "IDX_employees_email" ON "employees" ("email")`)
    await queryRunner.query(`CREATE INDEX "IDX_employees_status" ON "employees" ("status")`)
    await queryRunner.query(`CREATE INDEX "IDX_employees_department" ON "employees" ("departmentId")`)
    await queryRunner.query(`CREATE INDEX "IDX_employees_team" ON "employees" ("teamId")`)
    await queryRunner.query(`CREATE INDEX "IDX_skills_category" ON "skills" ("category")`)
    await queryRunner.query(`CREATE INDEX "IDX_vacations_employee" ON "vacations" ("employeeId")`)
    await queryRunner.query(`CREATE INDEX "IDX_vacations_status" ON "vacations" ("status")`)
    await queryRunner.query(`CREATE INDEX "IDX_vacations_dates" ON "vacations" ("startDate", "endDate")`)
    await queryRunner.query(`CREATE INDEX "IDX_projects_status" ON "projects" ("status")`)
    await queryRunner.query(`CREATE INDEX "IDX_project_assignments_project" ON "project_assignments" ("projectId")`)
    await queryRunner.query(`CREATE INDEX "IDX_project_assignments_employee" ON "project_assignments" ("employeeId")`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_assignments_employee"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_assignments_project"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacations_dates"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacations_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vacations_employee"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_skills_category"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_team"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_department"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_email"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_role"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`)

    // Drop tables (in reverse order of creation to handle foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS "project_assignments"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "projects"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "vacations"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "employee_skills"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "skills"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "employees"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "teams"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "departments"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`)

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "projects_priority_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "projects_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "vacations_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "vacations_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "employee_skills_level_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "skills_category_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "employees_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "employees_englishlevel_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`)
  }
}

