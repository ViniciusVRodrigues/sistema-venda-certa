import { Router } from 'express';
import ClienteController from '../controllers/ClienteController';

const router = Router();

// Rotas para clientes
router.get('/clientes', ClienteController.index);
router.get('/clientes/:id', ClienteController.show);
router.post('/clientes', ClienteController.store);
router.put('/clientes/:id', ClienteController.update);
router.delete('/clientes/:id', ClienteController.destroy);

export default router;