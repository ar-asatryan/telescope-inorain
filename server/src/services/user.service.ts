import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'
import { FindManyOptions, Like, ILike } from 'typeorm'

const userRepository = AppDataSource.getRepository(User)

interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}

interface UpdateUserData {
  email?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  isActive?: boolean
}

interface GetUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
}

export const userService = {
  async getUsers(options: GetUsersOptions = {}) {
    const { page = 1, limit = 10, search, role } = options

    const queryOptions: FindManyOptions<User> = {
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where: {},
    }

    if (search) {
      queryOptions.where = [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ]
    }

    if (role) {
      if (Array.isArray(queryOptions.where)) {
        queryOptions.where = queryOptions.where.map(w => ({ ...w, role }))
      } else {
        queryOptions.where = { ...queryOptions.where, role }
      }
    }

    const [users, total] = await userRepository.findAndCount(queryOptions)

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  async getUserById(id: number) {
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      employeeId: user.employeeId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  },

  async createUser(data: CreateUserData) {
    const existingUser = await userRepository.findOne({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const user = userRepository.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || UserRole.EMPLOYEE,
    })

    await userRepository.save(user)

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }
  },

  async updateUser(id: number, data: UpdateUserData) {
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found')
    }

    // Check for email uniqueness if email is being updated
    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.findOne({
        where: { email: data.email },
      })
      if (existingUser) {
        throw new Error('Email already in use')
      }
    }

    Object.assign(user, data)
    await userRepository.save(user)

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      updatedAt: user.updatedAt,
    }
  },

  async deleteUser(id: number) {
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found')
    }

    await userRepository.remove(user)

    return { message: 'User deleted successfully' }
  },

  async toggleUserStatus(id: number) {
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found')
    }

    user.isActive = !user.isActive
    await userRepository.save(user)

    return {
      id: user.id,
      isActive: user.isActive,
    }
  },
}


