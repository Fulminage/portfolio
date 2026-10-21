import Message from '../models/Message.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clean, isEmail } from '../utils/validators.js';

// POST /api/contact  (public)
export const submitMessage = asyncHandler(async (req, res) => {
  const body = req.body || {};

  // Honeypot: the frontend includes a hidden field called "website".
  // Humans never fill it in; bots usually do. We pretend it worked but save nothing.
  if (body.website) {
    return res.status(201).json({ success: true, message: 'Message sent. Thank you!' });
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const subject = clean(body.subject);
  const message = clean(body.message);

  const errors = [];
  if (!name) errors.push('Name is required.');
  else if (name.length > 100) errors.push('Name must be 100 characters or fewer.');

  if (!email) errors.push('Email is required.');
  else if (!isEmail(email)) errors.push('Email format is invalid.');

  if (!subject) errors.push('Subject is required.');
  else if (subject.length > 150) errors.push('Subject must be 150 characters or fewer.');

  if (!message) errors.push('Message is required.');
  else if (message.length < 10) errors.push('Message must be at least 10 characters.');
  else if (message.length > 5000) errors.push('Message must be 5000 characters or fewer.');

  if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });

  await Message.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: 'Message sent. Thank you!' });
});

// GET /api/contact  (admin) - read the messages people sent you
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
});

// DELETE /api/contact/:id  (admin)
export const deleteMessage = asyncHandler(async (req, res) => {
  const found = await Message.findByIdAndDelete(req.params.id);
  if (!found) return res.status(404).json({ success: false, message: 'Message not found.' });
  res.json({ success: true, message: 'Message deleted.' });
});
