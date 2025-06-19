import { UsersModel } from '../models/users.models.js';
import { generateToken } from '../utils/jwtUtils.js';
import { loginSchema, handleValidationError } from '../validations/auth.schema.js';
import handleDatabaseError  from '../utils/errormanager.js'; // Importamos el manejador de errores

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
    handleDatabaseError(error, res);
  }
};