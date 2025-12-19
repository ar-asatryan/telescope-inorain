import 'reflect-metadata'
import { AppDataSource } from './config/database'
import app from './app'
import { config } from './config/env'
import { logger } from './utils/logger'

const PORT = config.port

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connection established successfully')

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`)
      logger.info(`📚 API available at http://localhost:${PORT}${config.apiPrefix}`)
    })
  })
  .catch((error) => {
    logger.error('Error during database initialization:', error)
    process.exit(1)
  })

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})


