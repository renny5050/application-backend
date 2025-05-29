import {pool} from '../db.js';

class StudentClassModel {
    // Crear una nueva relación estudiante-clase
    static async create(student_id, class_id) {
        const query = `
            INSERT INTO student_class (student_id, class_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [student_id, class_id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Obtener todas las relaciones
    static async findAll() {
        const query = 'SELECT * FROM student_class';
        const { rows } = await pool.query(query);
        return rows;
    }

    // Obtener clases de un estudiante específico
    static async findByStudentId(student_id) {
        const query = 'SELECT * FROM student_class WHERE student_id = $1';
        const { rows } = await pool.query(query, [student_id]);
        return rows;
    }

    // Obtener estudiantes de una clase específica
    static async findByClassId(class_id) {
        const query = 'SELECT * FROM student_class WHERE class_id = $1';
        const { rows } = await pool.query(query, [class_id]);
        return rows;
    }

    // Eliminar una relación estudiante-clase
    static async delete(student_id, class_id) {
        const query = `
            DELETE FROM student_class 
            WHERE student_id = $1 AND class_id = $2
            RETURNING *
        `;
        const values = [student_id, class_id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Verificar si existe una relación específica
    static async exists(student_id, class_id) {
        const query = `
            SELECT 1 FROM student_class 
            WHERE student_id = $1 AND class_id = $2
        `;
        const { rows } = await pool.query(query, [student_id, class_id]);
        return rows.length > 0;
    }
}

export default StudentClassModel;