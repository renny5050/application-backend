import { z } from "zod";
// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const nameSchema = z.string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede exceder los 100 caracteres');

// Esquemas para parámetros de ruta
const specialtyIdSchema = z.object({ id: idSchema });

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
    specialtyIdSchema,
    handleValidationError
};