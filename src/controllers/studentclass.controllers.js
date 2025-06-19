import StudentClassModel from '../models/studentclass.model.js';
import {
  studentClassSchema,
  studentIdParamSchema,
  classIdParamSchema,
  handleValidationError
} from '../validations/studentclass.schema.js';
import handleDatabaseError from '../utils/errormanager.js'; // Importamos el manejador de errores

export const createStudentClass = async (req, res) => {
  try {
    // Validar cuerpo de la solicitud
    const validation = studentClassSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }
    
    const { student_id, class_id } = validation.data;
    
    // Verificar si la relación ya existe
    const exists = await StudentClassModel.exists(student_id, class_id);
    if (exists) {
      return res.status(409).json({ error: 'El estudiante ya está inscrito en esta clase' });
    }
    
    const newRelation = await StudentClassModel.create(student_id, class_id);
    res.status(201).json(newRelation);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getAllStudentClasses = async (req, res) => {
  try {
    const relations = await StudentClassModel.findAll();
    res.json(relations);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getClassesByStudent = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const validation = studentIdParamSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const classes = await StudentClassModel.findByStudentId(validation.data.student_id);
    res.json(classes);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getStudentsByClass = async (req, res) => {
  try {
    // Validar parámetro de ruta
    const validation = classIdParamSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const students = await StudentClassModel.findByClassId(validation.data.class_id);
    res.json(students);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const deleteStudentClass = async (req, res) => {
  try {
    // Validar parámetros de la ruta (cambiado de body a params)
    const validation = studentIdParamSchema.and(classIdParamSchema).safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }
    
    const { student_id, class_id } = validation.data;
    
    // Verificar si existe la relación
    const exists = await StudentClassModel.exists(student_id, class_id);
    if (!exists) {
      return res.status(404).json({ error: 'Relación no encontrada' });
    }
    
    const result = await StudentClassModel.delete(student_id, class_id);
    if (!result) {
      return res.status(500).json({ error: 'Error al eliminar la relación' });
    }
    
    res.status(204).end();
  } catch (error) {
    handleDatabaseError(error, res);
  }
};