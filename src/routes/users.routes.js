import { Router } from 'express';
import { getUsers, findUserById, createUser, updateUser, deleteUser, getTeachers, getStudents } from '../controllers/users.controllers.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
// Obtener todos los usuarios
const router = Router();
router.get('/api/users', authenticate, authorize([1]), getUsers);


// Obtener un usuario específico por ID
router.get('/api/users/:id',  authenticate, authorize([1]), findUserById);

// Crear nuevo usuario
router.post('/api/users', createUser);

// Actualizar usuario existente
router.put('/api/users/:id', authenticate, authorize([1]), updateUser);

// Eliminar usuario
router.delete('/api/users/:id', authenticate, authorize([1]), deleteUser);

router.get('/api/teachers', authenticate, authorize([1]), getTeachers);

router.get('/api/students', authenticate, authorize([1,2]), getStudents);

export default router;