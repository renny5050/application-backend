import StudentClassModel from '../models/studentclass.model.js';

export const createStudentClass = async (req, res) => {
    try {
        const { student_id, class_id } = req.body;
        
        // Validar que se proporcionen ambos IDs
        if (!student_id || !class_id) {
            return res.status(400).json({ error: 'Se requieren student_id y class_id' });
        }
        
        // Verificar si la relación ya existe
        const exists = await StudentClassModel.exists(student_id, class_id);
        if (exists) {
            return res.status(409).json({ error: 'El estudiante ya está inscrito en esta clase' });
        }
        
        const newRelation = await StudentClassModel.create(student_id, class_id);
        res.status(201).json(newRelation);
    } catch (error) {
        console.error('Error creando relación estudiante-clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAllStudentClasses = async (req, res) => {
    try {
        const relations = await StudentClassModel.findAll();
        res.json(relations);
    } catch (error) {
        console.error('Error obteniendo relaciones estudiante-clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getClassesByStudent = async (req, res) => {
    try {
        const { student_id } = req.params;
        const classes = await StudentClassModel.findByStudentId(student_id);
        res.json(classes);
    } catch (error) {
        console.error('Error obteniendo clases del estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getStudentsByClass = async (req, res) => {
    try {
        const { class_id } = req.params;
        const students = await StudentClassModel.findByClassId(class_id);
        res.json(students);
    } catch (error) {
        console.error('Error obteniendo estudiantes de la clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteStudentClass = async (req, res) => {
    try {
        const { student_id, class_id } = req.body;
        
        // Validar que se proporcionen ambos IDs
        if (!student_id || !class_id) {
            return res.status(400).json({ error: 'Se requieren student_id y class_id' });
        }
        
        const deletedRelation = await StudentClassModel.delete(student_id, class_id);
        if (!deletedRelation) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }
        
        res.status(200).json({
            message: 'Relación eliminada exitosamente',
            deletedRelation
        });
    } catch (error) {
        console.error('Error eliminando relación estudiante-clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};