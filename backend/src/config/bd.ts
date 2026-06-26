/**
 * Configuración del pool de conexiones a PostgreSQL (Google Cloud SQL)
 * Migrado a TypeScript — DesarrolloAPP
 */
import { Pool, type QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexiones reutilizable para toda la aplicación
const pool = new Pool({
  host:                   process.env.DB_HOST,
  user:                   process.env.DB_USER,
  password:               process.env.DB_PASSWORD,
  database:               process.env.DB_NAME,
  port:                   parseInt(process.env.DB_PORT ?? '5432', 10),
  max:                    20,
  idleTimeoutMillis:      30_000,
  connectionTimeoutMillis: 5_000,
  ssl: {
    // Google Cloud SQL requiere SSL para conexiones externas
    rejectUnauthorized: false,
  },
});

// Manejador de errores inesperados en el pool
pool.on('error', (err: Error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err.message);
});

/**
 * Prueba la conexión a la base de datos al iniciar el servidor
 */
export const probarConexion = async (): Promise<void> => {
  try {
    const cliente = await pool.connect();
    const resultado = await cliente.query<{ hora_servidor: string }>(
      'SELECT NOW() as hora_servidor'
    );
    console.log(
      `✅ Conexión exitosa a PostgreSQL | Hora del servidor: ${resultado.rows[0].hora_servidor}`
    );
    cliente.release();
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : String(err);
    console.error('❌ Error al conectar a la base de datos:', mensaje);
  }
};

/**
 * Ejecuta una consulta SQL parametrizada
 * @param texto  - Consulta SQL con parámetros ($1, $2, ...)
 * @param params - Array de valores para los parámetros
 */
export const consultar = <T = Record<string, unknown>>(
  texto:  string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(texto, params);

export { pool };
