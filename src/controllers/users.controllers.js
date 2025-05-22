 import { pool } from '../db.js';

 export const getUsers = async (req, res) => {
 
     const {rows} = await pool.query('SELECT * FROM "User"')
 
     res.json(rows)
 }
 
 export const getuser = async (req, res) => {
    const {id} = req.params;

    const {rows} = await pool.query('SELECT * FROM users WHERE id_users = $1', [id]);


    if (rows.length === 0) return res.status(404).json({message: 'Usuario no encontrado'})

    res.json(rows[0])
}


export const deleteUser = async (req, res) => {
    const {id} = req.params;

    const {rowCount} = await pool.query('DELETE FROM users WHERE id_users = $1 returning *', [id])

    if (rowCount === 0) return res.status(404).json({message: 'Usuario no encontrado'})

    res.sendStatus(204)
}

export const updateUser = async (req, res) => {
    const {id} = req.params
    const data = req.body

    console.log(data)

    const {rows} = await pool.query('UPDATE users SET first_name = $1, last_name= $2 email = $3, password = $4 WHERE id_users = $5', [data.name1, data.name2, data.email, data.password, id])


    res.json(rows[0])
}

export const getRoles = async (req, res) => {

    const {rows} = await pool.query('SELECT * FROM role')
 
     res.json(rows)
}

export const registerUser = async (req, res) => {
    try {
        const data = req.body;

        console.log(data)

        const { rows } = await pool.query(
            `INSERT INTO "User" 
            (role_id, first_name, last_name, dni, password, email, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id, email, first_name, last_name, status`,
            [3, data.firstName, data.lastName, data.dni, data.password, data.email, "active"]
        );


        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: rows[0].id,
                email: rows[0].email,
                nombre: `${rows[0].first_name} ${rows[0].last_name}`,
                status: rows[0].status
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                code: 'EMAIL_EXISTS',
                message: 'El correo electrónico ya está registrado'
            });
        }
        
        if (error.code === '23502') {
            return res.status(400).json({
                code: 'MISSING_FIELDS',
                message: 'Faltan campos obligatorios en la solicitud'
            });
        }

        res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'Error interno del servidor al procesar el registro'
        });
    }
}
