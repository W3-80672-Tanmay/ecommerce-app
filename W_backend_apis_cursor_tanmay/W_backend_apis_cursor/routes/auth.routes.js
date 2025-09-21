import { Router } from 'express';
import { body } from 'express-validator';
import { sendOtp, verifyOtp, me } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = Router();

router.post('/send-otp', body('phone').isString().notEmpty(), sendOtp);
router.post('/verify-otp', body('phone').isString().notEmpty(), body('otp').isLength({ min: 6, max: 6 }), verifyOtp);
router.get('/me', authenticateUser, me);

export default router;
