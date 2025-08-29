import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { produtoValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/produtos
router.get('/', asyncHandler(ProdutoController.getAll));

// GET /api/produtos/:id
router.get('/:id', asyncHandler(ProdutoController.getById));

// POST /api/produtos
router.post('/', produtoValidation, asyncHandler(ProdutoController.create));

// PUT /api/produtos/:id
router.put('/:id', produtoValidation, asyncHandler(ProdutoController.update));

// DELETE /api/produtos/:id
router.delete('/:id', asyncHandler(ProdutoController.delete));

// GET /api/produtos/categoria/:categoriaId
router.get('/categoria/:categoriaId', asyncHandler(ProdutoController.getByCategoria));

// GET /api/produtos/:id/avaliacoes
router.get('/:id/avaliacoes', asyncHandler(ProdutoController.getAvaliacoes));

export default router;