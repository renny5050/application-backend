import express from 'express';
import {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    getClassesByTeacher,
    getClassesByDay,
    getClassesBySpecialty
} from '../controllers/classes.controllers.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// CRUD para clases
router.post('/api/classes', authenticate, authorize([1,2]), createClass);
router.get('/api/classes', authenticate, authorize([1,2]), getAllClasses);
router.get('/api/classes/:id', authenticate, authorize([1,2]), getClassById);
router.put('/api/classes/:id', authenticate, authorize([1,2]), updateClass);
router.delete('/api/classes/:id', authenticate, authorize([1,2]), deleteClass);

// Rutas adicionales
router.get('/api/classes/teacher/:teacher_id', authenticate, authorize([1,2]), getClassesByTeacher);
router.get('/api/classes/day/:day', authenticate, authorize([1,2]), getClassesByDay);
router.get('/api/classes/specialty/:specialty_id', authenticate, authorize([1,2]), getClassesBySpecialty);

export default router;