import { Request, Response } from 'express'
import { userService } from '../services/user.service'
import { logger } from '../utils/logger'

export const userController = {
  async getUsers(req: Request, res: Response) {
    try {
      const { page, limit, search, role } = req.query

      const result = await userService.getUsers({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        role: role as any,
      })

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      logger.error('Get users error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get users',
      })
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await userService.getUserById(parseInt(id))

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      logger.error('Get user error:', error)
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'User not found',
      })
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role } = req.body
      const user = await userService.createUser({
        email,
        password,
        firstName,
        lastName,
        role,
      })

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      logger.error('Create user error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user',
      })
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { email, firstName, lastName, role, isActive } = req.body
      
      const user = await userService.updateUser(parseInt(id), {
        email,
        firstName,
        lastName,
        role,
        isActive,
      })

      res.json({
        success: true,
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      logger.error('Update user error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user',
      })
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      await userService.deleteUser(parseInt(id))

      res.json({
        success: true,
        message: 'User deleted successfully',
      })
    } catch (error) {
      logger.error('Delete user error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete user',
      })
    }
  },

  async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await userService.toggleUserStatus(parseInt(id))

      res.json({
        success: true,
        message: `User ${result.isActive ? 'activated' : 'deactivated'} successfully`,
        data: result,
      })
    } catch (error) {
      logger.error('Toggle user status error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to toggle user status',
      })
    }
  },
}



