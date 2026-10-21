import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clean, isHttpUrl, isString } from '../utils/validators.js';

const URL_FIELDS = ['imageUrl', 'liveUrl', 'githubUrl'];

// Validates the request body and returns only the fields we allow.
// `partial` = true for updates (only validate fields that were sent).
function parseProjectBody(body = {}, { partial }) {
  const errors = [];
  const data = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);

  if (!partial || has('title')) {
    const title = clean(body.title);
    if (!title) errors.push('Title is required.');
    else if (title.length > 100) errors.push('Title must be 100 characters or fewer.');
    else data.title = title;
  }

  if (!partial || has('description')) {
    const description = clean(body.description);
    if (!description) errors.push('Description is required.');
    else if (description.length > 2000) errors.push('Description must be 2000 characters or fewer.');
    else data.description = description;
  }

  if (has('technologies')) {
    const t = body.technologies;
    if (!Array.isArray(t) || t.length > 20 || !t.every((x) => isString(x) && x.trim() && x.length <= 40)) {
      errors.push('Technologies must be an array of up to 20 short strings.');
    } else {
      data.technologies = t.map((x) => x.trim());
    }
  }

  for (const field of URL_FIELDS) {
    if (has(field)) {
      const value = clean(body[field]);
      if (value && !isHttpUrl(value)) errors.push(`${field} must be a valid http(s) URL.`);
      else data[field] = value;
    }
  }

  if (has('published')) {
    if (typeof body.published !== 'boolean') errors.push('Published must be true or false.');
    else data.published = body.published;
  }

  return { errors, data };
}

// GET /api/projects  (public) - published projects only, newest first
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ published: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// GET /api/projects/admin/all  (admin) - includes unpublished drafts
export const getAllProjectsAdmin = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// GET /api/projects/:id  (public) - one published project
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, published: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true, data: project });
});

// POST /api/projects  (admin)
export const createProject = asyncHandler(async (req, res) => {
  const { errors, data } = parseProjectBody(req.body, { partial: false });
  if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });

  const project = await Project.create(data);
  res.status(201).json({ success: true, data: project });
});

// PUT /api/projects/:id  (admin) - updates only the fields you send
export const updateProject = asyncHandler(async (req, res) => {
  const { errors, data } = parseProjectBody(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ success: false, message: 'No valid fields to update.' });
  }

  const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true, data: project });
});

// DELETE /api/projects/:id  (admin)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  res.json({ success: true, message: 'Project deleted.' });
});
