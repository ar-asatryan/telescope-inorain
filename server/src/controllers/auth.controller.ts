import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { logger } from '../utils/logger'

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role } = req.body
      const result = await authService.register({ email, password, firstName, lastName, role })

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      })
    } catch (error) {
      logger.error('Registration error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      })
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await authService.login({ email, password })

      res.json({
        success: true,
        message: 'Login successful',
        data: result,
      })
    } catch (error) {
      logger.error('Login error:', error)
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      })
    }
  },

  async logout(req: Request, res: Response) {
    // In JWT auth, logout is typically handled client-side
    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  },

  async me(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated',
        })
      }

      const user = await authService.getCurrentUser(req.userId)

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      logger.error('Get current user error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user',
      })
    }
  },
}

