import { z } from 'zod';
import Class from '../models/classes.model.js';

// Esquemas básicos
const idSchema = z.coerce.number().int().positive();
const daySchema = z.enum([
  'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'
]);
const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);

// Esquema base sin refinamiento
const classBaseSchema = z.object({
  specialty_id: idSchema,
  teacher_id: idSchema,
  day: daySchema,
  start_time: timeSchema,
  end_time: timeSchema
});

// Esquema para creación con validación de horas
const classSchema = classBaseSchema.refine(data => {
  const [startHour, startMinute] = data.start_time.split(':').map(Number);
  const [endHour, endMinute] = data.end_time.split(':').map(Number);
  
  return (endHour > startHour) || 
         (endHour === startHour && endMinute > startMinute);
}, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['end_time']
});

// Esquema para actualización (campos opcionales)
const partialClassSchema = classBaseSchema.partial().refine(data => {
  // Validar horas solo si ambas están presentes
  if (data.start_time && data.end_time) {
    const [startHour, startMinute] = data.start_time.split(':').map(Number);
    const [endHour, endMinute] = data.end_time.split(':').map(Number);
    
    return (endHour > startHour) || 
           (endHour === startHour && endMinute > startMinute);
  }
  return true;
}, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['end_time']
}).refine(data => {
  return Object.keys(data).length > 0;
}, {
  message: 'Se requiere al menos un campo para actualizar'
});


// Esquemas para parámetros de ruta
const classIdSchema = z.object({ id: idSchema });
const teacherIdSchema = z.object({ teacher_id: idSchema });
const specialtyIdSchema = z.object({ specialty_id: idSchema });
const dayParamSchema = z.object({ day: daySchema });

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};

export const createClass = async (req, res) => {
  try {
    const validation = classSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(validation.error, res);
    }

    const newClass = await Class.create(validation.data);
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    console.error('Error obteniendo clases:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error obteniendo clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error actualizando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error eliminando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error obteniendo clases por profesor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error obteniendo clases por día:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    console.error('Error obteniendo clases por especialidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};