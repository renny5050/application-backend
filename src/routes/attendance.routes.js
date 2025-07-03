import express from 'express';
import {
    createAttendance,
    getAllAttendances,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudentAndClass,
    getAttendanceByClassAndDate,
    getAttendanceByStudent,
    getAttendanceByClass,
} from '../controllers/attendance.controllers.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// CRUD básico
router.post('/api/attendance', authenticate, authorize([1,2]), createAttendance);
router.get('/api/attendance', authenticate, authorize([1,2]), getAllAttendances);
router.get('/api/attendance/:id', authenticate, authorize([1,2]), getAttendanceById);
router.put('/api/attendance/:id', authenticate, authorize([1,2]), updateAttendance);
router.delete('/api/attendance/:id', authenticate, authorize([1,2]), deleteAttendance);

// Rutas de consulta específicas
router.get('/api/attendance/student/:student_id/class/:class_id', authenticate, authorize([1,2,3]), getAttendanceByStudentAndClass);
router.get('/api/attendance/class/:class_id/date/:date', authenticate, authorize([1,2]), getAttendanceByClassAndDate);
router.get('/api/attendance/student/:student_id', authenticate, authorize([1,2,3]), getAttendanceByStudent);
router.get('/api/attendance/class/:class_id', authenticate, authorize([1,2]), getAttendanceByClass);


export default router;