import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.js';
import { addItemToCart, clearMyCart, getMyCart, removeItemFromCart, updateCartItemQuantity } from '../controllers/cart.controller.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getMyCart);
router.post('/items', addItemToCart);
router.patch('/items/:productId', updateCartItemQuantity);
router.delete('/items/:productId', removeItemFromCart);
router.delete('/clear', clearMyCart);

export default router;
