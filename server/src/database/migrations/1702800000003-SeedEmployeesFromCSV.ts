import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedEmployeesFromCSV1702800000003 implements MigrationInterface {
  name = 'SeedEmployeesFromCSV1702800000003';

  // Employee data from users-list.csv
  private employees = [
    { id: 1, firstNameArm: 'Մdelays', lastNameArm: 'Մdelays', firstName: 'Meline', lastName: 'Mkrtchyan' },
    { id: 2, firstNameArm: 'Արdelays', lastNameArm: 'Մdelays', firstName: 'Armine', lastName: 'Minasyan' },
    { id: 3, firstNameArm: 'Մane', lastNameArm: 'Եnokyan', firstName: 'Mane', lastName: 'Yenokyan' },
    { id: 5, firstNameArm: 'Delays', lastNameArm: 'Մargaryan', firstName: 'Armen', lastName: 'Margaryan' },
    { id: 6, firstNameArm: 'Mariam', lastNameArm: 'Arakelyan', firstName: 'Mariam', lastName: 'Arakelyan' },
    { id: 7, firstNameArm: 'Silva', lastNameArm: 'Hovhannisyan', firstName: 'Silva', lastName: 'Hovhannisyan' },
    { id: 8, firstNameArm: 'Arman', lastNameArm: 'Nazaryan', firstName: 'Arman', lastName: 'Nazaryan' },
    { id: 9, firstNameArm: 'Artur', lastNameArm: 'Aleksanyan', firstName: 'Artur', lastName: 'Aleksanyan' },
    { id: 10, firstNameArm: 'Spartak', lastNameArm: 'Davtyan', firstName: 'Spartak', lastName: 'Davtyan' },
    { id: 11, firstNameArm: 'Gurgen', lastNameArm: 'Manukyan', firstName: 'Gurgen', lastName: 'Manukyan' },
    { id: 12, firstNameArm: 'Aram', lastNameArm: 'Shahgeldyan', firstName: 'Aram', lastName: 'Shahgeldyan' },
    { id: 13, firstNameArm: 'Roland', lastNameArm: 'Khachatryan', firstName: 'Roland', lastName: 'Khachatryan' },
    { id: 14, firstNameArm: 'Anahit', lastNameArm: 'Petrosyan', firstName: 'Anahit', lastName: 'Petrosyan' },
    { id: 15, firstNameArm: 'Lusine', lastNameArm: 'Minasyan', firstName: 'Lusine', lastName: 'Minasyan' },
    { id: 16, firstNameArm: 'Grigor', lastNameArm: 'Poghosyan', firstName: 'Grigor', lastName: 'Poghosyan' },
    { id: 17, firstNameArm: 'Vahe', lastNameArm: 'Petrosyan', firstName: 'Vahe', lastName: 'Petrosyan' },
    { id: 18, firstNameArm: 'Suren', lastNameArm: 'Melkonyan', firstName: 'Suren', lastName: 'Melkonyan' },
    { id: 19, firstNameArm: 'Anush', lastNameArm: 'Sargsyan', firstName: 'Anush', lastName: 'Sargsyan' },
    { id: 20, firstNameArm: 'Tamara', lastNameArm: 'Grigoryan', firstName: 'Tamara', lastName: 'Grigoryan' },
    { id: 21, firstNameArm: 'Armen', lastNameArm: 'Hakobyan', firstName: 'Armen', lastName: 'Hakobyan' },
    { id: 22, firstNameArm: 'Meri', lastNameArm: 'Mardyan', firstName: 'Meri', lastName: 'Mardyan' },
    { id: 23, firstNameArm: 'Narek', lastNameArm: 'Pambukchyan', firstName: 'Narek', lastName: 'Pambukchyan' },
    { id: 24, firstNameArm: 'Kristine', lastNameArm: 'Petrosyan', firstName: 'Kristine', lastName: 'Petrosyan' },
    { id: 25, firstNameArm: 'Tigran', lastNameArm: 'Mnjoyan', firstName: 'Tigran', lastName: 'Mnjoyan' },
    { id: 26, firstNameArm: 'Armen', lastNameArm: 'Keshishyan', firstName: 'Armen', lastName: 'Keshishyan' },
    { id: 27, firstNameArm: 'Vasil', lastNameArm: 'Vasilyan', firstName: 'Vasil', lastName: 'Vasilyan' },
    { id: 28, firstNameArm: 'Aram', lastNameArm: 'Avagyan', firstName: 'Aram', lastName: 'Avagyan' },
    { id: 29, firstNameArm: 'Mariam', lastNameArm: 'Mkhitaryan', firstName: 'Mariam', lastName: 'Mkhitaryan' },
    { id: 30, firstNameArm: 'Kima', lastNameArm: 'Manukyan', firstName: 'Kima', lastName: 'Manukyan' },
    { id: 31, firstNameArm: 'Tamara', lastNameArm: 'Khalatyan', firstName: 'Tamara', lastName: 'Khalatyan' },
    { id: 32, firstNameArm: 'Armine', lastNameArm: 'Minasyan', firstName: 'Armine', lastName: 'Minasyan' },
    { id: 33, firstNameArm: 'Mariam', lastNameArm: 'Khachatryan', firstName: 'Mariam', lastName: 'Khachatryan' },
    { id: 34, firstNameArm: 'Yura', lastNameArm: 'Zakaryan', firstName: 'Yura', lastName: 'Zakaryan' },
    { id: 35, firstNameArm: 'Tatev', lastNameArm: 'Minasyan', firstName: 'Tatev', lastName: 'Minasyan' },
    { id: 36, firstNameArm: 'Karen', lastNameArm: 'Ayvazyan', firstName: 'Karen', lastName: 'Ayvazyan' },
    { id: 37, firstNameArm: 'Anahit', lastNameArm: 'Chantoyan', firstName: 'Anahit', lastName: 'Chantoyan' },
    { id: 38, firstNameArm: 'Sona', lastNameArm: 'Aramyan', firstName: 'Sona', lastName: 'Aramyan' },
    { id: 39, firstNameArm: 'Marieta', lastNameArm: 'Karapetyan', firstName: 'Marieta', lastName: 'Karapetyan' },
    { id: 40, firstNameArm: 'Grigor', lastNameArm: 'Ghazaryan', firstName: 'Grigor', lastName: 'Ghazaryan' },
    { id: 41, firstNameArm: 'Andranik', lastNameArm: 'Minasyan', firstName: 'Andranik', lastName: 'Minasyan' },
    { id: 42, firstNameArm: 'Norik', lastNameArm: 'Bazoyan', firstName: 'Norik', lastName: 'Bazoyan' },
    { id: 44, firstNameArm: 'Arsen', lastNameArm: 'Gabrielyan', firstName: 'Arsen', lastName: 'Gabrielyan' },
    { id: 45, firstNameArm: 'Mariam', lastNameArm: 'Chobanyan', firstName: 'Mariam', lastName: 'Chobanyan' },
    { id: 46, firstNameArm: 'Tigran', lastNameArm: 'Tamazyan', firstName: 'Tigran', lastName: 'Tamazyan' },
    { id: 47, firstNameArm: 'Arman', lastNameArm: 'Muradyan', firstName: 'Arman', lastName: 'Muradyan' },
    { id: 48, firstNameArm: 'Meri', lastNameArm: 'Terteryan', firstName: 'Meri', lastName: 'Terteryan' },
    { id: 49, firstNameArm: 'Andranik', lastNameArm: 'Vardanyan', firstName: 'Andranik', lastName: 'Vardanyan' },
    { id: 50, firstNameArm: 'Zina', lastNameArm: 'Melkonyan', firstName: 'Zina', lastName: 'Melkonyan' },
    { id: 51, firstNameArm: 'Anahit', lastNameArm: 'Aleksanyan', firstName: 'Anahit', lastName: 'Aleksanyan' },
    { id: 52, firstNameArm: 'Erik', lastNameArm: 'Babayan', firstName: 'Erik', lastName: 'Babayan' },
    { id: 53, firstNameArm: 'Ararat', lastNameArm: 'Asatryan', firstName: 'Ararat', lastName: 'Asatryan' },
    { id: 54, firstNameArm: 'Tigran', lastNameArm: 'Sargsyan', firstName: 'Tigran', lastName: 'Sargsyan' },
    { id: 55, firstNameArm: 'Arman', lastNameArm: 'Sagatelyan', firstName: 'Arman', lastName: 'Sagatelyan' },
    { id: 56, firstNameArm: 'Alik', lastNameArm: 'Abrahamyan', firstName: 'Alik', lastName: 'Abrahamyan' },
    { id: 57, firstNameArm: 'Narek', lastNameArm: 'Hambardzumyan', firstName: 'Narek', lastName: 'Hambardzumyan' },
  ];

  // Positions to randomly assign
  private positions = [
    'Software Engineer',
    'Senior Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'QA Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Project Manager',
    'Team Lead',
    'Technical Lead',
    'Data Analyst',
    'System Administrator',
    'Mobile Developer',
  ];

  // English levels
  private englishLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  private generateEmail(firstName: string, lastName: string, id: number): string {
    const normalizedFirst = firstName.toLowerCase().replace(/\s+/g, '');
    const normalizedLast = lastName.toLowerCase().replace(/\s+/g, '');
    return `${normalizedFirst}.${normalizedLast}${id}@inorain.com`;
  }

  private getRandomPosition(): string {
    return this.positions[Math.floor(Math.random() * this.positions.length)];
  }

  private getRandomEnglishLevel(): string {
    return this.englishLevels[Math.floor(Math.random() * this.englishLevels.length)];
  }

  private getRandomHireDate(): string {
    const start = new Date('2020-01-01');
    const end = new Date('2024-12-31');
    const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
    return randomDate.toISOString().split('T')[0];
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, clean up existing employee-related data to avoid conflicts
    await queryRunner.query(`DELETE FROM "project_assignments"`);
    await queryRunner.query(`DELETE FROM "employee_skills"`);
    await queryRunner.query(`DELETE FROM "vacations"`);
    await queryRunner.query(`DELETE FROM "employees"`);

    // Get department IDs for assignment
    const departments = await queryRunner.query(`SELECT id, name FROM departments`);
    const teams = await queryRunner.query(`SELECT id, name, "departmentId" FROM teams`);

    // Insert all employees from the CSV data
    for (const emp of this.employees) {
      const email = this.generateEmail(emp.firstName, emp.lastName, emp.id);
      const position = this.getRandomPosition();
      const englishLevel = this.getRandomEnglishLevel();
      const hireDate = this.getRandomHireDate();

      // Assign to random department and team
      const randomDept = departments[Math.floor(Math.random() * departments.length)];
      const deptTeams = teams.filter((t: { departmentId: number }) => t.departmentId === randomDept.id);
      const randomTeam = deptTeams.length > 0 ? deptTeams[Math.floor(Math.random() * deptTeams.length)] : null;

      await queryRunner.query(
        `
        INSERT INTO "employees" (
          "firstName",
          "lastName",
          "email",
          "position",
          "departmentId",
          "teamId",
          "englishLevel",
          "hireDate",
          "status",
          "employmentType",
          "workLocation",
          "timezone"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', 'full_time', 'office', 'Asia/Yerevan')
      `,
        [
          emp.firstName,
          emp.lastName,
          email,
          position,
          randomDept?.id || null,
          randomTeam?.id || null,
          englishLevel,
          hireDate,
        ],
      );
    }

    console.log(`✅ Successfully seeded ${this.employees.length} employees from users-list.csv`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove all employees seeded by this migration
    await queryRunner.query(`DELETE FROM "project_assignments"`);
    await queryRunner.query(`DELETE FROM "employee_skills"`);
    await queryRunner.query(`DELETE FROM "vacations"`);
    await queryRunner.query(`DELETE FROM "employees"`);

    console.log('✅ Rolled back employees seeded from CSV');
  }
}

