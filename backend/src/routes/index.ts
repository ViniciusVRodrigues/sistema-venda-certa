import { Router } from 'express';
import clienteRoutes from './clienteRoutes';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes';

const router = Router();

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Aplicar rotas
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/produtos', productRoutes);
router.use('/categorias', categoryRoutes);
router.use('/pedidos', orderRoutes);

// Rota 404 para rotas não encontradas
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.originalUrl} não encontrada`
  });
});

export default router;