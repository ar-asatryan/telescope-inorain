import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { UserRole } from '../entities/User'
import { AppDataSource } from '../config/database'
import { Department } from '../entities/Department'

const router = Router()

const departmentRepository = AppDataSource.getRepository(Department)

// Validation rules
const createDepartmentValidation = [
  body('name').notEmpty().withMessage('Department name is required'),
]

// Get all departments
router.get('/', authenticate, async (req, res) => {
  try {
    const departments = await departmentRepository.find({
      relations: ['head', 'teams'],
      order: { name: 'ASC' },
    })

    res.json({
      success: true,
      data: departments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
    })
  }
})

// Get department with employees
router.get('/:id', authenticate, async (req, res) => {
  try {
    const department = await departmentRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['head', 'teams', 'teams.lead', 'employees'],
    })

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      })
    }

    res.json({
      success: true,
      data: department,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department',
    })
  }
})

// Create department
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createDepartmentValidation),
  async (req, res) => {
    try {
      const { name, description, headId } = req.body

      const existingDept = await departmentRepository.findOne({
        where: { name },
      })

      if (existingDept) {
        return res.status(400).json({
          success: false,
          message: 'Department with this name already exists',
        })
      }

      const department = departmentRepository.create({ name, description, headId })
      await departmentRepository.save(department)

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: department,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create department',
      })
    }
  }
)

// Update department
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    try {
      const department = await departmentRepository.findOne({
        where: { id: Number(req.params.id) },
      })

      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found',
        })
      }

      Object.assign(department, req.body)
      await departmentRepository.save(department)

      res.json({
        success: true,
        message: 'Department updated successfully',
        data: department,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update department',
      })
    }
  }
)

// Delete department
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    try {
      const department = await departmentRepository.findOne({
        where: { id: Number(req.params.id) },
        relations: ['teams', 'employees'],
      })

      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found',
        })
      }

      if (department.teams?.length || department.employees?.length) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete department with teams or employees',
        })
      }

      await departmentRepository.remove(department)

      res.json({
        success: true,
        message: 'Department deleted successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete department',
      })
    }
  }
)

export default router

