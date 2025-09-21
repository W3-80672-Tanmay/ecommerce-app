import { Router } from 'express';
import { getAllCategories, getCategoryProducts } from '../controllers/category.controller.js';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id/products', getCategoryProducts);

export default router;
