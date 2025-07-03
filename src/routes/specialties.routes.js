import express from 'express';
import { createSpecialty, getAllSpecialties, getSpecialtyById, updateSpecialty, deleteSpecialty } from '../controllers/specialties.controllers.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/api/specialties',  authenticate, authorize([1]), createSpecialty);
router.get('/api/specialties',  authenticate, authorize([1]), getAllSpecialties);
router.get('/api/specialties/:id',  authenticate, authorize([1]), getSpecialtyById);
router.put('/api/specialties/:id',  authenticate, authorize([1]), updateSpecialty);
router.delete('/api/specialties/:id',  authenticate, authorize([1]), deleteSpecialty);

export default router;