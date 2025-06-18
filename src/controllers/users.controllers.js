import { UsersModel } from "../models/users.models.js";
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
    try {
        const data = await UsersModel.findAll();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const findUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UsersModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const createUser = async (req, res) => {
    try {
        // 1. Validación básica
        const requiredFields = ['firstName', 'lastName', 'email', 'dni', 'password'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    message: `Campo requerido faltante: ${field}`
                });
            }
        }

        // 2. Hashear contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // 3. Preparar datos seguros
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            dni: req.body.dni,
            status: "active"
        };

        // 4. Crear usuario
        const newUser = await UsersModel.create(userData);
        
        // 5. Eliminar contraseña de la respuesta
        const { password, ..safeUser } = newUser;
        
        // 6. Respuesta segura
        res.status(201).json(safeUser);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        
        // Manejo específico de errores de duplicado
        if (error.code === 11000 || error.code === '23505') {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UsersModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Campos permitidos para actualizar
        const updatableFields = ['firstName', 'lastName', 'email', 'dni', 'role', 'status', 'password', "specialtyId"];
        const updates = {};

        for (const field of updatableFields) {
            if (req.body[field] !== undefined) {
                if (field === 'password') {
                    updates.password = await bcrypt.hash(req.body.password, 10);
                } else if (field === 'status') {
                    updates.status = req.body.status ?? "active";
                } else {
                    updates[field] = req.body[field];
                }
            }
        }

        // Actualizar usuario
        const updatedUser = await UsersModel.update(id, updates);

        // Eliminar contraseña de la respuesta
        const { password, ...safeUser } = updatedUser;

        res.json(safeUser);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        if (error.code === 11000 || error.code === '23505') {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UsersModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await UsersModel.deleteById(id);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}