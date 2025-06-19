import { z } from 'zod';
import { UsersModel } from "../models/users.models.js";
import bcrypt from 'bcrypt';

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const firstNameSchema = z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede exceder los 50 caracteres');
const lastNameSchema = z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50, 'El apellido no puede exceder los 50 caracteres');
const emailSchema = z.string().email('Formato de email inválido');
const dniSchema = z.string().min(8, 'El DNI debe tener al menos 8 caracteres').max(15, 'El DNI no puede exceder los 15 caracteres');
const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');
const roleSchema = z.coerce.number().int().min(1, 'Rol inválido').max(4, 'Rol inválido').default(3); // Valor predeterminado 3
const statusSchema = z.enum(['active', 'inactive', 'pending'], { 
  message: 'Estado inválido. Valores permitidos: active, inactive, pending' 
});
const specialtyIdSchema = z.coerce.number().int().positive().optional(); // Opcional sin valor predeterminado

// Esquema para creación de usuario
const createUserSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  dni: dniSchema,
  password: passwordSchema,
  role: roleSchema.optional(), // Usará el valor predeterminado 3 si no se envía
  status: statusSchema.optional().default('active'),
  specialtyId: specialtyIdSchema // Opcional sin valor predeterminado
});

// Esquema para actualización de usuario
const updateUserSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  email: emailSchema.optional(),
  dni: dniSchema.optional(),
  password: passwordSchema.optional(),
  role: roleSchema.optional(),
  status: statusSchema.optional(),
  specialtyId: specialtyIdSchema // Opcional sin valor predeterminado
}).refine(data => Object.keys(data).length > 0, {
  message: 'Se requiere al menos un campo para actualizar'
});

// Esquema para parámetros de ruta
const userIdParamSchema = z.object({ id: idSchema });

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};

// Función para eliminar contraseña de los objetos de usuario
const removePassword = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const getUsers = async (req, res) => {
  try {
    const data = await UsersModel.findAll();
    // Eliminar contraseñas de la respuesta
    const safeData = data.map(removePassword);
    res.json(safeData);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
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
    console.error('Error al buscar usuario por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
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
    console.error('Error al crear usuario:', error);
    
    // Manejo específico de errores de duplicado
    if (error.code === 11000 || error.code === '23505') {
      return res.status(409).json({ 
        message: 'El email o DNI ya está registrado',
        field: error.keyValue ? Object.keys(error.keyValue)[0] : 'email'
      });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
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
    console.error('Error al actualizar usuario:', error);
    
    // Manejo específico de errores de duplicado
    if (error.code === 11000 || error.code === '23505') {
      return res.status(409).json({ 
        message: 'El email o DNI ya está registrado',
        field: error.keyValue ? Object.keys(error.keyValue)[0] : 'email'
      });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
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
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}