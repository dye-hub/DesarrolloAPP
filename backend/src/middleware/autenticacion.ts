/**
 * Middleware de autenticación JWT — TypeScript
 * DesarrolloAPP
 */
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { PayloadJwt, RolUsuario } from '../tipos/global';

/**
 * Verifica que el request tenga un JWT válido en el header Authorization.
 * Adjunta el payload decodificado en `req.usuario`.
 */
export const verificarToken = (
  req:  Request,
  res:  Response,
  next: NextFunction
): void => {
  const encabezado = req.headers['authorization'];

  if (!encabezado?.startsWith('Bearer ')) {
    res.status(401).json({
      exito:   false,
      mensaje: 'Acceso denegado: token no proporcionado.',
    });
    return;
  }

  const token = encabezado.split(' ')[1];

  try {
    const secreto  = process.env.JWT_SECRETO ?? '';
    const decodificado = jwt.verify(token, secreto) as PayloadJwt;
    req.usuario = decodificado;
    next();
  } catch (err) {
    const nombre = err instanceof jwt.TokenExpiredError ? 'expirado' : 'invalido';
    const mensajes: Record<string, string> = {
      expirado: 'El token ha expirado. Por favor inicia sesión nuevamente.',
      invalido:  'Token inválido.',
    };
    res.status(401).json({
      exito:   false,
      mensaje: mensajes[nombre] ?? 'Error de autenticación.',
    });
  }
};

/**
 * Middleware de autorización por roles.
 * Debe usarse **después** de `verificarToken`.
 * @param rolesPermitidos - Roles que tienen acceso al recurso
 */
export const autorizar = (...rolesPermitidos: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ exito: false, mensaje: 'No autenticado.' });
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      res.status(403).json({
        exito:   false,
        mensaje: `Acceso denegado: se requiere rol [${rolesPermitidos.join(', ')}].`,
      });
      return;
    }

    next();
  };
};
