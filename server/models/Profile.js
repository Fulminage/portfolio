import mongoose from 'mongoose';

// The portfolio has exactly ONE profile document (the "singleton" pattern).
// It holds the About text, the skills and the experience.
const profileSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    name: { type: String, trim: true, maxlength: 100, default: '' },
    title: { type: String, trim: true, maxlength: 100, default: '' },
    bio: { type: String, trim: true, maxlength: 3000, default: '' },
    location: { type: String, trim: true, maxlength: 200, default: '' },
    focus: { type: String, trim: true, maxlength: 200, default: '' },
    skills: [
      {
        _id: false,
        name: { type: String, required: true, trim: true, maxlength: 60 },
        category: { type: String, trim: true, maxlength: 60, default: '' },
      },
    ],
    experience: [
      {
        _id: false,
        role: { type: String, required: true, trim: true, maxlength: 100 },
        organization: { type: String, trim: true, maxlength: 100, default: '' },
        period: { type: String, trim: true, maxlength: 60, default: '' },
        description: { type: String, trim: true, maxlength: 1000, default: '' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
