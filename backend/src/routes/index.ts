import { Router } from 'express';
import usuariosRoutes from './usuarios';
import produtosRoutes from './produtos';
import pedidosRoutes from './pedidos';
import categoriasRoutes from './categorias';
import enderecosRoutes from './enderecos';
import metodosEntregaRoutes from './metodosEntrega';
import metodosPagamentoRoutes from './metodosPagamento';

const router = Router();

// API routes
router.use('/usuarios', usuariosRoutes);
router.use('/produtos', produtosRoutes);
router.use('/pedidos', pedidosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/enderecos', enderecosRoutes);
router.use('/metodos-entrega', metodosEntregaRoutes);
router.use('/metodos-pagamento', metodosPagamentoRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API Sistema Venda Certa está funcionando',
    timestamp: new Date().toISOString(),
  });
});

export default router;