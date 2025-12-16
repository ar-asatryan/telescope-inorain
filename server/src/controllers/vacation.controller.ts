import { Request, Response } from 'express'
import { vacationService } from '../services/vacation.service'
import { logger } from '../utils/logger'

export const vacationController = {
  async getAll(req: Request, res: Response) {
    try {
      const { status, type, employeeId, page, limit } = req.query

      const result = await vacationService.getAll({
        status: status as any,
        type: type as any,
        employeeId: employeeId ? Number(employeeId) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      })

      res.json({
        success: true,
        ...result,
      })
    } catch (error) {
      logger.error('Get vacations error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch vacations',
      })
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const vacation = await vacationService.getById(Number(id))

      res.json({
        success: true,
        data: vacation,
      })
    } catch (error) {
      logger.error('Get vacation error:', error)
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Vacation not found',
      })
    }
  },

  async create(req: Request, res: Response) {
    try {
      const vacation = await vacationService.create(req.body)

      res.status(201).json({
        success: true,
        message: 'Vacation request created successfully',
        data: vacation,
      })
    } catch (error) {
      logger.error('Create vacation error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create vacation request',
      })
    }
  },

  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params
      const approvedById = req.userId!

      const vacation = await vacationService.approve(Number(id), approvedById)

      res.json({
        success: true,
        message: 'Vacation request approved',
        data: vacation,
      })
    } catch (error) {
      logger.error('Approve vacation error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to approve vacation',
      })
    }
  },

  async reject(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { rejectionReason } = req.body
      const approvedById = req.userId!

      const vacation = await vacationService.reject(Number(id), approvedById, rejectionReason)

      res.json({
        success: true,
        message: 'Vacation request rejected',
        data: vacation,
      })
    } catch (error) {
      logger.error('Reject vacation error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reject vacation',
      })
    }
  },

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params
      const vacation = await vacationService.cancel(Number(id))

      res.json({
        success: true,
        message: 'Vacation request cancelled',
        data: vacation,
      })
    } catch (error) {
      logger.error('Cancel vacation error:', error)
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel vacation',
      })
    }
  },
}

