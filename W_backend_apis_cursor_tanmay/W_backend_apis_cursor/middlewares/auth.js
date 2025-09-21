import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function authenticateUser(req, res, next) {
  const bearer = req.headers.authorization || '';
  const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    if (!payload || (payload.role !== 'user' && payload.role !== 'admin')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function authenticateAdmin(req, res, next) {
  const bearer = req.headers.authorization || '';
  const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
