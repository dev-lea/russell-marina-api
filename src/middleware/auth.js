import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing Bearer token' });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // { id/email/username/... }
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

