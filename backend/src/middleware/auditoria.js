/**
 * Middleware de registro de auditoría
 * Guarda en BD cada acción relevante del sistema (POST, PUT, DELETE)
 */
const { consultar } = require('../config/bd');

/**
 * Registra una acción en la tabla de auditoría
 * @param {Object} opciones - Datos de la acción a registrar
 */
const registrarAuditoria = async ({
  usuarioId,
  accion,
  modulo,
  descripcion,
  ipOrigen,
  datosAnteriores = null,
  datosNuevos = null,
}) => {
  try {
    await consultar(
      `INSERT INTO auditoria_eventos
        (usuario_id, accion, modulo, descripcion, ip_origen, datos_anteriores, datos_nuevos)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [usuarioId, accion, modulo, descripcion, ipOrigen,
       datosAnteriores ? JSON.stringify(datosAnteriores) : null,
       datosNuevos     ? JSON.stringify(datosNuevos)     : null]
    );
  } catch (err) {
    // No propagamos el error de auditoría para no interrumpir el flujo principal
    console.error('Error al registrar auditoría:', err.message);
  }
};

/**
 * Middleware automático que registra todas las mutaciones (POST, PUT, PATCH, DELETE)
 */
const middlewareAuditoria = (req, res, next) => {
  const metodosMutacion = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!metodosMutacion.includes(req.method)) {
    return next();
  }

  // Interceptamos el fin de la respuesta para registrar resultado
  const finOriginal = res.json.bind(res);
  res.json = function (cuerpo) {
    if (req.usuario && res.statusCode < 400) {
      registrarAuditoria({
        usuarioId:   req.usuario.id,
        accion:      req.method,
        modulo:      req.path.split('/')[2] || 'general',
        descripcion: `${req.method} ${req.path}`,
        ipOrigen:    req.ip,
        datosNuevos: req.body,
      });
    }
    return finOriginal(cuerpo);
  };

  next();
};

module.exports = { registrarAuditoria, middlewareAuditoria };
