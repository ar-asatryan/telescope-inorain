import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Vacation, VacationStatus } from '../../database/entities/vacation.entity';
import { Employee, EmployeeStatus } from '../../database/entities/employee.entity';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { QueryVacationsDto } from './dto/query-vacations.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(query: QueryVacationsDto): Promise<PaginatedResult<Vacation>> {
    const { page = 1, limit = 10, status, type, employeeId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.vacationRepository
      .createQueryBuilder('vacation')
      .leftJoin('vacation.employee', 'employee')
      .addSelect(['employee.id', 'employee.firstName', 'employee.lastName'])
      .leftJoin('vacation.approvedBy', 'approvedBy')
      .addSelect(['approvedBy.id', 'approvedBy.firstName', 'approvedBy.lastName']);

    if (status) {
      queryBuilder.andWhere('vacation.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('vacation.type = :type', { type });
    }

    if (employeeId) {
      queryBuilder.andWhere('vacation.employeeId = :employeeId', { employeeId });
    }

    const [vacations, total] = await queryBuilder
      .orderBy('vacation.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: vacations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Vacation> {
    const vacation = await this.vacationRepository
      .createQueryBuilder('vacation')
      .leftJoinAndSelect('vacation.employee', 'employee')
      .leftJoin('vacation.approvedBy', 'approvedBy')
      .addSelect(['approvedBy.id', 'approvedBy.firstName', 'approvedBy.lastName'])
      .where('vacation.id = :id', { id })
      .getOne();

    if (!vacation) {
      throw new NotFoundException(`Vacation with ID ${id} not found`);
    }

    return vacation;
  }

  async create(dto: CreateVacationDto): Promise<Vacation> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check for overlapping vacations
    const overlapping = await this.vacationRepository
      .createQueryBuilder('vacation')
      .where('vacation.employeeId = :employeeId', { employeeId: dto.employeeId })
      .andWhere('vacation.status NOT IN (:...statuses)', {
        statuses: [VacationStatus.REJECTED, VacationStatus.CANCELLED],
      })
      .andWhere(
        '(vacation.startDate <= :endDate AND vacation.endDate >= :startDate)',
        { startDate: dto.startDate, endDate: dto.endDate },
      )
      .getOne();

    if (overlapping) {
      throw new BadRequestException('Overlapping vacation request exists');
    }

    const vacation = this.vacationRepository.create(dto);
    return this.vacationRepository.save(vacation);
  }

  async approve(id: number, approvedById: number): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!vacation) {
      throw new NotFoundException('Vacation request not found');
    }

    if (vacation.status !== VacationStatus.PENDING) {
      throw new BadRequestException('Can only approve pending vacation requests');
    }

    vacation.status = VacationStatus.APPROVED;
    vacation.approvedById = approvedById;
    vacation.approvedAt = new Date();

    // Update employee status if vacation starts today or earlier
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(vacation.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      await this.employeeRepository.update(vacation.employeeId, {
        status: EmployeeStatus.VACATION,
      });
    }

    return this.vacationRepository.save(vacation);
  }

  async reject(id: number, approvedById: number, rejectionReason?: string): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({ where: { id } });

    if (!vacation) {
      throw new NotFoundException('Vacation request not found');
    }

    if (vacation.status !== VacationStatus.PENDING) {
      throw new BadRequestException('Can only reject pending vacation requests');
    }

    vacation.status = VacationStatus.REJECTED;
    vacation.approvedById = approvedById;
    vacation.approvedAt = new Date();
    vacation.rejectionReason = rejectionReason || '';

    return this.vacationRepository.save(vacation);
  }

  async cancel(id: number): Promise<Vacation> {
    const vacation = await this.vacationRepository.findOne({ where: { id } });

    if (!vacation) {
      throw new NotFoundException('Vacation request not found');
    }

    if (vacation.status === VacationStatus.CANCELLED) {
      throw new BadRequestException('Vacation is already cancelled');
    }

    vacation.status = VacationStatus.CANCELLED;

    return this.vacationRepository.save(vacation);
  }
}

