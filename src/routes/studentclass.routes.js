import express from 'express';
import {
    createStudentClass,
    getAllStudentClasses,
    getClassesByStudent,
    getStudentsByClass,
    deleteStudentClass
} from '../controllers/studentclass.controllers.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();




// CRUD para relaciones estudiante-clase
router.post('/api/studentclass',  authenticate, authorize([1,2,3]), createStudentClass);
router.get('/api/studentclass',  authenticate, authorize([1,2]), getAllStudentClasses);
router.get('/api/studentclass/student/:student_id',  authenticate, authorize([1,2,3]), getClassesByStudent);
router.get('/api/studentclass/class/:class_id', authenticate, authorize([2]), getStudentsByClass);
router.delete('/api/studentclass', authenticate, authorize([1]), deleteStudentClass);

export default router;