/**
 * Middleware de auditoría — TypeScript
 * DesarrolloAPP
 * Registra acciones relevantes del sistema en la tabla auditoria_eventos
 */
import type { Request, Response, NextFunction } from 'express';
import { consultar } from '../config/bd';

// Opciones para registro manual de auditoría
interface OpcionesAuditoria {
  usuarioId:        number;
  empresaId?:       number | null;
  accion:           string;
  modulo:           string;
  descripcion:      string;
  ipOrigen?:        string;
  datosAnteriores?: unknown;
  datosNuevos?:     unknown;
}

/**
 * Registra una acción en la tabla de auditoría (uso manual desde controladores)
 */
export const registrarAuditoria = async (
  opciones: OpcionesAuditoria
): Promise<void> => {
  const {
    usuarioId, empresaId = null, accion, modulo,
    descripcion, ipOrigen, datosAnteriores = null, datosNuevos = null,
  } = opciones;

  try {
    await consultar(
      `INSERT INTO auditoria_eventos
         (usuario_id, empresa_id, accion, modulo, descripcion,
          ip_origen, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        usuarioId, empresaId, accion, modulo, descripcion, ipOrigen ?? null,
        datosAnteriores ? JSON.stringify(datosAnteriores) : null,
        datosNuevos     ? JSON.stringify(datosNuevos)     : null,
      ]
    );
  } catch (err) {
    // No propagamos el error de auditoría para no interrumpir el flujo principal
    const mensaje = err instanceof Error ? err.message : String(err);
    console.error('Error al registrar auditoría:', mensaje);
  }
};

const METODOS_MUTACION = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Middleware automático: registra mutaciones HTTP de usuarios autenticados
 */
export const middlewareAuditoria = (
  req:  Request,
  res:  Response,
  next: NextFunction
): void => {
  if (!METODOS_MUTACION.has(req.method)) {
    next();
    return;
  }

  // Interceptamos el fin de la respuesta para capturar el resultado
  const jsonOriginal = res.json.bind(res) as typeof res.json;

  res.json = function (cuerpo: unknown) {
    if (req.usuario && res.statusCode < 400) {
      const segmentos = req.path.split('/').filter(Boolean);
      const modulo    = segmentos[1] ?? 'general';

      registrarAuditoria({
        usuarioId:   req.usuario.id,
        empresaId:   req.usuario.empresaId ?? null,
        accion:      req.method,
        modulo,
        descripcion: `${req.method} ${req.path}`,
        ipOrigen:    req.ip,
        datosNuevos: req.body as unknown,
      }).catch(() => undefined); // silencioso
    }

    return jsonOriginal(cuerpo);
  };

  next();
};
