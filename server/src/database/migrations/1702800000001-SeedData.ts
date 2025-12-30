import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class SeedData1702800000001 implements MigrationInterface {
  name = 'SeedData1702800000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Seed admin user
    await queryRunner.query(`
      INSERT INTO "users" ("email", "password", "firstName", "lastName", "role", "isActive")
      VALUES ('admin@inorain.com', '${hashedPassword}', 'Admin', 'User', 'admin', true)
    `);

    // Seed departments
    await queryRunner.query(`
      INSERT INTO "departments" ("name", "description")
      VALUES
        ('Engineering', 'Software development team'),
        ('Design', 'UI/UX and product design'),
        ('Product', 'Product management'),
        ('HR', 'Human resources')
    `);

    // Get department IDs
    const engineering = await queryRunner.query(`SELECT id FROM departments WHERE name = 'Engineering'`);
    const design = await queryRunner.query(`SELECT id FROM departments WHERE name = 'Design'`);
    const product = await queryRunner.query(`SELECT id FROM departments WHERE name = 'Product'`);

    // Seed teams
    await queryRunner.query(`
      INSERT INTO "teams" ("name", "description", "departmentId")
      VALUES
        ('Platform', 'Core platform development', ${engineering[0].id}),
        ('API', 'API and backend services', ${engineering[0].id}),
        ('Infrastructure', 'DevOps and infrastructure', ${engineering[0].id}),
        ('Quality', 'QA and testing', ${engineering[0].id}),
        ('Product Design', 'Product UI/UX design', ${design[0].id}),
        ('Product Management', 'Product strategy', ${product[0].id})
    `);

    // Seed skills
    await queryRunner.query(`
      INSERT INTO "skills" ("name", "category")
      VALUES
        ('React', 'frontend'),
        ('TypeScript', 'frontend'),
        ('Vue.js', 'frontend'),
        ('TailwindCSS', 'frontend'),
        ('Angular', 'frontend'),
        ('Node.js', 'backend'),
        ('Python', 'backend'),
        ('Go', 'backend'),
        ('PostgreSQL', 'backend'),
        ('MongoDB', 'backend'),
        ('Docker', 'devops'),
        ('Kubernetes', 'devops'),
        ('AWS', 'devops'),
        ('Terraform', 'devops'),
        ('CI/CD', 'devops'),
        ('Figma', 'design'),
        ('Adobe XD', 'design'),
        ('UI/UX Design', 'design')
    `);

    // Get team IDs
    const platform = await queryRunner.query(`SELECT id FROM teams WHERE name = 'Platform'`);
    const api = await queryRunner.query(`SELECT id FROM teams WHERE name = 'API'`);
    const infra = await queryRunner.query(`SELECT id FROM teams WHERE name = 'Infrastructure'`);
    const quality = await queryRunner.query(`SELECT id FROM teams WHERE name = 'Quality'`);
    const productDesign = await queryRunner.query(`SELECT id FROM teams WHERE name = 'Product Design'`);

    // Seed employees
    await queryRunner.query(`
      INSERT INTO "employees" ("firstName", "lastName", "email", "phone", "position", "departmentId", "teamId", "englishLevel", "hireDate", "status")
      VALUES
        ('Anna', 'Hovhannisyan', 'anna.h@inorain.com', '+374 99 123456', 'Senior Frontend Developer', ${engineering[0].id}, ${platform[0].id}, 'C1', '2022-03-15', 'active'),
        ('Tigran', 'Sargsyan', 'tigran.s@inorain.com', '+374 91 234567', 'Backend Developer', ${engineering[0].id}, ${api[0].id}, 'B2', '2023-01-10', 'active'),
        ('Maria', 'Petrosyan', 'maria.p@inorain.com', '+374 93 345678', 'UI/UX Designer', ${design[0].id}, ${productDesign[0].id}, 'B2', '2022-07-20', 'active'),
        ('David', 'Grigoryan', 'david.g@inorain.com', '+374 94 456789', 'DevOps Engineer', ${engineering[0].id}, ${infra[0].id}, 'C1', '2021-11-01', 'active'),
        ('Lusine', 'Hakobyan', 'lusine.h@inorain.com', '+374 95 567890', 'QA Engineer', ${engineering[0].id}, ${quality[0].id}, 'B1', '2023-05-15', 'active')
    `);

    // Get employee IDs
    const anna = await queryRunner.query(`SELECT id FROM employees WHERE email = 'anna.h@inorain.com'`);
    const tigran = await queryRunner.query(`SELECT id FROM employees WHERE email = 'tigran.s@inorain.com'`);
    const maria = await queryRunner.query(`SELECT id FROM employees WHERE email = 'maria.p@inorain.com'`);
    const david = await queryRunner.query(`SELECT id FROM employees WHERE email = 'david.g@inorain.com'`);

    // Get skill IDs
    const react = await queryRunner.query(`SELECT id FROM skills WHERE name = 'React'`);
    const typescript = await queryRunner.query(`SELECT id FROM skills WHERE name = 'TypeScript'`);
    const tailwind = await queryRunner.query(`SELECT id FROM skills WHERE name = 'TailwindCSS'`);
    const nodejs = await queryRunner.query(`SELECT id FROM skills WHERE name = 'Node.js'`);
    const postgresql = await queryRunner.query(`SELECT id FROM skills WHERE name = 'PostgreSQL'`);
    const docker = await queryRunner.query(`SELECT id FROM skills WHERE name = 'Docker'`);
    const figma = await queryRunner.query(`SELECT id FROM skills WHERE name = 'Figma'`);
    const uiux = await queryRunner.query(`SELECT id FROM skills WHERE name = 'UI/UX Design'`);
    const kubernetes = await queryRunner.query(`SELECT id FROM skills WHERE name = 'Kubernetes'`);
    const aws = await queryRunner.query(`SELECT id FROM skills WHERE name = 'AWS'`);
    const terraform = await queryRunner.query(`SELECT id FROM skills WHERE name = 'Terraform'`);

    // Seed employee skills
    await queryRunner.query(`
      INSERT INTO "employee_skills" ("employeeId", "skillId", "level", "yearsOfExperience")
      VALUES
        (${anna[0].id}, ${react[0].id}, '5', 4),
        (${anna[0].id}, ${typescript[0].id}, '4', 3),
        (${anna[0].id}, ${tailwind[0].id}, '5', 3),
        (${tigran[0].id}, ${nodejs[0].id}, '4', 3),
        (${tigran[0].id}, ${postgresql[0].id}, '3', 2),
        (${tigran[0].id}, ${docker[0].id}, '3', 2),
        (${maria[0].id}, ${figma[0].id}, '5', 5),
        (${maria[0].id}, ${uiux[0].id}, '4', 4),
        (${david[0].id}, ${docker[0].id}, '5', 5),
        (${david[0].id}, ${kubernetes[0].id}, '4', 3),
        (${david[0].id}, ${aws[0].id}, '5', 4),
        (${david[0].id}, ${terraform[0].id}, '3', 2)
    `);

    // Seed sample projects
    await queryRunner.query(`
      INSERT INTO "projects" ("name", "description", "status", "priority", "startDate", "progress")
      VALUES
        ('Platform Redesign', 'Complete redesign of the main platform UI', 'active', 'high', '2024-01-15', 45.00),
        ('API v2', 'New version of the public API', 'active', 'high', '2024-02-01', 30.00),
        ('Mobile App', 'Native mobile application development', 'planning', 'medium', '2024-04-01', 0.00),
        ('Infrastructure Upgrade', 'Migration to Kubernetes cluster', 'active', 'high', '2024-01-01', 75.00)
    `);

    // Get project IDs
    const platformProject = await queryRunner.query(`SELECT id FROM projects WHERE name = 'Platform Redesign'`);
    const apiProject = await queryRunner.query(`SELECT id FROM projects WHERE name = 'API v2'`);
    const infraProject = await queryRunner.query(`SELECT id FROM projects WHERE name = 'Infrastructure Upgrade'`);

    // Seed project assignments
    await queryRunner.query(`
      INSERT INTO "project_assignments" ("projectId", "employeeId", "role", "startDate", "isActive")
      VALUES
        (${platformProject[0].id}, ${anna[0].id}, 'Lead Frontend Developer', '2024-01-15', true),
        (${platformProject[0].id}, ${maria[0].id}, 'UI/UX Designer', '2024-01-15', true),
        (${apiProject[0].id}, ${tigran[0].id}, 'Backend Developer', '2024-02-01', true),
        (${infraProject[0].id}, ${david[0].id}, 'DevOps Lead', '2024-01-01', true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove seeded data in reverse order
    await queryRunner.query(`DELETE FROM "project_assignments"`);
    await queryRunner.query(`DELETE FROM "projects"`);
    await queryRunner.query(`DELETE FROM "employee_skills"`);
    await queryRunner.query(`DELETE FROM "vacations"`);
    await queryRunner.query(`DELETE FROM "employees"`);
    await queryRunner.query(`DELETE FROM "skills"`);
    await queryRunner.query(`DELETE FROM "teams"`);
    await queryRunner.query(`DELETE FROM "departments"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}

