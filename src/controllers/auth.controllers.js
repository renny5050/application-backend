import {UsersModel} from '../models/users.models.js';
import { generateToken } from '../utils/jwtUtils.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
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
    const token = generateToken(user.id);

    // 4. Enviar respuesta (sin password)
    const { password: _, ...userData } = user;
    res.json({ user: userData, token });

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
    console.log(error);
  }
};