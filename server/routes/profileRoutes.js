import { Router } from 'express';
import { getAbout, updateAbout, getSkills, updateSkills } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

// Mounted at /api, so these become /api/about and /api/skills
const router = Router();
router.get('/about', getAbout);
router.put('/about', protect, updateAbout);
router.get('/skills', getSkills);
router.put('/skills', protect, updateSkills);
export default router;
