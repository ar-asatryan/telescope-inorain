import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { UserRole } from '../entities/User'
import { AppDataSource } from '../config/database'
import { Skill, SkillCategory } from '../entities/Skill'
import { EmployeeSkill } from '../entities/EmployeeSkill'

const router = Router()

const skillRepository = AppDataSource.getRepository(Skill)
const employeeSkillRepository = AppDataSource.getRepository(EmployeeSkill)

// Validation rules
const createSkillValidation = [
  body('name').notEmpty().withMessage('Skill name is required'),
  body('category')
    .isIn(['frontend', 'backend', 'devops', 'design', 'management', 'other'])
    .withMessage('Invalid category'),
]

// Get all skills
router.get('/', authenticate, async (req, res) => {
  try {
    const skills = await skillRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    })

    res.json({
      success: true,
      data: skills,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
    })
  }
})

// Get skills by category
router.get('/by-category', authenticate, async (req, res) => {
  try {
    const skills = await skillRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    })

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, Skill[]>)

    res.json({
      success: true,
      data: grouped,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
    })
  }
})

// Get skill matrix (skills with employee counts)
router.get('/matrix', authenticate, async (req, res) => {
  try {
    const skillCounts = await employeeSkillRepository
      .createQueryBuilder('es')
      .leftJoinAndSelect('es.skill', 'skill')
      .select('skill.id', 'skillId')
      .addSelect('skill.name', 'name')
      .addSelect('skill.category', 'category')
      .addSelect('COUNT(es.employeeId)', 'count')
      .addSelect('AVG(es.level)', 'avgLevel')
      .groupBy('skill.id')
      .addGroupBy('skill.name')
      .addGroupBy('skill.category')
      .getRawMany()

    res.json({
      success: true,
      data: skillCounts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill matrix',
    })
  }
})

// Get single skill
router.get('/:id', authenticate, async (req, res) => {
  try {
    const skill = await skillRepository.findOne({
      where: { id: Number(req.params.id) },
    })

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      })
    }

    res.json({
      success: true,
      data: skill,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill',
    })
  }
})

// Create skill
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createSkillValidation),
  async (req, res) => {
    try {
      const { name, category, description } = req.body

      const existingSkill = await skillRepository.findOne({
        where: { name },
      })

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'Skill with this name already exists',
        })
      }

      const skill = skillRepository.create({ name, category, description })
      await skillRepository.save(skill)

      res.status(201).json({
        success: true,
        message: 'Skill created successfully',
        data: skill,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create skill',
      })
    }
  }
)

// Update skill
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    try {
      const skill = await skillRepository.findOne({
        where: { id: Number(req.params.id) },
      })

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found',
        })
      }

      Object.assign(skill, req.body)
      await skillRepository.save(skill)

      res.json({
        success: true,
        message: 'Skill updated successfully',
        data: skill,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update skill',
      })
    }
  }
)

// Delete skill
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    try {
      const skill = await skillRepository.findOne({
        where: { id: Number(req.params.id) },
      })

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found',
        })
      }

      await skillRepository.remove(skill)

      res.json({
        success: true,
        message: 'Skill deleted successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete skill',
      })
    }
  }
)

export default router



