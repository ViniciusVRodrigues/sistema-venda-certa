import { Router } from 'express';
import ClienteController from '../controllers/ClienteController';

const router = Router();

// Rotas para clientes (relative to /clientes)
router.get('/', ClienteController.index);
router.get('/:id', ClienteController.show);
router.post('/', ClienteController.store);
router.put('/:id', ClienteController.update);
router.delete('/:id', ClienteController.destroy);

export default router;