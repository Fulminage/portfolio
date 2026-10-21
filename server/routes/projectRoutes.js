import { Router } from 'express';
import {
  getProjects, getAllProjectsAdmin, getProject, createProject, updateProject, deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getProjects);
// IMPORTANT: this must come BEFORE "/:id", otherwise "admin" would be treated as an id.
router.get('/admin/all', protect, getAllProjectsAdmin);
router.get('/:id', getProject);

router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
