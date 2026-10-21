import Profile from '../models/Profile.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clean, isString } from '../utils/validators.js';

const getOrCreateProfile = () =>
  Profile.findOneAndUpdate({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { new: true, upsert: true });

const aboutPayload = (p) => ({
  name: p.name,
  title: p.title,
  bio: p.bio,
  location: p.location,
  focus: p.focus,
  experience: p.experience,
});

// GET /api/about  (public)
export const getAbout = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  res.json({ success: true, data: aboutPayload(profile) });
});

// PUT /api/about  (admin) - send any of: name, title, bio, location, focus, experience
export const updateAbout = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const update = {};
  const errors = [];

  const textLimits = { name: 100, title: 100, bio: 3000, location: 200, focus: 200 };
  for (const [field, max] of Object.entries(textLimits)) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      if (!isString(body[field]) || body[field].trim().length > max) {
        errors.push(`${field} must be text of ${max} characters or fewer.`);
      } else {
        update[field] = body[field].trim();
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'experience')) {
    const exp = body.experience;
    if (!Array.isArray(exp) || exp.length > 30) {
      errors.push('experience must be an array of up to 30 items.');
    } else {
      const items = exp.map((e) => ({
        role: clean(e?.role),
        organization: clean(e?.organization),
        period: clean(e?.period),
        description: clean(e?.description),
      }));
      if (items.some((i) => !i.role)) errors.push('Each experience item needs a role.');
      else update.experience = items;
    }
  }

  if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ success: false, message: 'No valid fields to update.' });
  }

  const profile = await Profile.findOneAndUpdate(
    { key: 'main' },
    { $set: update, $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ success: true, data: aboutPayload(profile) });
});

// GET /api/skills  (public)
export const getSkills = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  res.json({ success: true, data: profile.skills });
});

// PUT /api/skills  (admin) - body: { "skills": [ "HTML", { "name": "React", "category": "Frontend" } ] }
export const updateSkills = asyncHandler(async (req, res) => {
  const list = req.body?.skills;
  if (!Array.isArray(list) || list.length > 100) {
    return res.status(400).json({ success: false, message: 'skills must be an array of up to 100 items.' });
  }

  const skills = list.map((s) => (isString(s) ? { name: clean(s) } : { name: clean(s?.name), category: clean(s?.category) }));
  if (skills.some((s) => !s.name || s.name.length > 60 || (s.category && s.category.length > 60))) {
    return res.status(400).json({ success: false, message: 'Each skill needs a name (60 characters max).' });
  }

  const profile = await Profile.findOneAndUpdate(
    { key: 'main' },
    { $set: { skills }, $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ success: true, data: profile.skills });
});
