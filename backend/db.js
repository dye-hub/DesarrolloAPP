const { Pool } = require('pg');
require('dotenv').config();

// Creamos un pool de conexiones usando los datos de Google Cloud SQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    // Google Cloud requiere modo seguro por defecto para conexiones externas
    rejectUnauthorized: false
  }
});

const probarConexion = async () => {
  try {
    const cliente = await pool.connect();
    console.log('¡Conexión exitosa a la base de datos de DesarrolloAPP en Google Cloud!');
    cliente.release(); // Liberamos la conexión
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  }
};

module.exports = { pool, probarConexion };