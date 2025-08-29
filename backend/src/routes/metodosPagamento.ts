import { Router } from 'express';
import { MetodoPagamentoController } from '../controllers/MetodoPagamentoController';
import { metodoPagamentoValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/metodos-pagamento
router.get('/', asyncHandler(MetodoPagamentoController.getAll));

// GET /api/metodos-pagamento/ativos
router.get('/ativos', asyncHandler(MetodoPagamentoController.getAtivos));

// GET /api/metodos-pagamento/:id
router.get('/:id', asyncHandler(MetodoPagamentoController.getById));

// POST /api/metodos-pagamento
router.post('/', metodoPagamentoValidation, asyncHandler(MetodoPagamentoController.create));

// PUT /api/metodos-pagamento/:id
router.put('/:id', metodoPagamentoValidation, asyncHandler(MetodoPagamentoController.update));

// DELETE /api/metodos-pagamento/:id
router.delete('/:id', asyncHandler(MetodoPagamentoController.delete));

export default router;