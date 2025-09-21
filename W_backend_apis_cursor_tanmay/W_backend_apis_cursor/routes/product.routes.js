import { Router } from 'express';
import { getAllProducts, getFeaturedProducts, getProductDetail } from '../controllers/product.controller.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductDetail);

export default router;
