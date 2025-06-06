import express from 'express';
import { createSpecialty, getAllSpecialties, getSpecialty, updateSpecialty, deleteSpecialty } from '../controllers/specialties.controllers.js';

const router = express.Router();

router.post('/api/specialties', createSpecialty);
router.get('/api/specialtes', getAllSpecialties);
router.get('/api/specialties/:id', getSpecialtyById);
router.put('/api/specialties/:id', updateSpecialty);
router.delete('/api/specialties/:id', deleteSpecialty);

export default router;