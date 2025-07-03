import { pool } from '../db.js';

class Class {
    static async create({ specialty_id, teacher_id, day, start_time, end_time }) {
        console.log('Creating class');
        const { rows } = await pool.query(
            `INSERT INTO classes (specialty_id, teacher_id, day, start_time, end_time)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [specialty_id, teacher_id, day, start_time, end_time]
        );
        return rows[0];
    }

    static async findAll() {
        const { rows } = await pool.query(
            `SELECT c.*, 
                    CONCAT(u.first_name, ' ', u.last_name) AS teacher_name, 
                    s.name AS specialty_name
            FROM classes c
            INNER JOIN "User" u ON c.teacher_id = u.id
            INNER JOIN specialties s ON c.specialty_id = s.id
            ORDER BY c.id`
        );
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT c.*, 
                    CONCAT(u.first_name, ' ', u.last_name) AS teacher_name, 
                    s.name AS specialty_name
            FROM classes c
            INNER JOIN "User" u ON c.teacher_id = u.id
            INNER JOIN specialties s ON c.specialty_id = s.id
            WHERE c.id = $1`,
            [id]
        );
        return rows[0];
    }

    static async update(id, { specialty_id, teacher_id, day, start_time, end_time }) {
        const { rows } = await pool.query(
            `UPDATE classes
             SET specialty_id = $1, teacher_id = $2, day = $3, start_time = $4, end_time = $5
             WHERE id = $6
             RETURNING *`,
            [specialty_id, teacher_id, day, start_time, end_time, id]
        );
        return rows[0];
    }

    static async delete(id) {
        const { rows } = await pool.query(
            'DELETE FROM classes WHERE id = $1 RETURNING id',
            [id]
        );
        return rows[0];
    }

    static async findByTeacher(teacher_id) {
        const { rows } = await pool.query(
            `SELECT c.*, 
                    CONCAT(u.first_name, ' ', u.last_name) AS teacher_name, 
                    s.name AS specialty_name
            FROM classes c
            INNER JOIN "User" u ON c.teacher_id = u.id
            INNER JOIN specialties s ON c.specialty_id = s.id
            WHERE c.teacher_id = $1`,
            [teacher_id]
        );
        return rows;
    }

    static async findByDay(day) {
        const { rows } = await pool.query(
            `SELECT c.*, u.name AS teacher_name, s.name AS specialty_name
             FROM classes c
             INNER JOIN "User" u ON c.teacher_id = u.id
             INNER JOIN specialties s ON c.specialty_id = s.id
             WHERE c.day = $1`,
            [day]
        );
        return rows;
    }

    static async findBySpecialty(specialty_id) {
        const { rows } = await pool.query(
            `SELECT c.*, u.name AS teacher_name, s.name AS specialty_name
             FROM classes c
             INNER JOIN "User" u ON c.teacher_id = u.id
             INNER JOIN specialties s ON c.specialty_id = s.id
             WHERE c.specialty_id = $1`,
            [specialty_id]
        );
        return rows;
    }
}

export default Class;