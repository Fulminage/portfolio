import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Use on any route that only the admin may access.
// Expects the header:  Authorization: Bearer <token>
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  const admin = await Admin.findById(payload.id);
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  req.admin = admin;
  next();
});
