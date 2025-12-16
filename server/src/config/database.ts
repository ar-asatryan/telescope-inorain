import { DataSource } from 'typeorm'
import { config } from './env'

// Import entities
import { Employee } from '../entities/Employee'
import { Department } from '../entities/Department'
import { Team } from '../entities/Team'
import { Skill } from '../entities/Skill'
import { EmployeeSkill } from '../entities/EmployeeSkill'
import { Vacation } from '../entities/Vacation'
import { Project } from '../entities/Project'
import { ProjectAssignment } from '../entities/ProjectAssignment'
import { User } from '../entities/User'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.nodeEnv === 'development', // Auto-sync in dev, use migrations in prod
  logging: config.nodeEnv === 'development',
  entities: [
    Employee,
    Department,
    Team,
    Skill,
    EmployeeSkill,
    Vacation,
    Project,
    ProjectAssignment,
    User,
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
})

