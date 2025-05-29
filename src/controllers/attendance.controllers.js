import AttendanceModel from '../models/attendance.model.js';

export const createAttendance = async (req, res) => {
    try {
        const { student_id, class_id, date, present } = req.body;
        
        // Validar campos requeridos
        if (!student_id || !class_id || !date || present === undefined) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        
        // Validar formato de fecha (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
        }
        
        const newAttendance = await AttendanceModel.create({ student_id, class_id, date, present });
        res.status(201).json(newAttendance);
    } catch (error) {
        console.error('Error creando registro de asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAllAttendances = async (req, res) => {
    try {
        const attendances = await AttendanceModel.findAll();
        res.json(attendances);
    } catch (error) {
        console.error('Error obteniendo registros de asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAttendanceById = async (req, res) => {
    try {
        const attendance = await AttendanceModel.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
        }
        res.json(attendance);
    } catch (error) {
        console.error('Error obteniendo registro de asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { student_id, class_id, date, present } = req.body;
        
        const updatedAttendance = await AttendanceModel.update(id, { 
            student_id, 
            class_id, 
            date, 
            present 
        });
        
        if (!updatedAttendance) {
            return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
        }
        
        res.json(updatedAttendance);
    } catch (error) {
        console.error('Error actualizando registro de asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AttendanceModel.delete(id);
        if (!result) {
            return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error eliminando registro de asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAttendanceByStudentAndClass = async (req, res) => {
    try {
        const { student_id, class_id } = req.params;
        const attendances = await AttendanceModel.findByStudentAndClass(student_id, class_id);
        res.json(attendances);
    } catch (error) {
        console.error('Error obteniendo asistencias por estudiante y clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAttendanceByClassAndDate = async (req, res) => {
    try {
        const { class_id, date } = req.params;
        const attendances = await AttendanceModel.findByClassAndDate(class_id, date);
        res.json(attendances);
    } catch (error) {
        console.error('Error obteniendo asistencias por clase y fecha:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAttendanceByStudent = async (req, res) => {
    try {
        const { student_id } = req.params;
        const attendances = await AttendanceModel.findByStudent(student_id);
        res.json(attendances);
    } catch (error) {
        console.error('Error obteniendo asistencias por estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAttendanceByClass = async (req, res) => {
    try {
        const { class_id } = req.params;
        const attendances = await AttendanceModel.findByClass(class_id);
        res.json(attendances);
    } catch (error) {
        console.error('Error obteniendo asistencias por clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
