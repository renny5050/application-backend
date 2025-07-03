import {pool} from '../db.js';

class AttendanceModel {
    // Crear un nuevo registro de asistencia
    static async create({ student_id, class_id, date, present }) {
        const query = `
            INSERT INTO attendance (student_id, class_id, date, present)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [student_id, class_id, date, present];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Obtener todos los registros de asistencia
    static async findAll() {
        const query = `
            SELECT attendance.*, "User".first_name, "User".email
            FROM attendance
            INNER JOIN "User" ON attendance.student_id = "User".id
            ORDER BY attendance.date DESC
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    // Obtener un registro por ID
    static async findById(id) {
        const query = 'SELECT * FROM attendance WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    // Actualizar un registro de asistencia
    static async update(id, { student_id, class_id, date, present }) {
        const query = `
            UPDATE attendance
            SET student_id = $1, class_id = $2, date = $3, present = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [student_id, class_id, date, present, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Eliminar un registro de asistencia
    static async delete(id) {
        const query = 'DELETE FROM attendance WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    // Obtener asistencia por estudiante y clase
    static async findByStudentAndClass(student_id, class_id) {
        const query = 'SELECT * FROM attendance WHERE student_id = $1 AND class_id = $2';
        const { rows } = await pool.query(query, [student_id, class_id]);
        return rows;
    }

    // Obtener asistencia por clase y fecha
    static async findByClassAndDate(class_id, date) {
        const query = 'SELECT * FROM attendance WHERE class_id = $1 AND date = $2';
        const { rows } = await pool.query(query, [class_id, date]);
        return rows;
    }

    // Obtener asistencia por estudiante
    static async findByStudent(student_id) {
        const query = 'SELECT * FROM attendance WHERE student_id = $1';
        const { rows } = await pool.query(query, [student_id]);
        return rows;
    }

    // Obtener asistencia por clase
    static async findByClass(class_id) {
        const query = 'SELECT * FROM attendance WHERE class_id = $1';
        const { rows } = await pool.query(query, [class_id]);
        return rows;
    }
}

export default AttendanceModel;