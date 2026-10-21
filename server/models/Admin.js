import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const BCRYPT_ROUNDS = 12;

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false => the hash is NOT returned by queries unless explicitly requested
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// Hash the password automatically whenever it is set or changed.
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
  next();
});

export default mongoose.model('Admin', adminSchema);
