import {pool} from '../db.js';

class ItemModel {
    // Crear un nuevo ítem
    static async create({ name, quantity }) {
        const query = `
            INSERT INTO items (name, quantity)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [name, quantity];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Obtener todos los ítems
    static async findAll() {
        const query = 'SELECT * FROM items ORDER BY id';
        const { rows } = await pool.query(query);
        return rows;
    }

    // Obtener un ítem por ID
    static async findById(id) {
        const query = 'SELECT * FROM items WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    // Actualizar un ítem
    static async update(id, { name, quantity }) {
        const query = `
            UPDATE items
            SET name = $1, quantity = $2
            WHERE id = $3
            RETURNING *
        `;
        const values = [name, quantity, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    // Eliminar un ítem
    static async delete(id) {
        const query = 'DELETE FROM items WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

export default ItemModel;