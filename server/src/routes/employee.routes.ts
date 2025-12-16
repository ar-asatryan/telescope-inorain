import { Router } from 'express'
import { body } from 'express-validator'
import { employeeController } from '../controllers/employee.controller'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { UserRole } from '../entities/User'

const router = Router()

// Validation rules
const createEmployeeValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('position').notEmpty().withMessage('Position is required'),
  body('hireDate').isISO8601().withMessage('Please provide a valid hire date'),
]

const updateEmployeeValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
]

const addSkillValidation = [
  body('skillId').isInt().withMessage('Skill ID is required'),
  body('level').isInt({ min: 1, max: 5 }).withMessage('Level must be between 1 and 5'),
  body('yearsOfExperience')
    .isFloat({ min: 0 })
    .withMessage('Years of experience must be a positive number'),
]

// Routes
router.get('/', authenticate, employeeController.getAll)
router.get('/:id', authenticate, employeeController.getById)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createEmployeeValidation),
  employeeController.create
)
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(updateEmployeeValidation),
  employeeController.update
)
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  employeeController.delete
)

// Skills
router.get('/:id/skills', authenticate, employeeController.getSkills)
router.post(
  '/:id/skills',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(addSkillValidation),
  employeeController.addSkill
)

// Vacations
router.get('/:id/vacations', authenticate, employeeController.getVacations)

export default router

