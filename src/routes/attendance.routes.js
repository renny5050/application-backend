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

const router = express.Router();

// CRUD básico
router.post('/api/attendance', createAttendance);
router.get('/api/attendance', getAllAttendances);
router.get('/api/attendance/:id', getAttendanceById);
router.put('/api/attendance/:id', updateAttendance);
router.delete('/api/attendance/:id', deleteAttendance);

// Rutas de consulta específicas
router.get('/api/attendance/student/:student_id/class/:class_id', getAttendanceByStudentAndClass);
router.get('/api/attendance/class/:class_id/date/:date', getAttendanceByClassAndDate);
router.get('/api/attendance/student/:student_id', getAttendanceByStudent);
router.get('/api/attendance/class/:class_id', getAttendanceByClass);


export default router;