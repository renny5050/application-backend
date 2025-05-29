import ClassMessageModel from '../models/classmessage.model.js';

export const createClassMessage = async (req, res) => {
    try {
        const { class_id, title, content } = req.body;
        
        // Validar campos requeridos
        if (!class_id || !content) {
            return res.status(400).json({ error: 'class_id y content son campos requeridos' });
        }
        
        const newMessage = await ClassMessageModel.create({ class_id, title, content });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creando mensaje de clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAllClassMessages = async (req, res) => {
    try {
        const messages = await ClassMessageModel.findAll();
        res.json(messages);
    } catch (error) {
        console.error('Error obteniendo mensajes de clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClassMessageById = async (req, res) => {
    try {
        const message = await ClassMessageModel.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error obteniendo mensaje por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClassMessagesByClass = async (req, res) => {
    try {
        const { class_id } = req.params;
        const messages = await ClassMessageModel.findByClass(class_id);
        res.json(messages);
    } catch (error) {
        console.error('Error obteniendo mensajes por clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateClassMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { class_id, title, content } = req.body;
        
        const updatedMessage = await ClassMessageModel.update(id, { class_id, title, content });
        if (!updatedMessage) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }
        res.json(updatedMessage);
    } catch (error) {
        console.error('Error actualizando mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteClassMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ClassMessageModel.delete(id);
        if (!result) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error eliminando mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

