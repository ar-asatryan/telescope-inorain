import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { AppDataSource } from '../data-source';
import { Employee, EmployeeStatus, EnglishLevel, EmploymentType, WorkLocation } from '../entities/employee.entity';
import { Department } from '../entities/department.entity';
import { Team } from '../entities/team.entity';

interface CSVEmployee {
  ID: string;
  'First Name (Armenian)': string;
  'Last Name (Armenian)': string;
  'First Name (English)': string;
  'Last Name (English)': string;
  'Full Name (Armenian)': string;
  'Full Name (English)': string;
}

// Positions to assign
const positions = [
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

const englishLevels = Object.values(EnglishLevel);

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomHireDate(): Date {
  const start = new Date('2020-01-01');
  const end = new Date('2024-12-31');
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateEmail(firstName: string, lastName: string, id: number): string {
  const normalizedFirst = firstName.toLowerCase().replace(/\s+/g, '');
  const normalizedLast = lastName.toLowerCase().replace(/\s+/g, '');
  return `${normalizedFirst}.${normalizedLast}${id}@inorain.com`;
}

async function seedEmployeesFromCSV() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Read CSV file
    const csvPath = path.resolve(__dirname, '../../../docs/users-list.csv');
    console.log(`📄 Reading CSV from: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records: CSVEmployee[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`📊 Found ${records.length} employees in CSV`);

    // Get repositories
    const employeeRepository = AppDataSource.getRepository(Employee);
    const departmentRepository = AppDataSource.getRepository(Department);
    const teamRepository = AppDataSource.getRepository(Team);

    // Get all departments and teams
    const departments = await departmentRepository.find();
    const teams = await teamRepository.find();

    if (departments.length === 0) {
      console.warn('⚠️  No departments found. Employees will be created without department assignment.');
    }

    // Clear existing employees (optional - comment out if you want to keep existing)
    console.log('🗑️  Clearing existing employees...');
    await employeeRepository
      .createQueryBuilder()
      .delete()
      .execute();
    console.log('✅ Existing employees cleared');

    // Insert new employees
    console.log('👥 Inserting employees from CSV...');
    const createdEmployees: Employee[] = [];

    for (const record of records) {
      const id = parseInt(record.ID);
      const firstName = record['First Name (English)'];
      const lastName = record['Last Name (English)'];

      if (!firstName || !lastName) {
        console.warn(`⚠️  Skipping record ID ${id}: Missing name data`);
        continue;
      }

      // Assign random department and team
      const randomDept = departments.length > 0 ? getRandomItem(departments) : null;
      const deptTeams = randomDept
        ? teams.filter((t) => t.departmentId === randomDept.id)
        : [];
      const randomTeam = deptTeams.length > 0 ? getRandomItem(deptTeams) : null;

      const employee = new Employee();
      employee.firstName = firstName;
      employee.lastName = lastName;
      employee.email = generateEmail(firstName, lastName, id);
      employee.position = getRandomItem(positions);
      employee.departmentId = randomDept?.id ?? undefined as unknown as number;
      employee.teamId = randomTeam?.id ?? undefined as unknown as number;
      employee.englishLevel = getRandomItem(englishLevels);
      employee.hireDate = getRandomHireDate();
      employee.status = EmployeeStatus.ACTIVE;
      employee.employmentType = EmploymentType.FULL_TIME;
      employee.workLocation = WorkLocation.OFFICE;
      employee.timezone = 'Asia/Yerevan';

      const saved = await employeeRepository.save(employee);
      createdEmployees.push(saved);
    }

    console.log(`\n✅ Successfully created ${createdEmployees.length} employees!`);
    console.log('\n📋 Employee Summary:');
    console.log('─'.repeat(80));
    console.log(
      'ID'.padEnd(6) +
        'Name'.padEnd(30) +
        'Email'.padEnd(35) +
        'Position'
    );
    console.log('─'.repeat(80));

    for (const emp of createdEmployees.slice(0, 10)) {
      console.log(
        String(emp.id).padEnd(6) +
          `${emp.firstName} ${emp.lastName}`.padEnd(30) +
          emp.email.padEnd(35) +
          emp.position
      );
    }

    if (createdEmployees.length > 10) {
      console.log(`... and ${createdEmployees.length - 10} more employees`);
    }

    console.log('─'.repeat(80));
    console.log('\n🎉 Database seeding completed successfully!');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedEmployeesFromCSV();

