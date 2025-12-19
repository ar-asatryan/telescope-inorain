import { AppDataSource } from '../config/database'
import { Employee } from '../entities/Employee'
import { EmployeeSkill } from '../entities/EmployeeSkill'
import { Vacation } from '../entities/Vacation'
import { Like, FindOptionsWhere } from 'typeorm'

const employeeRepository = AppDataSource.getRepository(Employee)
const employeeSkillRepository = AppDataSource.getRepository(EmployeeSkill)
const vacationRepository = AppDataSource.getRepository(Vacation)

interface EmployeeFilters {
  search?: string
  departmentId?: number
  teamId?: number
  status?: string
  page?: number
  limit?: number
}

export const employeeService = {
  async getAll(filters: EmployeeFilters = {}) {
    const { search, departmentId, teamId, status, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<Employee> = {}

    if (departmentId) {
      where.departmentId = departmentId
    }

    if (teamId) {
      where.teamId = teamId
    }

    if (status) {
      where.status = status as any
    }

    const queryBuilder = employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.team', 'team')
      .leftJoinAndSelect('employee.manager', 'manager')

    if (search) {
      queryBuilder.andWhere(
        '(employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.email ILIKE :search OR employee.position ILIKE :search)',
        { search: `%${search}%` }
      )
    }

    if (departmentId) {
      queryBuilder.andWhere('employee.departmentId = :departmentId', { departmentId })
    }

    if (teamId) {
      queryBuilder.andWhere('employee.teamId = :teamId', { teamId })
    }

    if (status) {
      queryBuilder.andWhere('employee.status = :status', { status })
    }

    const [employees, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('employee.lastName', 'ASC')
      .addOrderBy('employee.firstName', 'ASC')
      .getManyAndCount()

    return {
      data: employees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  async getById(id: number) {
    const employee = await employeeRepository.findOne({
      where: { id },
      relations: ['department', 'team', 'manager', 'skills', 'skills.skill'],
    })

    if (!employee) {
      throw new Error('Employee not found')
    }

    return employee
  },

  async create(data: Partial<Employee>) {
    const employee = employeeRepository.create(data)
    return employeeRepository.save(employee)
  },

  async update(id: number, data: Partial<Employee>) {
    const employee = await employeeRepository.findOne({ where: { id } })

    if (!employee) {
      throw new Error('Employee not found')
    }

    Object.assign(employee, data)
    return employeeRepository.save(employee)
  },

  async delete(id: number) {
    const employee = await employeeRepository.findOne({ where: { id } })

    if (!employee) {
      throw new Error('Employee not found')
    }

    await employeeRepository.remove(employee)
    return { message: 'Employee deleted successfully' }
  },

  async getSkills(employeeId: number) {
    return employeeSkillRepository.find({
      where: { employeeId },
      relations: ['skill'],
    })
  },

  async addSkill(employeeId: number, skillId: number, level: number, yearsOfExperience: number) {
    const existingSkill = await employeeSkillRepository.findOne({
      where: { employeeId, skillId },
    })

    if (existingSkill) {
      existingSkill.level = level as any
      existingSkill.yearsOfExperience = yearsOfExperience
      return employeeSkillRepository.save(existingSkill)
    }

    const employeeSkill = employeeSkillRepository.create({
      employeeId,
      skillId,
      level: level as any,
      yearsOfExperience,
    })

    return employeeSkillRepository.save(employeeSkill)
  },

  async getVacations(employeeId: number) {
    return vacationRepository.find({
      where: { employeeId },
      order: { startDate: 'DESC' },
    })
  },
}


