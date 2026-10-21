// Loads the content that is currently hardcoded in client/src/App.jsx into MongoDB.
// Run once:  npm run seed:content     (skips anything that already exists)
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';

await mongoose.connect(env.mongoUri);

const existingProfile = await Profile.findOne({ key: 'main' });
if (!existingProfile) {
  await Profile.create({
    key: 'main',
    name: 'Renz Quelli',
    title: 'Frontend Developer • Student',
    bio: 'Hello, I’m Renz Quelli. I enjoy creating websites that look clean, feel modern, and work well on different screen sizes. I am currently improving my frontend development skills and learning more about designing interfaces that are both simple and effective.',
    location: 'Ambulong, Manoc-Manoc, Malay, Aklan',
    focus: 'Frontend Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design', 'UI Design'].map((name) => ({ name })),
    experience: [],
  });
  console.log('Profile created.');
} else {
  console.log('Profile already exists - skipped.');
}

if ((await Project.countDocuments()) === 0) {
  // imageUrl is left empty: your images currently live in client/src/assets.
  // Host them (e.g. Cloudinary or the client's /public folder) and set imageUrl later.
  await Project.insertMany([
    {
      title: 'Bakery Product Card',
      description: 'A modern product card UI featuring a bakery item with price, product details, and an add-to-cart button. This project focuses on layout, styling, and creating a clean shopping card design.',
    },
    {
      title: 'Awesome Todos App',
      description: 'A functional todo application that allows users to add, manage, and remove tasks in a simple and organized interface. It was designed to be clean, modern, and easy to use.',
    },
    {
      title: 'GTours Branding',
      description: 'A branding and logo design project for a tours and travel concept. It highlights simplicity, strong identity, and a professional visual style suitable for a tourism-related business.',
    },
  ]);
  console.log('Projects created.');
} else {
  console.log('Projects already exist - skipped.');
}

await mongoose.disconnect();
