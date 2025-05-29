import {pool} from '../db.js';

class ClassMessageModel {
    // Crear un nuevo mensaje
    static async create({ class_id, title, content }) {
        const query = `
            INSERT INTO class_message (class_id, title, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [class_id, title, content];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Obtener todos los mensajes
    static async findAll() {
        const query = 'SELECT * FROM class_message ORDER BY created_at DESC';
        const { rows } = await pool.query(query);
        return rows;
    }

    // Obtener un mensaje por ID
    static async findById(id) {
        const query = 'SELECT * FROM class_message WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    // Obtener mensajes por clase
    static async findByClass(class_id) {
        const query = 'SELECT * FROM class_message WHERE class_id = $1 ORDER BY created_at DESC';
        const { rows } = await pool.query(query, [class_id]);
        return rows;
    }

    // Actualizar un mensaje
    static async update(id, { class_id, title, content }) {
        const query = `
            UPDATE class_message
            SET class_id = $1, title = $2, content = $3
            WHERE id = $4
            RETURNING *
        `;
        const values = [class_id, title, content, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Eliminar un mensaje
    static async delete(id) {
        const query = 'DELETE FROM class_message WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

}

export default ClassMessageModel;