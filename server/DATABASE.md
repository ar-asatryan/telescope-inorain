# Telescope Database Guide

This document provides comprehensive guidance on working with the database in the Telescope backend.

## Table of Contents

1. [Overview](#overview)
2. [Database Setup](#database-setup)
3. [Folder Structure](#folder-structure)
4. [Entities & Relationships](#entities--relationships)
5. [Running Migrations](#running-migrations)
6. [Creating New Migrations](#creating-new-migrations)
7. [Seeding Data](#seeding-data)
8. [CRUD Operations](#crud-operations)
9. [Query Optimization](#query-optimization)
10. [Common Commands](#common-commands)

---

## Overview

Telescope uses **PostgreSQL** as its database with **TypeORM** as the Object-Relational Mapping (ORM) framework integrated with **NestJS**.

### Tech Stack
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM 0.3.x
- **Framework**: NestJS with @nestjs/typeorm

---

## Database Setup

### Prerequisites
- PostgreSQL 14 or higher installed
- Node.js 18+ and npm

### 1. Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE telescope_db;
CREATE USER telescope WITH PASSWORD 'telescope123';
GRANT ALL PRIVILEGES ON DATABASE telescope_db TO telescope;

# Exit
\q
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=telescope
DB_PASSWORD=telescope123
DB_DATABASE=telescope_db
DB_SYNCHRONIZE=false
DB_LOGGING=true

# Application
NODE_ENV=development
PORT=9999
API_PREFIX=/api

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

### 3. Run Migrations

```bash
cd server
npm install
npm run migration:run
```

---

## Folder Structure

```
server/src/
├── database/
│   ├── entities/              # TypeORM entity definitions
│   │   ├── user.entity.ts
│   │   ├── employee.entity.ts
│   │   ├── department.entity.ts
│   │   ├── team.entity.ts
│   │   ├── skill.entity.ts
│   │   ├── employee-skill.entity.ts
│   │   ├── vacation.entity.ts
│   │   ├── project.entity.ts
│   │   ├── project-assignment.entity.ts
│   │   └── index.ts           # Barrel export file
│   ├── migrations/            # Database migrations
│   │   ├── 1702800000000-InitialSchema.ts
│   │   └── 1702800000001-SeedData.ts
│   ├── seeds/                 # Seed scripts
│   │   └── run-seed.ts
│   ├── data-source.ts         # TypeORM CLI data source
│   └── typeorm.config.ts      # NestJS TypeORM configuration
├── modules/
│   └── [module]/
│       └── dto/               # Data Transfer Objects for validation
└── config/
    └── configuration.ts       # Application configuration
```

---

## Entities & Relationships

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │  Department │───1:N─│    Team     │
└─────────────┘       └─────────────┘       └─────────────┘
                            │                      │
                           1:N                    1:N
                            │                      │
                      ┌─────────────┐              │
                      │  Employee   │◄─────────────┘
                      └─────────────┘
                       │     │    │
                      1:N   1:N  1:N
                       │     │    │
           ┌───────────┘     │    └───────────┐
           │                 │                │
    ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
    │EmployeeSkill │  │   Vacation   │  │ProjectAssignment│
    └──────────────┘  └──────────────┘  └─────────────────┘
           │                                    │
          N:1                                  N:1
           │                                    │
    ┌──────────────┐                    ┌──────────────┐
    │    Skill     │                    │   Project    │
    └──────────────┘                    └──────────────┘
```

### Entity Descriptions

| Entity | Description |
|--------|-------------|
| `User` | System users for authentication (admin, manager, employee roles) |
| `Employee` | Employee profiles with personal and work information |
| `Department` | Organizational departments |
| `Team` | Teams within departments |
| `Skill` | Technical and soft skills catalog |
| `EmployeeSkill` | Junction table linking employees to skills with levels |
| `Vacation` | Time-off requests (vacation, sick leave, etc.) |
| `Project` | Project definitions |
| `ProjectAssignment` | Employee assignments to projects |

---

## Running Migrations

### Show Migration Status

```bash
npm run migration:show
```

### Run Pending Migrations

```bash
npm run migration:run
```

### Revert Last Migration

```bash
npm run migration:revert
```

### Reset Database (DROP + MIGRATE)

```bash
npm run db:reset
```

---

## Creating New Migrations

### Method 1: Auto-generate from Entity Changes

After modifying entities:

```bash
npm run migration:generate src/database/migrations/YourMigrationName
```

### Method 2: Create Empty Migration

```bash
npm run migration:create src/database/migrations/YourMigrationName
```

### Migration File Structure

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class YourMigrationName1234567890 implements MigrationInterface {
  name = 'YourMigrationName1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your forward migration SQL here
    await queryRunner.query(`
      ALTER TABLE "employees" ADD COLUMN "new_column" VARCHAR(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add your rollback migration SQL here
    await queryRunner.query(`
      ALTER TABLE "employees" DROP COLUMN "new_column"
    `);
  }
}
```

---

## Seeding Data

### Run Seeds

```bash
npm run seed
```

### Creating Custom Seeds

Create a new file in `src/database/seeds/`:

```typescript
import { DataSource } from 'typeorm';
import { Employee } from '../entities/employee.entity';

export async function seedEmployees(dataSource: DataSource) {
  const employeeRepository = dataSource.getRepository(Employee);
  
  await employeeRepository.save([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      hireDate: new Date('2024-01-15'),
    },
  ]);
}
```

---

## CRUD Operations

### Creating Records

```typescript
// In a service file
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../database/entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // CREATE
  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(dto);
    return this.employeeRepository.save(employee);
  }

  // READ (single)
  async findOne(id: number): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'team'],
    });
  }

  // READ (all with filters)
  async findAll(query: QueryDto): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { status: query.status },
      order: { lastName: 'ASC' },
    });
  }

  // UPDATE
  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    Object.assign(employee, dto);
    return this.employeeRepository.save(employee);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    await this.employeeRepository.remove(employee);
  }
}
```

---

## Query Optimization

### 1. Use Query Builder for Complex Queries

```typescript
// GOOD: Selective loading with Query Builder
async findAllOptimized() {
  return this.employeeRepository
    .createQueryBuilder('employee')
    .leftJoin('employee.department', 'department')
    .addSelect(['department.id', 'department.name']) // Only select needed columns
    .leftJoin('employee.team', 'team')
    .addSelect(['team.id', 'team.name'])
    .where('employee.status = :status', { status: 'active' })
    .orderBy('employee.lastName', 'ASC')
    .getMany();
}

// BAD: Loading all relations with all columns
async findAllUnoptimized() {
  return this.employeeRepository.find({
    relations: ['department', 'team', 'skills', 'vacations'], // Over-fetching
  });
}
```

### 2. Use Indexes

Indexes are defined in entities using decorators:

```typescript
@Entity('employees')
@Index(['email'], { unique: true })  // Unique index
@Index(['status'])                    // Regular index
@Index(['departmentId', 'teamId'])    // Composite index
export class Employee {
  // ...
}
```

### 3. Pagination

Always paginate large result sets:

```typescript
async findPaginated(page = 1, limit = 10) {
  const [data, total] = await this.employeeRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

### 4. Avoid N+1 Problem

```typescript
// GOOD: Use joins in single query
const employees = await this.employeeRepository
  .createQueryBuilder('e')
  .leftJoinAndSelect('e.skills', 'skills')
  .leftJoinAndSelect('skills.skill', 'skill')
  .getMany();

// BAD: N+1 queries
const employees = await this.employeeRepository.find();
for (const emp of employees) {
  emp.skills = await this.skillRepository.find({ where: { employeeId: emp.id } });
}
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run migration:show` | Show migration status |
| `npm run migration:generate` | Generate migration from entity changes |
| `npm run migration:create` | Create empty migration |
| `npm run db:drop` | Drop all tables |
| `npm run db:sync` | Sync schema (⚠️ dev only) |
| `npm run db:reset` | Drop + migrate |
| `npm run seed` | Run database seeds |

---

## Troubleshooting

### Connection Issues

1. Check PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Verify connection settings in `.env`

3. Check PostgreSQL logs:
   ```bash
   tail -f /var/log/postgresql/postgresql-14-main.log
   ```

### Migration Errors

1. Check migration file syntax
2. Ensure TypeORM CLI can find data-source:
   ```bash
   npm run typeorm -- migration:show -d src/database/data-source.ts
   ```

### Performance Issues

1. Enable query logging:
   ```env
   DB_LOGGING=true
   ```

2. Check for missing indexes using `EXPLAIN ANALYZE`:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM employees WHERE status = 'active';
   ```

---

## Best Practices

1. **Always use migrations** - Never use `synchronize: true` in production
2. **Test migrations** - Run migrations on a copy of production data before deploying
3. **Use transactions** - Wrap related operations in transactions
4. **Index wisely** - Add indexes for frequently queried columns
5. **Validate input** - Use DTOs with class-validator
6. **Handle errors** - Use try-catch and proper error responses
7. **Use relations carefully** - Only load relations when needed
8. **Paginate results** - Never return unbounded result sets

---

## Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

