import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'
import { config } from '../config/env'

const userRepository = AppDataSource.getRepository(User)

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}

interface LoginData {
  email: string
  password: string
}

export const authService = {
  async register(data: RegisterData) {
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

    const token = this.generateToken(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    }
  },

  async login(data: LoginData) {
    const user = await userRepository.findOne({
      where: { email: data.email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive'],
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated')
    }

    const isPasswordValid = await user.comparePassword(data.password)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    const token = this.generateToken(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    }
  },

  async getCurrentUser(userId: number) {
    const user = await userRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  },

  generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )
  },
}


