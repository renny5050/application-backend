function getPostgresErrorMessage(errorCode) {
    const errorMessages = {
        // Errores de integridad de datos
        '23505': 'Violación de unicidad: ya existe un registro con estos datos',
        '23503': 'Violación de llave foránea: referencia a registro inexistente',
        '23502': 'Violación de NOT NULL: campo obligatorio sin valor',
        '23514': 'Violación de check constraint: valor no cumple con las reglas',
        '22P02': 'Error de formato: valor incorrecto para el tipo de dato',
        '22001': 'Valor demasiado largo para el tipo de dato',
        
        // Errores de sintaxis y acceso
        '42601': 'Error de sintaxis SQL',
        '42501': 'Permiso denegado: falta de privilegios',
        '42P01': 'Tabla inexistente',
        '42703': 'Columna inexistente',
        '42P07': 'Tabla duplicada (ya existe)',
        
        // Errores de conexión y sistema
        '28000': 'Acceso no autorizado',
        '28P01': 'Contraseña de autenticación inválida',
        '3D000': 'Base de datos no existe',
        '3F000': 'Esquema no existe',
        '40P01': 'Deadlock detectado',
        '53300': 'Demasiadas conexiones simultáneas',
        '57P03': 'Base de datos en pausa',
        
        // Errores de transacciones
        '25P02': 'Transacción en estado fallido',
        '40001': 'Serialización fallida',
        
        // Errores de configuración
        'F0000': 'Error de configuración',
        'F0001': 'Archivo de configuración faltante'
    };

    return errorMessages[errorCode] || `Error desconocido (código: ${errorCode})`;
}

const handleDatabaseError = (error, res) => {
  console.error('Error de base de datos:', error);
  
  if (error.code) {
    const message = getPostgresErrorMessage(error.code);
    return res.status(400).json({ error: message });
  }
};

export default handleDatabaseError;