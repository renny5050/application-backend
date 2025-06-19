import { z } from 'zod';
import { UsersModel } from '../models/users.models.js';
import { generateToken } from '../utils/jwtUtils.js';

// Esquema de validación para el login
const loginSchema = z.object({
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path[0],
    message: err.message
  }));
  return res.status(400).json({ errors });
};

export const login = async (req, res) => {
  try {
    // Validar los datos de entrada con Zod
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { email, password } = validation.data;

    // 1. Verificar si el usuario existe
    const user = await UsersModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Validar contraseña
    const validPassword = await UsersModel.comparePasswords(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar JWT
    const token = generateToken({ 
      id: user.id, 
      role_id: user.role_id,
      email: user.email
    });

    res.json({ token });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};