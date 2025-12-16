import { Request, Response } from 'express'
import { employeeService } from '../services/employee.service'
import { logger } from '../utils/logger'

export const employeeController = {
  async getAll(req: Request, res: Response) {
    try {
      const { search, departmentId, teamId, status, page, limit } = req.query

      const result = await employeeService.getAll({
        search: search as string,
        departmentId: departmentId ? Number(departmentId) : undefined,
        teamId: teamId ? Number(teamId) : undefined,
        status: status as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      })

      res.json({
        success: true,
        ...result,
      })
    } catch (error) {
      logger.error('Get employees error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch employees',
      })
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const employee = await employeeService.getById(Number(id))

      res.json({
        success: true,
        data: employee,
      })
    } catch (error) {
      logger.error('Get employee error:', error)
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Employee not found',
      })
    }
  },

  async create(req: Request, res: Response) {
    try {
      const employee = await employeeService.create(req.body)

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee,
      })
    } catch (error) {
      logger.error('Create employee error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create employee',
      })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const employee = await employeeService.update(Number(id), req.body)

      res.json({
        success: true,
        message: 'Employee updated successfully',
        data: employee,
      })
    } catch (error) {
      logger.error('Update employee error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update employee',
      })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      await employeeService.delete(Number(id))

      res.json({
        success: true,
        message: 'Employee deleted successfully',
      })
    } catch (error) {
      logger.error('Delete employee error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete employee',
      })
    }
  },

  async getSkills(req: Request, res: Response) {
    try {
      const { id } = req.params
      const skills = await employeeService.getSkills(Number(id))

      res.json({
        success: true,
        data: skills,
      })
    } catch (error) {
      logger.error('Get employee skills error:', error)
      res.status(400).json({
        success: false,
        message: 'Failed to fetch employee skills',
      })
    }
  },

  async addSkill(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { skillId, level, yearsOfExperience } = req.body

      const employeeSkill = await employeeService.addSkill(
        Number(id),
        Number(skillId),
        Number(level),
        Number(yearsOfExperience)
      )

      res.status(201).json({
        success: true,
        message: 'Skill added successfully',
        data: employeeSkill,
      })
    } catch (error) {
      logger.error('Add employee skill error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add skill',
      })
    }
  },

  async getVacations(req: Request, res: Response) {
    try {
      const { id } = req.params
      const vacations = await employeeService.getVacations(Number(id))

      res.json({
        success: true,
        data: vacations,
      })
    } catch (error) {
      logger.error('Get employee vacations error:', error)
      res.status(400).json({
        success: false,
        message: 'Failed to fetch employee vacations',
      })
    }
  },
}

