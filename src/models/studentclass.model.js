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

    // Obtener clases de un estudiante específico con JOIN a Class y User
    static async findByStudentId(student_id) {
        const query = `
            SELECT 
                sc.student_id,
                sc.class_id,
                c.day,
                c.start_time,
                c.end_time,
                c.specialty_id,
                u.first_name || ' ' || u.last_name AS teacher_name,
                s.name AS specialty_name
            FROM student_class sc
            INNER JOIN classes c ON sc.class_id = c.id
            INNER JOIN "User" u ON c.teacher_id = u.id
            INNER JOIN specialties s ON c.specialty_id = s.id
            WHERE sc.student_id = $1
        `;
        const { rows } = await pool.query(query, [student_id]);
        return rows;
    }

    // Obtener estudiantes de una clase específica
    static async findByClassId(class_id) {
        const query = `
            SELECT 
                sc.student_id,
                sc.class_id,
                u.first_name,
                u.last_name,
                u.email
            FROM student_class sc
            INNER JOIN "User" u ON sc.student_id = u.id
            WHERE sc.class_id = $1
        `;
        const { rows } = await pool.query(query, [class_id]);
        return rows;
    }

    // Eliminar una relación estudiante-clase
    static async delete(student_id, class_id) {
        console.log('ELIMINANDO', student_id, class_id);
        
        const query = `
            DELETE FROM student_class 
            WHERE student_id = $1 AND class_id = $2
            RETURNING *
        `;
        const values = [student_id, class_id];
        const { rows } = await pool.query(query, values);
        console.log('Eliminando relación estudiante-clase:', rows);
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