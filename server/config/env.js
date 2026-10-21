// Reads and validates environment variables in ONE place.
// If something important is missing, we crash early with a clear message.
import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy .env.example to .env (locally) or set them in Render.');
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long.');
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';

const clientOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (isProduction && clientOrigins.length === 0) {
  console.error('CLIENT_URL must be set in production (your frontend domain).');
  process.exit(1);
}

export const env = {
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  // In development we also allow the default Vite dev server.
  clientOrigins: isProduction ? clientOrigins : [...clientOrigins, 'http://localhost:5173'],
};
