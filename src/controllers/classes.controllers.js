import Class from '../models/classes.model.js';

export const createClass = async (req, res) => {
    try {
        const { specialty_id, teacher_id, day, start_time, end_time } = req.body;
        
        // Validación básica
        if (!specialty_id || !teacher_id || !day || !start_time || !end_time) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        
        const newClass = await Class.create({ specialty_id, teacher_id, day, start_time, end_time });
        res.status(201).json(newClass);
    } catch (error) {
        console.error('Error creando clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.json(classes);
    } catch (error) {
        console.error('Error obteniendo clases:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClassById = async (req, res) => {
    try {
        const classRecord = await Class.findById(req.params.id);
        if (!classRecord) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }
        res.json(classRecord);
    } catch (error) {
        console.error('Error obteniendo clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { specialty_id, teacher_id, day, start_time, end_time } = req.body;
        
        const updatedClass = await Class.update(id, { specialty_id, teacher_id, day, start_time, end_time });
        if (!updatedClass) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }
        res.json(updatedClass);
    } catch (error) {
        console.error('Error actualizando clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Class.delete(id);
        if (!result) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error eliminando clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClassesByTeacher = async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const classes = await Class.findByTeacher(teacher_id);
        res.json(classes);
    } catch (error) {
        console.error('Error obteniendo clases por profesor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClassesByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const classes = await Class.findByDay(day);
        res.json(classes);
    } catch (error) {
        console.error('Error obteniendo clases por día:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClassesBySpecialty = async (req, res) => {
    try {
        const { specialty_id } = req.params;
        const classes = await Class.findBySpecialty(specialty_id);
        res.json(classes);
    } catch (error) {
        console.error('Error obteniendo clases por especialidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};