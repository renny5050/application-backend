import { z } from 'zod';
import ItemModel from '../models/items.model.js';

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const nameSchema = z.string().min(1, 'El nombre no puede estar vacío').max(100, 'El nombre no puede exceder los 100 caracteres');
const quantitySchema = z.number().int().nonnegative('La cantidad debe ser un número entero no negativo');

// Esquema para creación
const createItemSchema = z.object({
  name: nameSchema,
  quantity: quantitySchema
});

// Esquema para actualización
const updateItemSchema = z.object({
  name: nameSchema.optional(),
  quantity: quantitySchema.optional()
}).refine(data => {
  return Object.keys(data).length > 0;
}, {
  message: 'Se requiere al menos un campo para actualizar'
});

// Esquema para parámetros de ruta
const itemIdSchema = z.object({ id: idSchema });

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};

export const createItem = async (req, res) => {
  try {
    const validation = createItemSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newItem = await ItemModel.create(validation.data);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creando ítem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error obteniendo ítems:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const validation = itemIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const item = await ItemModel.findById(validation.data.id);
    if (!item) {
      return res.status(404).json({ error: 'Ítem no encontrado' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error obteniendo ítem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const idValidation = itemIdSchema.safeParse(req.params);
    const bodyValidation = updateItemSchema.safeParse(req.body);

    if (!idValidation.success) {
      return handleValidationError(idValidation.error, res);
    }
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation.error, res);
    }

    const updatedItem = await ItemModel.update(
      idValidation.data.id,
      bodyValidation.data
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Ítem no encontrado' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error actualizando ítem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const validation = itemIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const result = await ItemModel.delete(validation.data.id);
    if (!result) {
      return res.status(404).json({ error: 'Ítem no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error eliminando ítem:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};