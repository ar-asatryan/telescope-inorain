import { Router } from 'express'
import { body } from 'express-validator'
import { userController } from '../controllers/user.controller'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { UserRole } from '../entities/User'

const router = Router()

// Validation rules
const createUserValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'employee'])
    .withMessage('Invalid role'),
]

const updateUserValidation = [
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'employee'])
    .withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
]

// All routes require authentication and admin role
router.use(authenticate, authorize(UserRole.ADMIN))

// Routes
router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)
router.post('/', validate(createUserValidation), userController.createUser)
router.put('/:id', validate(updateUserValidation), userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.patch('/:id/toggle-status', userController.toggleUserStatus)

export default router


