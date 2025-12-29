import { AppDataSource } from '../config/database'
import { Vacation, VacationStatus, VacationType } from '../entities/Vacation'
import { Employee, EmployeeStatus } from '../entities/Employee'

const vacationRepository = AppDataSource.getRepository(Vacation)
const employeeRepository = AppDataSource.getRepository(Employee)

interface VacationFilters {
  status?: VacationStatus
  type?: VacationType
  employeeId?: number
  page?: number
  limit?: number
}

interface CreateVacationData {
  employeeId: number
  type: VacationType
  startDate: Date
  endDate: Date
  reason?: string
}

export const vacationService = {
  async getAll(filters: VacationFilters = {}) {
    const { status, type, employeeId, page = 1, limit = 10 } = filters
    const skip = (page - 1) * limit

    const queryBuilder = vacationRepository
      .createQueryBuilder('vacation')
      .leftJoinAndSelect('vacation.employee', 'employee')
      .leftJoinAndSelect('vacation.approvedBy', 'approvedBy')

    if (status) {
      queryBuilder.andWhere('vacation.status = :status', { status })
    }

    if (type) {
      queryBuilder.andWhere('vacation.type = :type', { type })
    }

    if (employeeId) {
      queryBuilder.andWhere('vacation.employeeId = :employeeId', { employeeId })
    }

    const [vacations, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('vacation.createdAt', 'DESC')
      .getManyAndCount()

    return {
      data: vacations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  async getById(id: number) {
    const vacation = await vacationRepository.findOne({
      where: { id },
      relations: ['employee', 'approvedBy'],
    })

    if (!vacation) {
      throw new Error('Vacation request not found')
    }

    return vacation
  },

  async create(data: CreateVacationData) {
    // Check if employee exists
    const employee = await employeeRepository.findOne({
      where: { id: data.employeeId },
    })

    if (!employee) {
      throw new Error('Employee not found')
    }

    // Check for overlapping vacations
    const overlapping = await vacationRepository
      .createQueryBuilder('vacation')
      .where('vacation.employeeId = :employeeId', { employeeId: data.employeeId })
      .andWhere('vacation.status NOT IN (:...statuses)', {
        statuses: [VacationStatus.REJECTED, VacationStatus.CANCELLED],
      })
      .andWhere(
        '(vacation.startDate <= :endDate AND vacation.endDate >= :startDate)',
        { startDate: data.startDate, endDate: data.endDate }
      )
      .getOne()

    if (overlapping) {
      throw new Error('Overlapping vacation request exists')
    }

    const vacation = vacationRepository.create(data)
    return vacationRepository.save(vacation)
  },

  async approve(id: number, approvedById: number) {
    const vacation = await vacationRepository.findOne({
      where: { id },
      relations: ['employee'],
    })

    if (!vacation) {
      throw new Error('Vacation request not found')
    }

    if (vacation.status !== VacationStatus.PENDING) {
      throw new Error('Can only approve pending vacation requests')
    }

    vacation.status = VacationStatus.APPROVED
    vacation.approvedById = approvedById
    vacation.approvedAt = new Date()

    // Update employee status if vacation starts today or earlier
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(vacation.startDate)
    startDate.setHours(0, 0, 0, 0)

    if (startDate <= today) {
      await employeeRepository.update(vacation.employeeId, {
        status: EmployeeStatus.VACATION,
      })
    }

    return vacationRepository.save(vacation)
  },

  async reject(id: number, approvedById: number, rejectionReason?: string) {
    const vacation = await vacationRepository.findOne({ where: { id } })

    if (!vacation) {
      throw new Error('Vacation request not found')
    }

    if (vacation.status !== VacationStatus.PENDING) {
      throw new Error('Can only reject pending vacation requests')
    }

    vacation.status = VacationStatus.REJECTED
    vacation.approvedById = approvedById
    vacation.approvedAt = new Date()
    vacation.rejectionReason = rejectionReason || ''

    return vacationRepository.save(vacation)
  },

  async cancel(id: number) {
    const vacation = await vacationRepository.findOne({ where: { id } })

    if (!vacation) {
      throw new Error('Vacation request not found')
    }

    if (vacation.status === VacationStatus.CANCELLED) {
      throw new Error('Vacation is already cancelled')
    }

    vacation.status = VacationStatus.CANCELLED

    return vacationRepository.save(vacation)
  },
}



