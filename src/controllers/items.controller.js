import ItemModel from '../models/items.model.js';

export const createItem = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        
        // Validar campos requeridos
        if (!name || quantity === undefined) {
            return res.status(400).json({ error: 'Nombre y cantidad son campos requeridos' });
        }
        
        // Validar que la cantidad sea un número entero no negativo
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero no negativo' });
        }
        
        const newItem = await ItemModel.create({ name, quantity });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creando ítem:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await ItemModel.findAll();
        res.json(items);
    } catch (error) {
        console.error('Error obteniendo ítems:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await ItemModel.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error obteniendo ítem:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity } = req.body;
        
        // Validar que la cantidad sea un número entero no negativo
        if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero no negativo' });
        }
        
        const updatedItem = await ItemModel.update(id, { name, quantity });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }
        res.json(updatedItem);
    } catch (error) {
        console.error('Error actualizando ítem:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ItemModel.delete(id);
        if (!result) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error eliminando ítem:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
