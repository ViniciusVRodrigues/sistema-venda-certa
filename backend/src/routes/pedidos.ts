import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';
import { pedidoValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/pedidos
router.get('/', asyncHandler(PedidoController.getAll));

// GET /api/pedidos/:id
router.get('/:id', asyncHandler(PedidoController.getById));

// POST /api/pedidos
router.post('/', pedidoValidation, asyncHandler(PedidoController.create));

// PUT /api/pedidos/:id
router.put('/:id', pedidoValidation, asyncHandler(PedidoController.update));

// DELETE /api/pedidos/:id
router.delete('/:id', asyncHandler(PedidoController.delete));

// PUT /api/pedidos/:id/status
router.put('/:id/status', asyncHandler(PedidoController.updateStatus));

// GET /api/pedidos/usuario/:usuarioId
router.get('/usuario/:usuarioId', asyncHandler(PedidoController.getByUsuario));

export default router;