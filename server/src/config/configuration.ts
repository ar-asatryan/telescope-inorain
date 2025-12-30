export default () => ({
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '9999', 10),
  apiPrefix: process.env.API_PREFIX || '/api',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'telescope',
    password: process.env.DB_PASSWORD || 'telescope123',
    database: process.env.DB_DATABASE || 'telescope_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Rate Limiting
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001,http://localhost:3002',
});

