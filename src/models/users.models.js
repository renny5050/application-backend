import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export class UsersModel {
  static async create(userData) {
    try {
      console.log('Creando nuevo usuario...');
      console.log('Datos recibidos:', userData);
      // Si specialty_id no está presente, se pasará como NULL
      const { rows } = await pool.query(
        `
        INSERT INTO "User" 
        (role_id, first_name, last_name, dni, password, email, status, specialty_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id, email, first_name, last_name, dni, status, specialty_id
        `,
        [
          userData.role_id,
          userData.firstName,
          userData.lastName,
          userData.dni,
          userData.password,
          userData.email,
          userData.status,
          userData.specialty_id ?? null // Aseguramos que sea `null` si no está presente
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
        'SELECT id, email, first_name, last_name, dni, role_id, status, specialty_id FROM "User"'
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

  // Nuevo método para obtener usuario con contraseña
  static async findByIdWithPassword(id) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM "User" WHERE id = $1',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      console.log('Actualizando usuario...');
      console.log('Datos recibidos:', updateData);
      // 1. Obtener el usuario existente CON CONTRASEÑA
      const existingUser = await this.findByIdWithPassword(id);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // 2. Combinar valores existentes con actualizaciones
      const mergedData = {
        firstName: updateData.firstName ?? existingUser.first_name,
        lastName: updateData.lastName ?? existingUser.last_name,
        dni: updateData.dni ?? existingUser.dni,
        email: updateData.email ?? existingUser.email,
        status: updateData.status ?? existingUser.status,
        role_id: updateData.role_id ?? existingUser.role_id,
        specialtyId: updateData.specialtyId ?? existingUser.specialty_id
      };

      // 3. Manejo especial para contraseña
      let password = existingUser.password;
      if (updateData.password) {
        password = await bcrypt.hash(updateData.password, 10);
      }

      // 4. Preparar la consulta de actualización
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
        [
          mergedData.firstName,
          mergedData.lastName,
          mergedData.dni,
          mergedData.email,
          password,
          mergedData.status,
          mergedData.role_id,
          mergedData.specialtyId,
          id
        ]
      );
      
      return rows[0];
    } catch (error) {
      throw error;
    }
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

  static async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findTeachers() {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, first_name, last_name, dni, status, role_id, specialty_id FROM "User" WHERE role_id = 2'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findStudents() {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, first_name, last_name, dni, status, role_id, specialty_id FROM "User" WHERE role_id = 3'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}