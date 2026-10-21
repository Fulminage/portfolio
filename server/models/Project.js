import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    technologies: { type: [String], default: [] },
    imageUrl: { type: String, trim: true, default: '' },
    liveUrl: { type: String, trim: true, default: '' },
    githubUrl: { type: String, trim: true, default: '' },
    // Only published projects are visible to the public.
    published: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model('Project', projectSchema);
