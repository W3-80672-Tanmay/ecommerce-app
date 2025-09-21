import bcrypt from 'bcryptjs';
import { hasAnyAdmin, createAdmin, getAdminByEmail } from '../models/admin.model.js';
import { signToken } from '../utils/jwt.js';
import { adminListOrders, updateOrderStatus } from '../models/order.model.js';
import { getAllSettings, upsertSetting } from '../models/siteSetting.model.js';

export async function seedInitialAdmin(req, res, next) {
  try {
    const exists = await hasAnyAdmin();
    if (exists) return res.status(400).json({ message: 'Admins already exist' });
    const password_hash = await bcrypt.hash('Admin@123', 10);
    const id = await createAdmin({ name: 'Super Admin', email: 'admin@example.com', password_hash });
    res.status(201).json({ id, email: 'admin@example.com', password: 'Admin@123' });
  } catch (e) {
    next(e);
  }
}

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await getAdminByEmail(email);
    if (!admin || !admin.is_active) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ sub: admin.id, role: 'admin' });
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (e) {
    next(e);
  }
}

export async function adminOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const data = await adminListOrders({ status, page: Number(page), limit: Number(limit) });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function adminUpdateOrderStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const ok = await updateOrderStatus(id, status);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ updated: true });
  } catch (e) {
    next(e);
  }
}

export async function getSettings(req, res, next) {
  try {
    const settings = await getAllSettings();
    res.json(settings);
  } catch (e) {
    next(e);
  }
}

export async function updateSetting(req, res, next) {
  try {
    const key = String(req.params.key);
    const { value } = req.body;
    await upsertSetting(key, value ?? null);
    res.json({ updated: true });
  } catch (e) {
    next(e);
  }
}
