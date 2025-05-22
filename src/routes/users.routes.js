import {Router} from 'express'
import { deleteUser, getuser, updateUser, getUsers, getRoles, registerUser } from '../controllers/users.controllers.js';

const router = Router();

router.get('/api/auth/users', getUsers)

router.get('/api/auth/users/:id', getuser)

router.delete('/api/auth/users/:id', deleteUser)

router.put('/api/auth/users/:id', updateUser)

router.get('/api/auth/roles', getRoles)

router.post('/api/auth/register', registerUser)


export default router;