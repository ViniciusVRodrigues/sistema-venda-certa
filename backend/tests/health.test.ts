import request from 'supertest';
import app from '../src/server';

describe('API Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('API funcionando corretamente');
  });
});