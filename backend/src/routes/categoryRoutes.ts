import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes (for browsing categories)
router.get('/', CategoryController.list);
router.get('/tree', CategoryController.getTree);
router.get('/slug/:slug', CategoryController.getBySlug);
router.get('/:id', CategoryController.getById);

// Protected routes (admin only)
router.post('/', authenticateToken, CategoryController.create);
router.put('/:id', authenticateToken, CategoryController.update);
router.delete('/:id', authenticateToken, CategoryController.delete);

export default router;