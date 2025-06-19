import { z } from 'zod';

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

export {
    idSchema,
    studentClassSchema,
    studentIdParamSchema,
    classIdParamSchema,
    handleValidationError
};
