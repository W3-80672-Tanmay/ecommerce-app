import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.js';
import { addAddress, editAddress, listMyAddresses, removeAddress } from '../controllers/address.controller.js';

const router = Router();

router.use(authenticateUser);

router.get('/', listMyAddresses);
router.post('/', addAddress);
router.put('/:id', editAddress);
router.delete('/:id', removeAddress);

export default router;
