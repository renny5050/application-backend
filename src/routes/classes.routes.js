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

const router = express.Router();

// CRUD para clases
router.post('/api/classes', createClass);
router.get('/api/classes', getAllClasses);
router.get('/api/classes/:id', getClassById);
router.put('/api/classes/:id', updateClass);
router.delete('/api/classes/:id', deleteClass);

// Rutas adicionales
router.get('/api/classes/teacher/:teacher_id', getClassesByTeacher);
router.get('/api/classes/day/:day', getClassesByDay);
router.get('/api/classes/specialty/:specialty_id', getClassesBySpecialty);

export default router;