import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error executing test query', err.stack);
    } else {
        console.log('Database connected:', result.rows[0]);
    }
});
