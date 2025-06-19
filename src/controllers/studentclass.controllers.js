import { z } from 'zod';
import StudentClassModel from '../models/studentclass.model.js';

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const studentClassSchema = z.object({
  student_id: idSchema,
  class_id: idSchema
});

// Esquemas para parámetros de ruta
const studentIdParamSchema = z.object({ student_id: idSchema });
const classIdParamSchema = z.object({ class_id: idSchema });

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};

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
    console.error('Error creando relación estudiante-clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllStudentClasses = async (req, res) => {
  try {
    const relations = await StudentClassModel.findAll();
    res.json(relations);
  } catch (error) {
    console.error('Error obteniendo relaciones estudiante-clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error obteniendo clases del estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error obteniendo estudiantes de la clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteStudentClass = async (req, res) => {
  try {
    // Validar cuerpo de la solicitud
    const validation = studentClassSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }
    
    const { student_id, class_id } = validation.data;
    
    const deletedRelation = await StudentClassModel.delete(student_id, class_id);
    if (!deletedRelation) {
      return res.status(404).json({ error: 'Relación no encontrada' });
    }
    
    res.status(200).json({
      message: 'Relación eliminada exitosamente',
      deletedRelation
    });
  } catch (error) {
    console.error('Error eliminando relación estudiante-clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};