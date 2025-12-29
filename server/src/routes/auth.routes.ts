import { Router } from 'express'
import { body } from 'express-validator'
import { authController } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'

const router = Router()

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
]

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

// Routes
router.post('/register', validate(registerValidation), authController.register)
router.post('/login', validate(loginValidation), authController.login)
router.post('/logout', authenticate, authController.logout)
router.get('/me', authenticate, authController.me)

export default router



