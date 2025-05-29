import express from 'express';
import {
    createStudentClass,
    getAllStudentClasses,
    getClassesByStudent,
    getStudentsByClass,
    deleteStudentClass
} from '../controllers/studentclass.controllers.js';

const router = express.Router();

// CRUD para relaciones estudiante-clase
router.post('/api/studentclass', createStudentClass);
router.get('/api/studentclass', getAllStudentClasses);
router.get('/api/studentclass/student/:student_id', getClassesByStudent);
router.get('/api/studentclass/class/:class_id', getStudentsByClass);
router.delete('/api/studentclass', deleteStudentClass);

export default router;

