/**
 * Configuración del pool de conexiones a PostgreSQL (Google Cloud SQL)
 * Usa variables de entorno definidas en .env
 */
const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones reutilizable para toda la aplicación
const pool = new Pool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     parseInt(process.env.DB_PORT) || 5432,
  max:      20,         // máximo de conexiones simultáneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: {
    // Google Cloud SQL requiere SSL para conexiones externas
    rejectUnauthorized: false,
  },
});

// Manejador de errores inesperados en el pool
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err.message);
});

/**
 * Prueba la conexión a la base de datos al iniciar el servidor
 */
const probarConexion = async () => {
  try {
    const cliente = await pool.connect();
    const resultado = await cliente.query('SELECT NOW() as hora_servidor');
    console.log(`✅ Conexión exitosa a PostgreSQL | Hora del servidor: ${resultado.rows[0].hora_servidor}`);
    cliente.release();
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    // No abortamos el proceso; el servidor sigue corriendo aunque DB falle
  }
};

/**
 * Ejecuta una consulta SQL con manejo centralizado de errores
 * @param {string} texto - La consulta SQL parametrizada
 * @param {Array} parametros - Array de parámetros para la consulta
 */
const consultar = (texto, parametros) => pool.query(texto, parametros);

module.exports = { pool, probarConexion, consultar };
