import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../database/entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository
      .createQueryBuilder('department')
      .leftJoin('department.head', 'head')
      .addSelect(['head.id', 'head.firstName', 'head.lastName'])
      .leftJoinAndSelect('department.teams', 'teams')
      .orderBy('department.name', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoin('department.head', 'head')
      .addSelect(['head.id', 'head.firstName', 'head.lastName', 'head.email'])
      .leftJoinAndSelect('department.teams', 'teams')
      .leftJoin('teams.lead', 'teamLead')
      .addSelect(['teamLead.id', 'teamLead.firstName', 'teamLead.lastName'])
      .leftJoin('department.employees', 'employees')
      .addSelect(['employees.id', 'employees.firstName', 'employees.lastName', 'employees.position'])
      .where('department.id = :id', { id })
      .getOne();

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Department with this name already exists');
    }

    const department = this.departmentRepository.create(dto);
    return this.departmentRepository.save(department);
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    if (dto.name && dto.name !== department.name) {
      const existing = await this.departmentRepository.findOne({ where: { name: dto.name } });
      if (existing) {
        throw new ConflictException('Department with this name already exists');
      }
    }

    Object.assign(department, dto);
    return this.departmentRepository.save(department);
  }

  async remove(id: number): Promise<void> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['teams', 'employees'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    if (department.teams?.length || department.employees?.length) {
      throw new BadRequestException('Cannot delete department with teams or employees');
    }

    await this.departmentRepository.remove(department);
  }
}

