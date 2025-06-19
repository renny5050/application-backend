import { z } from 'zod';

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

export {
    idSchema,
    daySchema,
    timeSchema,
    classBaseSchema,
    classSchema,
    partialClassSchema,
    classIdSchema,
    teacherIdSchema,
    specialtyIdSchema,
    dayParamSchema,
    handleValidationError
};