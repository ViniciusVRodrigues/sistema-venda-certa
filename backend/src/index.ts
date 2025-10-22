import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { DatabaseConnection } from './config/database';
import { Logger } from '@venda-certa/logger';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { specs, swaggerUi } from './config/swagger';

// Load environment variables
dotenv.config();

// Configure logger
Logger.getInstance({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  filename: 'logs/app.log',
  consoleOutput: true
});

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database connection
const dbConnection = DatabaseConnection.getInstance();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Logging middleware - usando nosso Logger customizado
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    Logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Sistema Venda Certa API Docs'
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema Venda Certa',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    Logger.info('🚀 Iniciando servidor...');
    
    // Test database connection usando o Singleton
    await dbConnection.connect();
    
    // Sync database models (only in development)
    if (process.env.NODE_ENV === 'development') {
      const sequelize = dbConnection.getSequelize();
      await sequelize.sync({ alter: false });
      Logger.info('📊 Modelos do banco sincronizados.');
    }

    // Start server
    app.listen(PORT, () => {
      Logger.info(`🚀 Servidor rodando na porta ${PORT}`);
      Logger.info(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
      Logger.info(`🔍 Health Check: http://localhost:${PORT}/api/health`);
      Logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error: any) {
    Logger.error(`❌ Erro ao conectar com o banco de dados: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  Logger.error(`❌ Unhandled Promise Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  Logger.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  Logger.info('🛑 SIGTERM recebido. Encerrando servidor graciosamente...');
  await dbConnection.disconnect();
  process.exit(0);
});

startServer();

export default app;
