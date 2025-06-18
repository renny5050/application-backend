import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export class UsersModel {
  static async create(userData) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO "User" 
        (role_id, first_name, last_name, dni, password, email, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id, email, first_name, last_name, dni, status`,
        [
          userData.role,
          userData.firstName,
          userData.lastName,
          userData.dni,
          userData.password,
          userData.email,
          userData.status
        ]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, first_name, last_name, dni, role_id status, specialty_id FROM "User"'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, first_name, last_name, dni, status, role_id, specialty_id FROM "User" WHERE id = $1',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

    static async update(id, { firstName, lastName, dni, email, password, status, role, specialtyId }) {
        const { rows } = await pool.query(
            `UPDATE "User" SET
                first_name = $1,
                last_name = $2,
                dni = $3,
                email = $4,
                password = $5,
                status = $6,
                role_id = $7,
                specialty_id = $8
            WHERE id = $9
            RETURNING id, email, first_name, last_name, dni, status, role_id, specialty_id`,
            [firstName, lastName, dni, email, password, status, role, specialtyId, id]
        );
        return rows[0];
    }

  static async delete(id) {
    try {
      const { rowCount } = await pool.query(
        'DELETE FROM "User" WHERE id = $1',
        [id]
      );
      return rowCount > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM "User" WHERE email = $1',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async comparePasswords (plainPassword, hashedPassword){
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

