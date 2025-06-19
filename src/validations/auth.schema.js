import { z } from 'zod';

// Esquema de validación para el login
const loginSchema = z.object({
    email: z.string().email('Formato de email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
    const errors = error.errors.map(err => ({
        field: err.path[0],
        message: err.message
    }));
    return res.status(400).json({ errors });
};

export { loginSchema, handleValidationError };
