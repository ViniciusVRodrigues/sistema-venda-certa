import request from 'supertest';
import express from 'express';
import Joi from 'joi';

// Simple test app without database connection
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'API funcionando corretamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'test'
    });
  });

  // Test validation endpoint
  app.post('/api/test/validation', (req, res) => {
    const schema = Joi.object({
      nome: Joi.string().min(2).required(),
      email: Joi.string().email().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.details.map(detail => detail.message)
      });
    }

    res.status(200).json({
      success: true,
      message: 'Validação passou',
      data: value
    });
  });
  
  return app;
};

describe('API Basic Tests', () => {
  const app = createTestApp();

  describe('Health Check', () => {
    test('GET /api/health should return API status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API funcionando corretamente');
      expect(response.body.environment).toBe('test');
    });
  });

  describe('Validation', () => {
    test('Should validate request data correctly', async () => {
      const validData = {
        nome: 'João Silva',
        email: 'joao@example.com'
      };

      const response = await request(app)
        .post('/api/test/validation')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(validData.nome);
    });

    test('Should return validation errors for invalid data', async () => {
      const invalidData = {
        nome: 'J', // Too short
        email: 'invalid-email' // Invalid format
      };

      const response = await request(app)
        .post('/api/test/validation')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('Should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);
    });
  });
});