import { Router } from 'express';
import { EnderecoController } from '../controllers/EnderecoController';
import { enderecoValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/enderecos
router.get('/', asyncHandler(EnderecoController.getAll));

// GET /api/enderecos/:id
router.get('/:id', asyncHandler(EnderecoController.getById));

// POST /api/enderecos
router.post('/', enderecoValidation, asyncHandler(EnderecoController.create));

// PUT /api/enderecos/:id
router.put('/:id', enderecoValidation, asyncHandler(EnderecoController.update));

// DELETE /api/enderecos/:id
router.delete('/:id', asyncHandler(EnderecoController.delete));

// GET /api/enderecos/usuario/:usuarioId
router.get('/usuario/:usuarioId', asyncHandler(EnderecoController.getByUsuario));

// PUT /api/enderecos/:id/favorito
router.put('/:id/favorito', asyncHandler(EnderecoController.setFavorito));

export default router;