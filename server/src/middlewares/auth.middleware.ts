import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { AppDataSource } from '../config/database'
import { User, UserRole } from '../entities/User'

interface JwtPayload {
  userId: number
  email: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: User
      userId?: number
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({
      where: { id: decoded.userId, isActive: true },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
      })
    }

    req.user = user
    req.userId = user.id
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      })
    }

    next()
  }
}



