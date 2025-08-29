import { Router } from 'express';
import { CategoriaController } from '../controllers/CategoriaController';
import { categoriaValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/categorias
router.get('/', asyncHandler(CategoriaController.getAll));

// GET /api/categorias/ativas
router.get('/ativas', asyncHandler(CategoriaController.getAtivas));

// GET /api/categorias/:id
router.get('/:id', asyncHandler(CategoriaController.getById));

// POST /api/categorias
router.post('/', categoriaValidation, asyncHandler(CategoriaController.create));

// PUT /api/categorias/:id
router.put('/:id', categoriaValidation, asyncHandler(CategoriaController.update));

// DELETE /api/categorias/:id
router.delete('/:id', asyncHandler(CategoriaController.delete));

export default router;