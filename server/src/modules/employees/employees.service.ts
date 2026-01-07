import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Employee } from '../../database/entities/employee.entity';
import { EmployeeSkill } from '../../database/entities/employee-skill.entity';
import { Vacation, VacationStatus, VacationType } from '../../database/entities/vacation.entity';
import { ProjectAssignment } from '../../database/entities/project-assignment.entity';
import { Team } from '../../database/entities/team.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeesDto } from './dto/query-employees.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

export interface VacationBalance {
  annualVacationDays: number;
  bonusVacationDays: number;
  totalVacationDays: number;
  usedVacationDays: number;
  remainingVacationDays: number;
  pendingVacationDays: number;
  annualSickLeaveDays: number;
  usedSickLeaveDays: number;
  remainingSickLeaveDays: number;
}

export interface TeamChainMember {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  role: 'employee' | 'team_lead' | 'manager' | 'department_head';
  avatarUrl?: string;
}

export interface EmployeeDetailedProfile {
  employee: Employee;
  skills: EmployeeSkill[];
  currentProjects: ProjectAssignment[];
  teamChain: TeamChainMember[];
  vacationBalance: VacationBalance;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeSkill)
    private readonly employeeSkillRepository: Repository<EmployeeSkill>,
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    @InjectRepository(ProjectAssignment)
    private readonly projectAssignmentRepository: Repository<ProjectAssignment>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  /**
   * Find all employees with optimized query and pagination
   * Uses query builder for better control and performance
   */
  async findAll(query: QueryEmployeesDto): Promise<PaginatedResult<Employee>> {
    const { page = 1, limit = 10, search, departmentId, teamId, status, projectId } = query;
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

    if (projectId) {
      // Filter employees assigned to a specific project
      queryBuilder.andWhere(
        `employee.id IN (
          SELECT pa."employeeId" FROM project_assignments pa 
          WHERE pa."projectId" = :projectId AND pa."isActive" = true
        )`,
        { projectId }
      );
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

  /**
   * Get employee's current active project assignments
   */
  async getCurrentProjects(employeeId: number): Promise<ProjectAssignment[]> {
    return this.projectAssignmentRepository
      .createQueryBuilder('pa')
      .leftJoinAndSelect('pa.project', 'project')
      .where('pa.employeeId = :employeeId', { employeeId })
      .andWhere('pa.isActive = :isActive', { isActive: true })
      .orderBy('pa.startDate', 'DESC')
      .getMany();
  }

  /**
   * Calculate vacation balance for an employee
   * Takes into account approved vacations in current year
   */
  async calculateVacationBalance(employeeId: number): Promise<VacationBalance> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      select: ['id', 'annualVacationDays', 'bonusVacationDays', 'annualSickLeaveDays'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    // Get current year boundaries
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    // Get all vacations for current year
    const vacations = await this.vacationRepository
      .createQueryBuilder('v')
      .where('v.employeeId = :employeeId', { employeeId })
      .andWhere('v.startDate >= :yearStart', { yearStart })
      .andWhere('v.endDate <= :yearEnd', { yearEnd })
      .getMany();

    // Calculate used vacation days (approved)
    let usedVacationDays = 0;
    let pendingVacationDays = 0;
    let usedSickLeaveDays = 0;

    for (const vacation of vacations) {
      const days = this.calculateWorkingDays(vacation.startDate, vacation.endDate);

      if (vacation.type === VacationType.VACATION || vacation.type === VacationType.DAY_OFF) {
        if (vacation.status === VacationStatus.APPROVED) {
          usedVacationDays += days;
        } else if (vacation.status === VacationStatus.PENDING) {
          pendingVacationDays += days;
        }
      } else if (vacation.type === VacationType.SICK_LEAVE) {
        if (vacation.status === VacationStatus.APPROVED) {
          usedSickLeaveDays += days;
        }
      }
    }

    const totalVacationDays = employee.annualVacationDays + employee.bonusVacationDays;

    return {
      annualVacationDays: employee.annualVacationDays,
      bonusVacationDays: employee.bonusVacationDays,
      totalVacationDays,
      usedVacationDays,
      remainingVacationDays: totalVacationDays - usedVacationDays,
      pendingVacationDays,
      annualSickLeaveDays: employee.annualSickLeaveDays,
      usedSickLeaveDays,
      remainingSickLeaveDays: employee.annualSickLeaveDays - usedSickLeaveDays,
    };
  }

  /**
   * Calculate working days between two dates (excludes weekends)
   */
  private calculateWorkingDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  /**
   * Get team chain for an employee
   * Returns: Employee → Team Lead → Manager → Department Head
   */
  async getTeamChain(employeeId: number): Promise<TeamChainMember[]> {
    const chain: TeamChainMember[] = [];
    const visitedIds = new Set<number>();

    // Get the employee with team and manager info
    const employee = await this.employeeRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.team', 'team')
      .leftJoinAndSelect('team.lead', 'teamLead')
      .leftJoinAndSelect('team.department', 'department')
      .leftJoinAndSelect('department.head', 'departmentHead')
      .leftJoinAndSelect('e.manager', 'manager')
      .where('e.id = :employeeId', { employeeId })
      .getOne();

    if (!employee) {
      return chain;
    }

    // Add the employee themselves
    chain.push({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      role: 'employee',
      avatarUrl: employee.avatarUrl,
    });
    visitedIds.add(employee.id);

    // Recursively traverse up the manager chain
    let currentManagerId = employee.managerId;
    while (currentManagerId && !visitedIds.has(currentManagerId)) {
      const manager = await this.employeeRepository.findOne({
        where: { id: currentManagerId },
        select: ['id', 'firstName', 'lastName', 'position', 'managerId', 'avatarUrl'],
      });

      if (!manager) break;

      // Determine role based on position or order in hierarchy
      let role: 'manager' | 'team_lead' | 'department_head' = 'manager';
      const posLower = manager.position?.toLowerCase() || '';
      if (posLower.includes('department head') || posLower.includes('director')) {
        role = 'department_head';
      } else if (posLower.includes('team lead') || posLower.includes('lead')) {
        role = 'team_lead';
      }

      chain.push({
        id: manager.id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        position: manager.position,
        role,
        avatarUrl: manager.avatarUrl,
      });

      visitedIds.add(manager.id);
      currentManagerId = manager.managerId;
    }

    // Also check team lead if not already in chain
    if (employee.team?.lead && !visitedIds.has(employee.team.lead.id)) {
      chain.push({
        id: employee.team.lead.id,
        firstName: employee.team.lead.firstName,
        lastName: employee.team.lead.lastName,
        position: employee.team.lead.position,
        role: 'team_lead',
        avatarUrl: employee.team.lead.avatarUrl,
      });
      visitedIds.add(employee.team.lead.id);
    }

    // Add department head if exists and is different from others
    if (employee.team?.department?.head && !visitedIds.has(employee.team.department.head.id)) {
      const deptHead = employee.team.department.head;
      chain.push({
        id: deptHead.id,
        firstName: deptHead.firstName,
        lastName: deptHead.lastName,
        position: deptHead.position,
        role: 'department_head',
        avatarUrl: deptHead.avatarUrl,
      });
    }

    return chain;
  }

  /**
   * Get comprehensive employee profile with all related data
   */
  async getDetailedProfile(employeeId: number): Promise<EmployeeDetailedProfile> {
    const [employee, skills, currentProjects, vacationBalance, teamChain] = await Promise.all([
      this.findOne(employeeId),
      this.getSkills(employeeId),
      this.getCurrentProjects(employeeId),
      this.calculateVacationBalance(employeeId),
      this.getTeamChain(employeeId),
    ]);

    return {
      employee,
      skills,
      currentProjects,
      teamChain,
      vacationBalance,
    };
  }
}

