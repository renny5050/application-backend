import { z } from 'zod'

// Esquemas de validación
const idSchema = z.coerce.number().int().positive();
const firstNameSchema = z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede exceder los 50 caracteres');
const lastNameSchema = z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50, 'El apellido no puede exceder los 50 caracteres');
const emailSchema = z.string().email('Formato de email inválido');
const dniSchema = z.string().min(8, 'El DNI debe tener al menos 8 caracteres').max(15, 'El DNI no puede exceder los 15 caracteres');
const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');
const roleSchema = z.coerce.number().int().min(1, 'Rol inválido').max(4, 'Rol inválido').default(3); // Valor predeterminado 3
const statusSchema = z.enum(['active', 'inactive', 'pending'], { 
    message: 'Estado inválido. Valores permitidos: active, inactive, pending' 
});
const specialtyIdSchema = z.coerce.number().int().positive().optional(); // Opcional sin valor predeterminado

// Esquema para creación de usuario
const createUserSchema = z.object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    dni: dniSchema,
    password: passwordSchema,
    role_id: roleSchema.optional(), // Usará el valor predeterminado 3 si no se envía
    status: statusSchema.optional().default('active'),
    specialty_id: specialtyIdSchema.optional() // Opcional sin valor predeterminado
});

// Esquema para actualización de usuario
const updateUserSchema = z.object({
    firstName: firstNameSchema.optional(),
    lastName: lastNameSchema.optional(),
    email: emailSchema.optional(),
    dni: dniSchema.optional(),
    password: passwordSchema.optional(),
    role_id: roleSchema.optional(),
    status: statusSchema.optional(),
    specialtyId: specialtyIdSchema // Opcional sin valor predeterminado
}).refine(data => Object.keys(data).length > 0, {
    message: 'Se requiere al menos un campo para actualizar'
});

// Esquema para parámetros de ruta
const userIdParamSchema = z.object({ id: idSchema });

// Función para manejar errores de validación
const handleValidationError = (error, res) => {
    const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
    }));
    return res.status(400).json({ errors });
};

// Función para eliminar contraseña de los objetos de usuario
const removePassword = (user) => {
    const { password, ...safeUser } = user;
    return safeUser;
};

export {
    idSchema,
    firstNameSchema,
    lastNameSchema,
    emailSchema,
    dniSchema,
    passwordSchema,
    roleSchema,
    statusSchema,
    specialtyIdSchema,
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
    handleValidationError,
    removePassword
};