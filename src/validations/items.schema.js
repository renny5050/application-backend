import {z} from 'zod'

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const nameSchema = z.string().min(1, 'El nombre no puede estar vacío').max(100, 'El nombre no puede exceder los 100 caracteres');
const quantitySchema = z.number().int().nonnegative('La cantidad debe ser un número entero no negativo');

// Esquema para creación
const createItemSchema = z.object({
    name: nameSchema,
    quantity: quantitySchema
});

// Esquema para actualización
const updateItemSchema = z.object({
    name: nameSchema.optional(),
    quantity: quantitySchema.optional()
}).refine(data => {
    return Object.keys(data).length > 0;
}, {
    message: 'Se requiere al menos un campo para actualizar'
});

// Esquema para parámetros de ruta
const itemIdSchema = z.object({ id: idSchema });

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
    nameSchema,
    quantitySchema,
    createItemSchema,
    updateItemSchema,
    itemIdSchema,
    handleValidationError
};