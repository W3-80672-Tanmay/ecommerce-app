import { Router } from 'express';
import { authenticateAdmin } from '../middlewares/auth.js';
import { adminCreateProduct, adminDeleteProduct, adminListProducts, adminSetProductActive, adminUpdateProduct } from '../controllers/product.controller.js';
import { adminCreateCategory, adminDeleteCategory, adminListCategories, adminUpdateCategory } from '../controllers/category.controller.js';
import { adminLogin, adminOrders, adminUpdateOrderStatus, getSettings, seedInitialAdmin, updateSetting } from '../controllers/admin.controller.js';

const router = Router();

router.post('/seed-initial-admin', seedInitialAdmin);
router.post('/login', adminLogin);

router.use(authenticateAdmin);

// products
router.get('/products', adminListProducts);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);
router.patch('/products/:id/activate', adminSetProductActive);

// categories
router.get('/categories', adminListCategories);
router.post('/categories', adminCreateCategory);
router.put('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// orders
router.get('/orders', adminOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

// site settings
router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);

export default router;
