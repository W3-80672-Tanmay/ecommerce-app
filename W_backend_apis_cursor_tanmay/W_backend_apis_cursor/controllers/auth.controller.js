import { validationResult } from 'express-validator';
import { generateOtpCode, calculateOtpExpiry } from '../utils/otp.js';
import { createOtp, verifyOtp as verifyOtpModel } from '../models/otp.model.js';
import { findOrCreateUserByPhone, getUserById } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';
import { config } from '../config/index.js';

export async function sendOtp(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { phone } = req.body;
    const user = await findOrCreateUserByPhone(phone);
    const code = generateOtpCode();
    const expiresAt = calculateOtpExpiry(config.otp.expiryMinutes);
    await createOtp(phone, code, expiresAt);

    // Integrate with SMS provider here. For dev, optionally return OTP.
    const response = { message: 'OTP sent' };
    if (config.otp.allowDevOtpResponse) response.dev_otp = code;

    res.json(response);
  } catch (e) {
    next(e);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { phone, otp } = req.body;
    const result = await verifyOtpModel(phone, otp);
    if (!result.valid) {
      return res.status(400).json({ message: `OTP ${result.reason}` });
    }
    const user = await findOrCreateUserByPhone(phone);
    const token = signToken({ sub: user.id, role: 'user' });
    res.json({ token, user });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await getUserById(req.user.sub);
    res.json(user);
  } catch (e) {
    next(e);
  }
}
