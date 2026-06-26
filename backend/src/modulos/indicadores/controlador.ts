import { Request, Response } from 'express';
import { pool } from '../../config/bd';

export const obtenerIndicadores = async (req: Request, res: Response) => {
  try {
    const consulta = `
      SELECT codigo, nombre, valor, unidad, fecha_vigencia as fecha, fuente, variacion
      FROM indicadores_economicos
      ORDER BY nombre ASC
    `;
    const resultado = await pool.query(consulta);
    
    // Si la tabla está vacía, podríamos retornar un error o array vacío
    res.status(200).json({
      exito: true,
      datos: resultado.rows
    });
  } catch (error) {
    console.error('Error al obtener indicadores:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al consultar los indicadores económicos.'
    });
  }
};
