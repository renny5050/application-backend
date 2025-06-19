// validations/attendance.schema.js
import { z } from 'zod';

// Esquemas base
export const idSchema = z.coerce.number().int().positive({
  message: 'ID debe ser un número entero positivo'
});

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: 'Fecha debe tener el formato YYYY-MM-DD'
});

// Esquemas principales
export const attendanceSchema = z.object({
  student_id: idSchema,
  class_id: idSchema,
  date: dateSchema,
  present: z.boolean({
    message: 'El campo present debe ser un valor booleano'
  })
});

export const partialAttendanceSchema = attendanceSchema.partial();

export const attendanceIdSchema = z.object({
  id: idSchema
});

export const studentClassSchema = z.object({
  student_id: idSchema,
  class_id: idSchema
});

export const classDateSchema = z.object({
  class_id: idSchema,
  date: dateSchema
});

export const studentIdSchema = z.object({
  student_id: idSchema
});

export const classIdSchema = z.object({
  class_id: idSchema
});

// Función para manejar errores (opcional - recomendado mantener en controlador)
export const handleValidationError = (error, res) => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  return res.status(400).json({ errors });
};
