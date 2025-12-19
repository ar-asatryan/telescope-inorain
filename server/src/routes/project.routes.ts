import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { UserRole } from '../entities/User'
import { AppDataSource } from '../config/database'
import { Project, ProjectStatus } from '../entities/Project'
import { ProjectAssignment } from '../entities/ProjectAssignment'

const router = Router()

const projectRepository = AppDataSource.getRepository(Project)
const assignmentRepository = AppDataSource.getRepository(ProjectAssignment)

// Validation rules
const createProjectValidation = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('startDate').isISO8601().withMessage('Please provide a valid start date'),
]

const addAssignmentValidation = [
  body('employeeId').isInt().withMessage('Employee ID is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('startDate').isISO8601().withMessage('Please provide a valid start date'),
]

// Get all projects
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const whereClause: any = {}
    if (status) {
      whereClause.status = status
    }

    const [projects, total] = await projectRepository.findAndCount({
      where: whereClause,
      relations: ['assignments', 'assignments.employee'],
      order: { createdAt: 'DESC' },
      skip,
      take: Number(limit),
    })

    res.json({
      success: true,
      data: projects,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    })
  }
})

// Get project by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await projectRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['assignments', 'assignments.employee'],
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    res.json({
      success: true,
      data: project,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    })
  }
})

// Get project team
router.get('/:id/team', authenticate, async (req, res) => {
  try {
    const assignments = await assignmentRepository.find({
      where: { projectId: Number(req.params.id), isActive: true },
      relations: ['employee', 'employee.skills', 'employee.skills.skill'],
    })

    res.json({
      success: true,
      data: assignments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project team',
    })
  }
})

// Create project
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createProjectValidation),
  async (req, res) => {
    try {
      const { name, description, status, priority, startDate, endDate } = req.body

      const project = projectRepository.create({
        name,
        description,
        status: status || ProjectStatus.PLANNING,
        priority,
        startDate,
        endDate,
      })
      await projectRepository.save(project)

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
      })
    }
  }
)

// Update project
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  async (req, res) => {
    try {
      const project = await projectRepository.findOne({
        where: { id: Number(req.params.id) },
      })

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        })
      }

      Object.assign(project, req.body)
      await projectRepository.save(project)

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
      })
    }
  }
)

// Add team member to project
router.post(
  '/:id/assignments',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(addAssignmentValidation),
  async (req, res) => {
    try {
      const projectId = Number(req.params.id)
      const { employeeId, role, startDate, endDate } = req.body

      // Check if assignment already exists
      const existingAssignment = await assignmentRepository.findOne({
        where: { projectId, employeeId, isActive: true },
      })

      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'Employee is already assigned to this project',
        })
      }

      const assignment = assignmentRepository.create({
        projectId,
        employeeId,
        role,
        startDate,
        endDate,
      })
      await assignmentRepository.save(assignment)

      res.status(201).json({
        success: true,
        message: 'Team member added successfully',
        data: assignment,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add team member',
      })
    }
  }
)

// Remove team member from project
router.delete(
  '/:id/assignments/:assignmentId',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  async (req, res) => {
    try {
      const assignment = await assignmentRepository.findOne({
        where: { id: Number(req.params.assignmentId) },
      })

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found',
        })
      }

      assignment.isActive = false
      assignment.endDate = new Date()
      await assignmentRepository.save(assignment)

      res.json({
        success: true,
        message: 'Team member removed successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to remove team member',
      })
    }
  }
)

// Delete project
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    try {
      const project = await projectRepository.findOne({
        where: { id: Number(req.params.id) },
      })

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        })
      }

      await projectRepository.remove(project)

      res.json({
        success: true,
        message: 'Project deleted successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
      })
    }
  }
)

export default router


