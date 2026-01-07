import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProjects1702800000004 implements MigrationInterface {
  name = 'UpdateProjects1702800000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to projects table
    await queryRunner.query(`
      ALTER TABLE "projects" 
      ADD COLUMN IF NOT EXISTS "category" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "b2bClient" VARCHAR(255)
    `);

    // Delete existing project assignments (foreign key constraint)
    await queryRunner.query(`DELETE FROM "project_assignments"`);

    // Delete all existing projects
    await queryRunner.query(`DELETE FROM "projects"`);

    // Reset the sequence for project IDs
    await queryRunner.query(`ALTER SEQUENCE projects_id_seq RESTART WITH 1`);

    // Insert new projects
    await queryRunner.query(`
      INSERT INTO "projects" ("name", "description", "category", "b2bClient", "status", "priority", "startDate", "progress")
      VALUES
        ('X-player', 'Video player solution for streaming platforms', 'Media Player', 'Various', 'active', 'high', '2024-01-01', 50.00),
        ('X-cloud', 'Cloud infrastructure and streaming services', 'Cloud Services', 'Various', 'active', 'high', '2024-01-01', 40.00),
        ('inoRain OTT', 'Over-the-top streaming platform solution', 'OTT Platform', 'inoRain', 'active', 'high', '2024-01-01', 60.00),
        ('Hotelsmarters', 'Smart hotel entertainment system', 'Hospitality', 'Hotelsmarters', 'active', 'medium', '2024-01-01', 35.00)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete the new projects
    await queryRunner.query(`DELETE FROM "projects"`);

    // Remove the added columns
    await queryRunner.query(`
      ALTER TABLE "projects" 
      DROP COLUMN IF EXISTS "category",
      DROP COLUMN IF EXISTS "b2bClient"
    `);

    // Re-seed original projects
    await queryRunner.query(`
      INSERT INTO "projects" ("name", "description", "status", "priority", "startDate", "progress")
      VALUES
        ('Platform Redesign', 'Complete redesign of the main platform UI', 'active', 'high', '2024-01-15', 45.00),
        ('API v2', 'New version of the public API', 'active', 'high', '2024-02-01', 30.00),
        ('Mobile App', 'Native mobile application development', 'planning', 'medium', '2024-04-01', 0.00),
        ('Infrastructure Upgrade', 'Migration to Kubernetes cluster', 'active', 'high', '2024-01-01', 75.00)
    `);
  }
}

