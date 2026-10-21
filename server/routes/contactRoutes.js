import { Router } from 'express';
import { submitMessage, getMessages, deleteMessage } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/', contactLimiter, submitMessage);
router.get('/', protect, getMessages);
router.delete('/:id', protect, deleteMessage);
export default router;
