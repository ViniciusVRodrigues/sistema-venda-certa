import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { usuarioValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/usuarios
router.get('/', asyncHandler(UsuarioController.getAll));

// GET /api/usuarios/:id
router.get('/:id', asyncHandler(UsuarioController.getById));

// POST /api/usuarios
router.post('/', usuarioValidation, asyncHandler(UsuarioController.create));

// PUT /api/usuarios/:id
router.put('/:id', usuarioValidation, asyncHandler(UsuarioController.update));

// DELETE /api/usuarios/:id
router.delete('/:id', asyncHandler(UsuarioController.delete));

// GET /api/usuarios/:id/enderecos
router.get('/:id/enderecos', asyncHandler(UsuarioController.getEnderecos));

export default router;