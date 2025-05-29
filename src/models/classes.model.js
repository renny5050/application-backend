import {pool} from '../db.js';

class Class {
    static async create({ specialty_id, teacher_id, day, start_time, end_time }) {
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
            'SELECT * FROM classes ORDER BY id'
        );
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM classes WHERE id = $1',
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
            'SELECT * FROM classes WHERE teacher_id = $1',
            [teacher_id]
        );
        return rows;
    }

    static async findByDay(day) {
        const { rows } = await pool.query(
            'SELECT * FROM classes WHERE day = $1',
            [day]
        );
        return rows;
    }
    
    static async findBySpecialty(specialty_id) {
        const { rows } = await pool.query(
            'SELECT * FROM classes WHERE specialty_id = $1',
            [specialty_id]
        );
        return rows;
    }
}

export default Class;