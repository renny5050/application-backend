import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Configuración SSL
const sslConfig = {
  rejectUnauthorized: true,
  ca: process.env.DB_CA_CERT
};

// Si prefieres cargar desde archivo externo:
// const sslConfig = {
//   rejectUnauthorized: true,
//   ca: fs.readFileSync('aiven_ca.crt').toString()
// };

export const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: sslConfig
});

// Función de prueba mejorada
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', result.rows[0].now);
    
    // Verificar versión de PostgreSQL
    const version = await pool.query('SELECT version()');
    console.log('📊 PostgreSQL version:', version.rows[0].version.split(',')[0]);
    
    // Verificar tablas existentes
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('🗂️ Tables in database:', tables.rows.map(row => row.table_name));
    
  } catch (err) {
    console.error('❌ Database connection error:', err);
    
    // Información adicional para diagnóstico
    console.log('ℹ️ Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      ssl: !!sslConfig
    });
    
    // Verificar certificado
    if (sslConfig.ca) {
      console.log('🔐 CA Certificate present:', sslConfig.ca.length > 100);
    } else {
      console.error('⚠️ Missing CA certificate!');
    }
    
    process.exit(1); // Salir con error
  }
}

// Ejecutar prueba de conexión
testConnection();