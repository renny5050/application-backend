import Class from '../models/classes.model.js';
import {
  classSchema,
  partialClassSchema,
  classIdSchema,
  teacherIdSchema,
  specialtyIdSchema,
  dayParamSchema,
  handleValidationError
} from '../validations/classes.schema.js';
import handleDatabaseError from '../utils/errormanager.js'; // Importamos el manejador de errores

export const createClass = async (req, res) => {
  try {
    const validation = classSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newClass = await Class.create(validation.data);
    res.status(201).json(newClass);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getClassById = async (req, res) => {
  try {
    const validation = classIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const classRecord = await Class.findById(validation.data.id);
    if (!classRecord) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    res.json(classRecord);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const updateClass = async (req, res) => {
  try {
    const idValidation = classIdSchema.safeParse(req.params);
    const bodyValidation = partialClassSchema.safeParse(req.body);

    if (!idValidation.success) {
      return handleValidationError(idValidation.error, res);
    }
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation.error, res);
    }

    const updatedClass = await Class.update(
      idValidation.data.id, 
      bodyValidation.data
    );
    
    if (!updatedClass) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    
    res.json(updatedClass);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const deleteClass = async (req, res) => {
  try {
    const validation = classIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const result = await Class.delete(validation.data.id);
    if (!result) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    res.status(204).end();
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getClassesByTeacher = async (req, res) => {
  try {
    const validation = teacherIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const classes = await Class.findByTeacher(validation.data.teacher_id);
    res.json(classes);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getClassesByDay = async (req, res) => {
  try {
    const validation = dayParamSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const classes = await Class.findByDay(validation.data.day);
    res.json(classes);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getClassesBySpecialty = async (req, res) => {
  try {
    const validation = specialtyIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const classes = await Class.findBySpecialty(validation.data.specialty_id);
    res.json(classes);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};