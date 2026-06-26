/**
 * Middleware de autenticación JWT
 * Verifica el token Bearer en el encabezado Authorization
 */
const jwt = require('jsonwebtoken');

/**
 * Verifica que el request tenga un JWT válido
 * Adjunta el payload decodificado en req.usuario
 */
const verificarToken = (req, res, next) => {
  const encabezado = req.headers['authorization'];

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Acceso denegado: token no proporcionado',
    });
  }

  const token = encabezado.split(' ')[1];

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRETO);
    req.usuario = decodificado;
    next();
  } catch (err) {
    const mensajes = {
      TokenExpiredError: 'El token ha expirado. Por favor inicia sesión nuevamente.',
      JsonWebTokenError: 'Token inválido.',
    };
    return res.status(401).json({
      exito: false,
      mensaje: mensajes[err.name] || 'Error de autenticación.',
    });
  }
};

/**
 * Middleware de autorización por roles
 * @param {...string} rolesPermitidos - Roles que tienen acceso al recurso
 */
const autorizar = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ exito: false, mensaje: 'No autenticado.' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        exito: false,
        mensaje: `Acceso denegado: se requiere rol [${rolesPermitidos.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = { verificarToken, autorizar };
