import { Router } from 'express'
import { body } from 'express-validator'
import { vacationController } from '../controllers/vacation.controller'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { UserRole } from '../entities/User'

const router = Router()

// Validation rules
const createVacationValidation = [
  body('employeeId').isInt().withMessage('Employee ID is required'),
  body('type')
    .isIn(['vacation', 'sick_leave', 'day_off', 'remote'])
    .withMessage('Invalid vacation type'),
  body('startDate').isISO8601().withMessage('Please provide a valid start date'),
  body('endDate').isISO8601().withMessage('Please provide a valid end date'),
]

// Routes
router.get('/', authenticate, vacationController.getAll)
router.get('/:id', authenticate, vacationController.getById)
router.post('/', authenticate, validate(createVacationValidation), vacationController.create)
router.put(
  '/:id/approve',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  vacationController.approve
)
router.put(
  '/:id/reject',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  vacationController.reject
)
router.put('/:id/cancel', authenticate, vacationController.cancel)

export default router


