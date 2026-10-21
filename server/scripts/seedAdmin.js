// Creates (or updates the password of) the single admin account.
// Run once:  npm run seed:admin
// Uses ADMIN_EMAIL and ADMIN_PASSWORD from your environment - nothing is hardcoded.
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';
import { isEmail } from '../utils/validators.js';

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!isEmail(ADMIN_EMAIL) || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  console.error('Set ADMIN_EMAIL (valid email) and ADMIN_PASSWORD (12+ characters) first.');
  process.exit(1);
}

await mongoose.connect(env.mongoUri);

let admin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
if (admin) {
  admin.password = ADMIN_PASSWORD; // hashed by the model's pre-save hook
  await admin.save();
  console.log(`Updated password for admin ${admin.email}`);
} else {
  admin = await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  console.log(`Created admin ${admin.email}`);
}

await mongoose.disconnect();
