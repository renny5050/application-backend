import StudentClassModel from '../models/studentclass.model.js';
import {
  studentClassSchema,
  studentIdParamSchema,
  classIdParamSchema,
  handleValidationError
} from '../validations/studentclass.schema.js';
import handleDatabaseError from '../utils/errormanager.js'; // Importamos el manejador de errores
import { z } from 'zod';

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
    console.log('Obteniendo estudiantes por clase...');
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
    console.log('Eliminando relación estudiante-clase...');
    
    // Log para depurar
    console.log('Datos recibidos:', req.body);

    // Validar parámetros del body
    const validation = z.object({
      student_id: z.coerce.number().int().positive(),
      class_id: z.coerce.number().int().positive()
    }).safeParse(req.body);
    
    if (!validation.success) {
      console.error('Error de validación:', validation.error);
      return res.status(400).json({ error: validation.error.message });
    }
    
    const { student_id, class_id } = validation.data;

    // Eliminar la relación estudiante-clase
    const deleted = await StudentClassModel.delete(student_id, class_id);
    
    if (deleted) {
      res.status(200).json({ message: 'Relación eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Relación no encontrada' });
    }
  } catch (error) {
    console.error('Error en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};