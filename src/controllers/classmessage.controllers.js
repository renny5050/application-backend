import ClassMessageModel from '../models/classmessage.model.js';
import {
  createMessageSchema,
  updateMessageSchema,
  messageIdSchema,
  classIdParamSchema,
  handleValidationError
} from '../validations/classmessage.schema.js';
import handleDatabaseError from '../utils/errormanager.js'; // Importamos el manejador de errores

export const createClassMessage = async (req, res) => {
  try {
    const validation = createMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newMessage = await ClassMessageModel.create(validation.data);
    res.status(201).json(newMessage);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAllClassMessages = async (req, res) => {
  try {
    const messages = await ClassMessageModel.findAll();
    res.json(messages);
  } catch (error) {
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
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
    handleDatabaseError(error, res);
  }
};