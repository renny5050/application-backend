import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (payload) => {
    
    if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
};