import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../database/entities/employee.entity';
import { EmployeeSkill } from '../../database/entities/employee-skill.entity';
import { Vacation } from '../../database/entities/vacation.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeesDto } from './dto/query-employees.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeSkill)
    private readonly employeeSkillRepository: Repository<EmployeeSkill>,
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
  ) {}

  /**
   * Find all employees with optimized query and pagination
   * Uses query builder for better control and performance
   */
  async findAll(query: QueryEmployeesDto): Promise<PaginatedResult<Employee>> {
    const { page = 1, limit = 10, search, departmentId, teamId, status } = query;
    const skip = (page - 1) * limit;

    // Build optimized query with selective joins
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      // Use LEFT JOIN with SELECT to avoid N+1 and load only needed columns
      .leftJoin('employee.department', 'department')
      .leftJoin('employee.team', 'team')
      .leftJoin('employee.manager', 'manager')
      .addSelect(['department.id', 'department.name'])
      .addSelect(['team.id', 'team.name'])
      .addSelect(['manager.id', 'manager.firstName', 'manager.lastName']);

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        `(
          employee.firstName ILIKE :search OR 
          employee.lastName ILIKE :search OR 
          employee.email ILIKE :search OR 
          employee.position ILIKE :search OR
          CONCAT(employee.firstName, ' ', employee.lastName) ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    if (departmentId) {
      queryBuilder.andWhere('employee.departmentId = :departmentId', { departmentId });
    }

    if (teamId) {
      queryBuilder.andWhere('employee.teamId = :teamId', { teamId });
    }

    if (status) {
      queryBuilder.andWhere('employee.status = :status', { status });
    }

    // Get paginated results with count
    const [employees, total] = await queryBuilder
      .orderBy('employee.lastName', 'ASC')
      .addOrderBy('employee.firstName', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: employees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find single employee with full details
   * Optimized with selective relation loading
   */
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.team', 'team')
      .leftJoin('employee.manager', 'manager')
      .addSelect(['manager.id', 'manager.firstName', 'manager.lastName', 'manager.email'])
      .leftJoinAndSelect('employee.skills', 'skills')
      .leftJoinAndSelect('skills.skill', 'skill')
      .where('employee.id = :id', { id })
      .getOne();

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    // Check for existing email
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee with this email already exists');
    }

    const employee = this.employeeRepository.create({
      ...dto,
      email: dto.email.toLowerCase(),
    });

    return this.employeeRepository.save(employee);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Check email uniqueness if updating email
    if (dto.email && dto.email.toLowerCase() !== employee.email) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (existingEmployee) {
        throw new ConflictException('Email already in use');
      }
      dto.email = dto.email.toLowerCase();
    }

    Object.assign(employee, dto);
    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    await this.employeeRepository.remove(employee);
  }

  /**
   * Get employee skills with skill details
   * Optimized query with proper joins
   */
  async getSkills(employeeId: number): Promise<EmployeeSkill[]> {
    return this.employeeSkillRepository
      .createQueryBuilder('es')
      .leftJoinAndSelect('es.skill', 'skill')
      .where('es.employeeId = :employeeId', { employeeId })
      .orderBy('skill.category', 'ASC')
      .addOrderBy('skill.name', 'ASC')
      .getMany();
  }

  async addSkill(employeeId: number, dto: AddSkillDto): Promise<EmployeeSkill> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    // Check if skill already exists for employee (upsert)
    const existingSkill = await this.employeeSkillRepository.findOne({
      where: { employeeId, skillId: dto.skillId },
    });

    if (existingSkill) {
      // Update existing
      existingSkill.level = dto.level;
      existingSkill.yearsOfExperience = dto.yearsOfExperience;
      return this.employeeSkillRepository.save(existingSkill);
    }

    // Create new
    const employeeSkill = this.employeeSkillRepository.create({
      employeeId,
      skillId: dto.skillId,
      level: dto.level,
      yearsOfExperience: dto.yearsOfExperience,
    });

    return this.employeeSkillRepository.save(employeeSkill);
  }

  async removeSkill(employeeId: number, skillId: number): Promise<void> {
    const employeeSkill = await this.employeeSkillRepository.findOne({
      where: { employeeId, skillId },
    });

    if (!employeeSkill) {
      throw new NotFoundException('Skill not found for this employee');
    }

    await this.employeeSkillRepository.remove(employeeSkill);
  }

  /**
   * Get employee vacations
   * Optimized with proper ordering
   */
  async getVacations(employeeId: number): Promise<Vacation[]> {
    return this.vacationRepository.find({
      where: { employeeId },
      order: { startDate: 'DESC' },
    });
  }
}

