// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

// Middleware genérico de autenticación
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjunta toda la información del token
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(400).json({ error: 'Token inválido' });
  }
};

// Middleware de autorización por roles
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    
    if (!allowedRoles.includes(req.user.role_id)) {
      
      return res.status(403).json({ 
        error: 'Acceso prohibido: Rol no autorizado' 
      });
    }
    next();
  };
};