import 'reflect-metadata'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'
import { Department } from '../entities/Department'
import { Team } from '../entities/Team'
import { Skill, SkillCategory } from '../entities/Skill'
import { Employee, EmployeeStatus, EnglishLevel } from '../entities/Employee'
import { EmployeeSkill, SkillLevel } from '../entities/EmployeeSkill'
import { logger } from '../utils/logger'

async function seed() {
  try {
    await AppDataSource.initialize()
    logger.info('Database connection established')

    // Clear existing data (in development only)
    await AppDataSource.synchronize(true)
    logger.info('Database synchronized')

    // Create admin user
    const userRepository = AppDataSource.getRepository(User)
    const adminUser = userRepository.create({
      email: 'admin@inorain.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    })
    await userRepository.save(adminUser)
    logger.info('Admin user created')

    // Create departments
    const departmentRepository = AppDataSource.getRepository(Department)
    const departments = await departmentRepository.save([
      { name: 'Engineering', description: 'Software development team' },
      { name: 'Design', description: 'UI/UX and product design' },
      { name: 'Product', description: 'Product management' },
      { name: 'HR', description: 'Human resources' },
    ])
    logger.info('Departments created')

    // Create teams
    const teamRepository = AppDataSource.getRepository(Team)
    const teams = await teamRepository.save([
      { name: 'Platform', departmentId: departments[0].id, description: 'Core platform development' },
      { name: 'API', departmentId: departments[0].id, description: 'API and backend services' },
      { name: 'Infrastructure', departmentId: departments[0].id, description: 'DevOps and infrastructure' },
      { name: 'Quality', departmentId: departments[0].id, description: 'QA and testing' },
      { name: 'Product Design', departmentId: departments[1].id, description: 'Product UI/UX design' },
      { name: 'Product Management', departmentId: departments[2].id, description: 'Product strategy' },
    ])
    logger.info('Teams created')

    // Create skills
    const skillRepository = AppDataSource.getRepository(Skill)
    const skills = await skillRepository.save([
      // Frontend
      { name: 'React', category: SkillCategory.FRONTEND },
      { name: 'TypeScript', category: SkillCategory.FRONTEND },
      { name: 'Vue.js', category: SkillCategory.FRONTEND },
      { name: 'TailwindCSS', category: SkillCategory.FRONTEND },
      { name: 'Angular', category: SkillCategory.FRONTEND },
      // Backend
      { name: 'Node.js', category: SkillCategory.BACKEND },
      { name: 'Python', category: SkillCategory.BACKEND },
      { name: 'Go', category: SkillCategory.BACKEND },
      { name: 'PostgreSQL', category: SkillCategory.BACKEND },
      { name: 'MongoDB', category: SkillCategory.BACKEND },
      // DevOps
      { name: 'Docker', category: SkillCategory.DEVOPS },
      { name: 'Kubernetes', category: SkillCategory.DEVOPS },
      { name: 'AWS', category: SkillCategory.DEVOPS },
      { name: 'Terraform', category: SkillCategory.DEVOPS },
      { name: 'CI/CD', category: SkillCategory.DEVOPS },
      // Design
      { name: 'Figma', category: SkillCategory.DESIGN },
      { name: 'Adobe XD', category: SkillCategory.DESIGN },
      { name: 'UI/UX Design', category: SkillCategory.DESIGN },
    ])
    logger.info('Skills created')

    // Create employees
    const employeeRepository = AppDataSource.getRepository(Employee)
    const employees = await employeeRepository.save([
      {
        firstName: 'Anna',
        lastName: 'Hovhannisyan',
        email: 'anna.h@inorain.com',
        phone: '+374 99 123456',
        position: 'Senior Frontend Developer',
        departmentId: departments[0].id,
        teamId: teams[0].id,
        englishLevel: EnglishLevel.C1,
        hireDate: new Date('2022-03-15'),
        status: EmployeeStatus.ACTIVE,
      },
      {
        firstName: 'Tigran',
        lastName: 'Sargsyan',
        email: 'tigran.s@inorain.com',
        phone: '+374 91 234567',
        position: 'Backend Developer',
        departmentId: departments[0].id,
        teamId: teams[1].id,
        englishLevel: EnglishLevel.B2,
        hireDate: new Date('2023-01-10'),
        status: EmployeeStatus.ACTIVE,
      },
      {
        firstName: 'Maria',
        lastName: 'Petrosyan',
        email: 'maria.p@inorain.com',
        phone: '+374 93 345678',
        position: 'UI/UX Designer',
        departmentId: departments[1].id,
        teamId: teams[4].id,
        englishLevel: EnglishLevel.B2,
        hireDate: new Date('2022-07-20'),
        status: EmployeeStatus.ACTIVE,
      },
      {
        firstName: 'David',
        lastName: 'Grigoryan',
        email: 'david.g@inorain.com',
        phone: '+374 94 456789',
        position: 'DevOps Engineer',
        departmentId: departments[0].id,
        teamId: teams[2].id,
        englishLevel: EnglishLevel.C1,
        hireDate: new Date('2021-11-01'),
        status: EmployeeStatus.ACTIVE,
      },
      {
        firstName: 'Lusine',
        lastName: 'Hakobyan',
        email: 'lusine.h@inorain.com',
        phone: '+374 95 567890',
        position: 'QA Engineer',
        departmentId: departments[0].id,
        teamId: teams[3].id,
        englishLevel: EnglishLevel.B1,
        hireDate: new Date('2023-05-15'),
        status: EmployeeStatus.ACTIVE,
      },
    ])
    logger.info('Employees created')

    // Assign skills to employees
    const employeeSkillRepository = AppDataSource.getRepository(EmployeeSkill)
    await employeeSkillRepository.save([
      // Anna - Frontend
      { employeeId: employees[0].id, skillId: skills[0].id, level: SkillLevel.EXPERT, yearsOfExperience: 4 },
      { employeeId: employees[0].id, skillId: skills[1].id, level: SkillLevel.ADVANCED, yearsOfExperience: 3 },
      { employeeId: employees[0].id, skillId: skills[3].id, level: SkillLevel.EXPERT, yearsOfExperience: 3 },
      // Tigran - Backend
      { employeeId: employees[1].id, skillId: skills[5].id, level: SkillLevel.ADVANCED, yearsOfExperience: 3 },
      { employeeId: employees[1].id, skillId: skills[8].id, level: SkillLevel.INTERMEDIATE, yearsOfExperience: 2 },
      { employeeId: employees[1].id, skillId: skills[10].id, level: SkillLevel.INTERMEDIATE, yearsOfExperience: 2 },
      // Maria - Design
      { employeeId: employees[2].id, skillId: skills[15].id, level: SkillLevel.EXPERT, yearsOfExperience: 5 },
      { employeeId: employees[2].id, skillId: skills[17].id, level: SkillLevel.ADVANCED, yearsOfExperience: 4 },
      // David - DevOps
      { employeeId: employees[3].id, skillId: skills[10].id, level: SkillLevel.EXPERT, yearsOfExperience: 5 },
      { employeeId: employees[3].id, skillId: skills[11].id, level: SkillLevel.ADVANCED, yearsOfExperience: 3 },
      { employeeId: employees[3].id, skillId: skills[12].id, level: SkillLevel.EXPERT, yearsOfExperience: 4 },
      { employeeId: employees[3].id, skillId: skills[13].id, level: SkillLevel.INTERMEDIATE, yearsOfExperience: 2 },
    ])
    logger.info('Employee skills assigned')

    logger.info('✅ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    logger.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()

