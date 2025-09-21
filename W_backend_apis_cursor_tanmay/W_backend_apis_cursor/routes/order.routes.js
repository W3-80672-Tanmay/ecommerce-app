import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.js';
import { myOrderDetail, myOrders, placeOrder } from '../controllers/order.controller.js';

const router = Router();

router.use(authenticateUser);

router.post('/', placeOrder);
router.get('/', myOrders);
router.get('/:id', myOrderDetail);

export default router;
