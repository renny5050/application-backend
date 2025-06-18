import { pool } from '../db.js';

class Specialty {
    static async create(name) {
        const { rows } = await pool.query(
            'INSERT INTO specialties (name) VALUES ($1) RETURNING *',
            [name]
        );
        return rows[0];
    }

    static async findAll() {
        const { rows } = await pool.query(
            'SELECT * FROM specialties ORDER BY id'
        );
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM specialties WHERE id = $1',
            [id]
        );
        return rows[0];
    }

    static async update(id, name) {
        const { rows } = await pool.query(
            'UPDATE specialties SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        return rows[0];
    }

    static async delete(id) {
        const { rows } = await pool.query(
            'DELETE FROM specialties WHERE id = $1 RETURNING id',
            [id]
        );
        return rows[0];
    }
}

export default Specialty;