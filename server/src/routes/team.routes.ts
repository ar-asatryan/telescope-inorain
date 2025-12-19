import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { UserRole } from '../entities/User'
import { AppDataSource } from '../config/database'
import { Team } from '../entities/Team'

const router = Router()

const teamRepository = AppDataSource.getRepository(Team)

// Validation rules
const createTeamValidation = [
  body('name').notEmpty().withMessage('Team name is required'),
  body('departmentId').isInt().withMessage('Department ID is required'),
]

// Get all teams
router.get('/', authenticate, async (req, res) => {
  try {
    const { departmentId } = req.query

    const whereClause: any = {}
    if (departmentId) {
      whereClause.departmentId = Number(departmentId)
    }

    const teams = await teamRepository.find({
      where: whereClause,
      relations: ['department', 'lead', 'members'],
      order: { name: 'ASC' },
    })

    res.json({
      success: true,
      data: teams,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
    })
  }
})

// Get team with members
router.get('/:id', authenticate, async (req, res) => {
  try {
    const team = await teamRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['department', 'lead', 'members'],
    })

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      })
    }

    res.json({
      success: true,
      data: team,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team',
    })
  }
})

// Get team members
router.get('/:id/members', authenticate, async (req, res) => {
  try {
    const team = await teamRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['members', 'members.skills', 'members.skills.skill'],
    })

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      })
    }

    res.json({
      success: true,
      data: team.members,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
    })
  }
})

// Create team
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createTeamValidation),
  async (req, res) => {
    try {
      const { name, description, departmentId, leadId } = req.body

      const team = teamRepository.create({ name, description, departmentId, leadId })
      await teamRepository.save(team)

      res.status(201).json({
        success: true,
        message: 'Team created successfully',
        data: team,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create team',
      })
    }
  }
)

// Update team
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  async (req, res) => {
    try {
      const team = await teamRepository.findOne({
        where: { id: Number(req.params.id) },
      })

      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found',
        })
      }

      Object.assign(team, req.body)
      await teamRepository.save(team)

      res.json({
        success: true,
        message: 'Team updated successfully',
        data: team,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update team',
      })
    }
  }
)

// Delete team
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    try {
      const team = await teamRepository.findOne({
        where: { id: Number(req.params.id) },
        relations: ['members'],
      })

      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found',
        })
      }

      if (team.members?.length) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete team with members',
        })
      }

      await teamRepository.remove(team)

      res.json({
        success: true,
        message: 'Team deleted successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete team',
      })
    }
  }
)

export default router


