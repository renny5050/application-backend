import ItemModel from '../models/items.model.js';
import {
  createItemSchema,
  updateItemSchema,
  itemIdSchema,
  handleValidationError
} from '../validations/items.schema.js';
import handleDatabaseError from '../utils/errormanager.js'; // Importamos el manejador de errores

export const createItem = async (req, res) => {
  try {
    const validation = createItemSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newItem = await ItemModel.create(validation.data);
    res.status(201).json(newItem);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.findAll();
    res.json(items);
  } catch (error) {
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
  }
};