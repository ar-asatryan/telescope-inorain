import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/env'
import { logger } from './utils/logger'

// Import routes
import authRoutes from './routes/auth.routes'
import employeeRoutes from './routes/employee.routes'
import vacationRoutes from './routes/vacation.routes'
import skillRoutes from './routes/skill.routes'
import departmentRoutes from './routes/department.routes'
import teamRoutes from './routes/team.routes'
import projectRoutes from './routes/project.routes'

const app: Application = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
const apiPrefix = config.apiPrefix

app.use(`${apiPrefix}/auth`, authRoutes)
app.use(`${apiPrefix}/employees`, employeeRoutes)
app.use(`${apiPrefix}/vacations`, vacationRoutes)
app.use(`${apiPrefix}/skills`, skillRoutes)
app.use(`${apiPrefix}/departments`, departmentRoutes)
app.use(`${apiPrefix}/teams`, teamRoutes)
app.use(`${apiPrefix}/projects`, projectRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  })
})

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message)
  logger.error('Stack:', err.stack)

  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  })
})

export default app

