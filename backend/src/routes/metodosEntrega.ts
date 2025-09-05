import { Router } from 'express';
import { MetodoEntregaController } from '../controllers/MetodoEntregaController';
import { metodoEntregaValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/metodos-entrega
router.get('/', asyncHandler(MetodoEntregaController.getAll));

// GET /api/metodos-entrega/ativos
router.get('/ativos', asyncHandler(MetodoEntregaController.getAtivos));

// GET /api/metodos-entrega/:id
router.get('/:id', asyncHandler(MetodoEntregaController.getById));

// POST /api/metodos-entrega
router.post('/', metodoEntregaValidation, asyncHandler(MetodoEntregaController.create));

// PUT /api/metodos-entrega/:id
router.put('/:id', metodoEntregaValidation, asyncHandler(MetodoEntregaController.update));

// DELETE /api/metodos-entrega/:id
router.delete('/:id', asyncHandler(MetodoEntregaController.delete));

export default router;