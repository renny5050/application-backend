import { UsersModel } from "../models/users.models.js";
import bcrypt from 'bcrypt';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  handleValidationError,
  removePassword
} from "../validations/user.schema.js";
import handleDatabaseError from "../utils/errormanager.js"; // Importamos el manejador de errores

export const getUsers = async (req, res) => {
  try {
    const data = await UsersModel.findAll();
    // Eliminar contraseñas de la respuesta
    const safeData = data.map(removePassword);
    res.json(safeData);
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export const findUserById = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const validation = userIdParamSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const user = await UsersModel.findById(validation.data.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Eliminar contraseña de la respuesta
    res.json(removePassword(user));
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export const createUser = async (req, res) => {
  try {
    // Validar cuerpo de la solicitud
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(validation.data.password, 10);
    
    // Preparar datos con role predeterminado si es necesario
    const userData = { 
      ...validation.data, 
      password: hashedPassword,
      role: validation.data.role || 3 // Asegurar valor predeterminado 3 para role
    };

    // Crear usuario
    const newUser = await UsersModel.create(userData);
    
    // Respuesta segura (sin contraseña)
    res.status(201).json(removePassword(newUser));
  } catch (error) {
    
    handleDatabaseError(error, res);
  }
}

export const updateUser = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const idValidation = userIdParamSchema.safeParse(req.params);
    if (!idValidation.success) {
      return handleValidationError(idValidation.error, res);
    }

    // Validar cuerpo de la solicitud
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation.error, res);
    }

    // Verificar si el usuario existe
    const user = await UsersModel.findById(idValidation.data.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Hashear contraseña si se proporciona
    const updates = { ...bodyValidation.data };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Actualizar usuario
    const updatedUser = await UsersModel.update(idValidation.data.id, updates);

    // Respuesta segura (sin contraseña)
    res.json(removePassword(updatedUser));
  } catch (error) {
    // Manejo específico de errores de duplicado
    if (error.code === '23505') {
      // Determinar qué campo causó la violación de unicidad
      let field = 'email';
      if (error.detail.includes('dni')) {
        field = 'dni';
      }
      
      return res.status(409).json({ 
        message: `El ${field} ya está registrado`,
        field
      });
    }
    
    handleDatabaseError(error, res);
  }
}

export const deleteUser = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const validation = userIdParamSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    // Verificar si el usuario existe
    const user = await UsersModel.findById(validation.data.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar usuario
    await UsersModel.deleteById(validation.data.id);
    
    // Respuesta segura (sin contraseña)
    res.json({ 
      message: 'Usuario eliminado correctamente',
      user: removePassword(user)
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}