import { Router } from 'express';
import { getUsers, findUserById, createUser, updateUser, deleteUser } from '../controllers/users.controllers.js';

// Obtener todos los usuarios
const router = Router();
router.get('/api/users', getUsers);


// Obtener un usuario específico por ID
router.get('/api/users', findUserById);

// Crear nuevo usuario
router.post('/api/users', createUser);

// Actualizar usuario existente
router.put('/api/users/:id', updatUser);

// Eliminar usuario
router.delete('/api/users/:id', deleteUser);

export default router;