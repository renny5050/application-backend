// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const checkAdminRole = (req, res, next) => {
    // 1. Obtener el token del header (corregido)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extrae el token del formato "Bearer <token>"

    try {
        // 2. Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Verificar el rol
        if (decoded.role_id !== 1) {
            return res.status(403).json({ error: 'Acceso prohibido. Se requiere rol de administrador' });
        }

        // 4. Adjuntar datos del usuario al request
        req.user = decoded;
        next();
    } catch (error) {
        // Manejo de errores específicos
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expirado' });
        }
        res.status(400).json({ error: 'Token inválido' });
    }
};

export default checkAdminRole;