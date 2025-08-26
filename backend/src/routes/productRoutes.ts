import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes (for browsing products)
router.get('/', ProductController.list);
router.get('/categorias', ProductController.getCategories);
router.get('/marcas', ProductController.getBrands);
router.get('/:id', ProductController.getById);

// Protected routes (admin only)
router.post('/', authenticateToken, ProductController.create);
router.put('/:id', authenticateToken, ProductController.update);
router.delete('/:id', authenticateToken, ProductController.delete);

export default router;