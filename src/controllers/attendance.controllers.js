import { z } from 'zod';
import AttendanceModel from '../models/attendance.model.js';

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const attendanceSchema = z.object({
  student_id: idSchema,
  class_id: idSchema,
  date: dateSchema,
  present: z.boolean()
});

const partialAttendanceSchema = attendanceSchema.partial();

const attendanceIdSchema = z.object({
  id: idSchema
});

const studentClassSchema = z.object({
  student_id: idSchema,
  class_id: idSchema
});

const classDateSchema = z.object({
  class_id: idSchema,
  date: dateSchema
});

const studentIdSchema = z.object({
  student_id: idSchema
});

const classIdSchema = z.object({
  class_id: idSchema
});

// Utilidad para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};

export const createAttendance = async (req, res) => {
  try {
    const validation = attendanceSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newAttendance = await AttendanceModel.create(validation.data);
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error('Error creando registro de asistencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await AttendanceModel.findAll();
    res.json(attendances);
  } catch (error) {
    console.error('Error obteniendo registros de asistencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const validation = attendanceIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const attendance = await AttendanceModel.findById(validation.data.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }
    res.json(attendance);
  } catch (error) {
    console.error('Error obteniendo registro de asistencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const idValidation = attendanceIdSchema.safeParse(req.params);
    const bodyValidation = partialAttendanceSchema.safeParse(req.body);

    if (!idValidation.success) {
      return handleValidationError(idValidation.error, res);
    }
    if (!bodyValidation.success) {
      return handleValidationError(bodyValidation.error, res);
    }
    if (Object.keys(bodyValidation.data).length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar' });
    }

    const updatedAttendance = await AttendanceModel.update(
      idValidation.data.id,
      bodyValidation.data
    );

    if (!updatedAttendance) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }

    res.json(updatedAttendance);
  } catch (error) {
    console.error('Error actualizando registro de asistencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const validation = attendanceIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const result = await AttendanceModel.delete(validation.data.id);
    if (!result) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error eliminando registro de asistencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAttendanceByStudentAndClass = async (req, res) => {
  try {
    const validation = studentClassSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { student_id, class_id } = validation.data;
    const attendances = await AttendanceModel.findByStudentAndClass(student_id, class_id);
    res.json(attendances);
  } catch (error) {
    console.error('Error obteniendo asistencias por estudiante y clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAttendanceByClassAndDate = async (req, res) => {
  try {
    const validation = classDateSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { class_id, date } = validation.data;
    const attendances = await AttendanceModel.findByClassAndDate(class_id, date);
    res.json(attendances);
  } catch (error) {
    console.error('Error obteniendo asistencias por clase y fecha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const validation = studentIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { student_id } = validation.data;
    const attendances = await AttendanceModel.findByStudent(student_id);
    res.json(attendances);
  } catch (error) {
    console.error('Error obteniendo asistencias por estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAttendanceByClass = async (req, res) => {
  try {
    const validation = classIdSchema.safeParse(req.params);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const { class_id } = validation.data;
    const attendances = await AttendanceModel.findByClass(class_id);
    res.json(attendances);
  } catch (error) {
    console.error('Error obteniendo asistencias por clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};