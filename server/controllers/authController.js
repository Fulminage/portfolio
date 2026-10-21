import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import Admin, { BCRYPT_ROUNDS } from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isEmail, isString } from '../utils/validators.js';

// Used when the email doesn't exist, so the response time is the same either way
// (prevents attackers from discovering which emails are registered).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!isEmail(email) || !isString(password) || password.length === 0 || password.length > 200) {
    return res.status(400).json({ success: false, message: 'A valid email and password are required.' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  const passwordMatches = await bcrypt.compare(password, admin ? admin.password : DUMMY_HASH);

  if (!admin || !passwordMatches) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: admin._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

  res.json({ success: true, token, admin: { id: admin._id, email: admin.email } });
});

// GET /api/auth/me  (protected) - lets the frontend check a stored token is still valid
export const me = (req, res) => {
  res.json({ success: true, admin: { id: req.admin._id, email: req.admin.email } });
};
