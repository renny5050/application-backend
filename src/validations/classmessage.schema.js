import { z } from 'zod';
// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const titleSchema = z.string().max(100, 'El título no puede exceder los 100 caracteres').optional();
const contentSchema = z.string().min(1, 'El contenido no puede estar vacío');

// Esquema para creación
const createMessageSchema = z.object({
    class_id: idSchema,
    title: titleSchema,
    content: contentSchema
});

// Esquema para actualización
const updateMessageSchema = z.object({
    class_id: idSchema.optional(),
    title: titleSchema,
    content: contentSchema.optional()
}).refine(data => {
    return Object.keys(data).length > 0;
}, {
    message: 'Se requiere al menos un campo para actualizar'
});

// Esquemas de parámetros
const messageIdSchema = z.object({ id: idSchema });
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
    titleSchema,
    contentSchema,
    createMessageSchema,
    updateMessageSchema,
    messageIdSchema,
    classIdParamSchema,
    handleValidationError
};