import { z } from 'zod';
import ClassMessageModel from '../models/classmessage.model.js';

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const titleSchema = z.string().max(100, 'El título no puede exceder los 100 caracteres').optional();
const contentSchema = z.string().min(1, 'El contenido no puede estar vacío');

// Esquema para creación
const createMessageSchema = z.object({
  class_id: idSchema,
  title: titleSchema,
  content: contentSchema
});

// Esquema para actualización
const updateMessageSchema = z.object({
  class_id: idSchema.optional(),
  title: titleSchema,
  content: contentSchema.optional()
}).refine(data => {
  return Object.keys(data).length > 0;
}, {
  message: 'Se requiere al menos un campo para actualizar'
});

// Esquemas de parámetros
const messageIdSchema = z.object({ id: idSchema });
const classIdParamSchema = z.object({ class_id: idSchema });

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};

export const createClassMessage = async (req, res) => {
  try {
    const validation = createMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newMessage = await ClassMessageModel.create(validation.data);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creando mensaje de clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllClassMessages = async (req, res) => {
  try {
    const messages = await ClassMessageModel.findAll();
    res.json(messages);
  } catch (error) {
    console.error('Error obteniendo mensajes de clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getClassMessageById = async (req, res) => {
  try {
    const validation = messageIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const message = await ClassMessageModel.findById(validation.data.id);
    if (!message) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error obteniendo mensaje por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getClassMessagesByClass = async (req, res) => {
  try {
    const validation = classIdParamSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const messages = await ClassMessageModel.findByClass(validation.data.class_id);
    res.json(messages);
  } catch (error) {
    console.error('Error obteniendo mensajes por clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateClassMessage = async (req, res) => {
  try {
    const idValidation = messageIdSchema.safeParse(req.params);
    const bodyValidation = updateMessageSchema.safeParse(req.body);

    if (!idValidation.success) {
      return handleValidationError(idValidation.error, res);
    }
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation.error, res);
    }

    const updatedMessage = await ClassMessageModel.update(
      idValidation.data.id,
      bodyValidation.data
    );
    
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }
    
    res.json(updatedMessage);
  } catch (error) {
    console.error('Error actualizando mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteClassMessage = async (req, res) => {
  try {
    const validation = messageIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const result = await ClassMessageModel.delete(validation.data.id);
    if (!result) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};