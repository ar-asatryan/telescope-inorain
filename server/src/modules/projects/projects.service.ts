import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../../database/entities/project.entity';
import { ProjectAssignment } from '../../database/entities/project-assignment.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { AddAssignmentDto } from './dto/add-assignment.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectAssignment)
    private readonly assignmentRepository: Repository<ProjectAssignment>,
  ) {}

  async findAll(query: QueryProjectsDto): Promise<PaginatedResult<Project>> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.assignments', 'assignments', 'assignments.isActive = true')
      .leftJoin('assignments.employee', 'employee')
      .addSelect(['assignments.id', 'assignments.role'])
      .addSelect(['employee.id', 'employee.firstName', 'employee.lastName']);

    if (status) {
      queryBuilder.where('project.status = :status', { status });
    }

    const [projects, total] = await queryBuilder
      .orderBy('project.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.assignments', 'assignments')
      .leftJoin('assignments.employee', 'employee')
      .addSelect(['employee.id', 'employee.firstName', 'employee.lastName', 'employee.position'])
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  /**
   * Get project team with employee skills
   * Optimized with selective joins
   */
  async getTeam(projectId: number) {
    return this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.employee', 'employee')
      .leftJoinAndSelect('employee.skills', 'skills')
      .leftJoinAndSelect('skills.skill', 'skill')
      .where('assignment.projectId = :projectId', { projectId })
      .andWhere('assignment.isActive = true')
      .orderBy('assignment.role', 'ASC')
      .getMany();
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...dto,
      status: dto.status || ProjectStatus.PLANNING,
    });
    return this.projectRepository.save(project);
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await this.projectRepository.remove(project);
  }

  async addAssignment(projectId: number, dto: AddAssignmentDto): Promise<ProjectAssignment> {
    // Check for existing active assignment
    const existing = await this.assignmentRepository.findOne({
      where: { projectId, employeeId: dto.employeeId, isActive: true },
    });

    if (existing) {
      throw new ConflictException('Employee is already assigned to this project');
    }

    const assignment = this.assignmentRepository.create({
      projectId,
      ...dto,
    });

    return this.assignmentRepository.save(assignment);
  }

  async removeAssignment(assignmentId: number): Promise<void> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Soft delete by marking as inactive
    assignment.isActive = false;
    assignment.endDate = new Date();
    await this.assignmentRepository.save(assignment);
  }
}

