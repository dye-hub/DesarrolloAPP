/**
 * Controlador de autenticación — TypeScript
 * DesarrolloAPP
 */
import type { Request, Response } from 'express';
import Joi from 'joi';
import * as servicio from './servicio';

// ── Esquemas de validación Joi ────────────────────────────────────────────
const esquemaRegistro = Joi.object({
  nombre:     Joi.string().min(2).max(100).required().messages({
    'string.min':   'El nombre debe tener al menos 2 caracteres.',
    'any.required': 'El nombre es obligatorio.',
  }),
  apellido:   Joi.string().min(2).max(100).required().messages({
    'any.required': 'El apellido es obligatorio.',
  }),
  correo: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Ingresa un correo electrónico válido.',
    'any.required': 'El correo es obligatorio.',
  }),
  contrasena: Joi.string().min(8).max(72).required().messages({
    'string.min':   'La contraseña debe tener al menos 8 caracteres.',
    'any.required': 'La contraseña es obligatoria.',
  }),
  rol: Joi.string()
    .valid('administrador', 'contador', 'auxiliar', 'cliente')
    .default('contador'),
});

const esquemaLogin = Joi.object({
  correo:     Joi.string().email({ tlds: { allow: false } }).required(),
  contrasena: Joi.string().required(),
});

// ── Handlers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/registro
 * Crea una nueva cuenta de usuario
 */
export const registro = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = esquemaRegistro.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      exito:   false,
      mensaje: 'Datos de registro inválidos.',
      errores: error.details.map((d) => d.message),
    });
    return;
  }

  try {
    const nuevoUsuario = await servicio.registrarUsuario(value as Parameters<typeof servicio.registrarUsuario>[0]);
    res.status(201).json({
      exito:   true,
      mensaje: 'Cuenta creada exitosamente.',
      datos:   nuevoUsuario,
    });
  } catch (err) {
    const mensaje     = err instanceof Error ? err.message : 'Error interno.';
    const codigoHttp  = mensaje.includes('Ya existe') ? 409 : 500;
    res.status(codigoHttp).json({ exito: false, mensaje });
  }
};

/**
 * POST /api/auth/login
 * Inicia sesión y retorna tokens JWT
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = esquemaLogin.validate(req.body);

  if (error) {
    res.status(400).json({
      exito:   false,
      mensaje: 'Correo y contraseña son requeridos.',
    });
    return;
  }

  try {
    const resultado = await servicio.iniciarSesion(value as Parameters<typeof servicio.iniciarSesion>[0]);
    res.status(200).json({
      exito:   true,
      mensaje: 'Sesión iniciada correctamente.',
      datos:   resultado,
    });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error de autenticación.';
    res.status(401).json({ exito: false, mensaje });
  }
};

/**
 * POST /api/auth/refrescar
 * Renueva el token de acceso usando el token de refresco
 */
export const refrescar = async (req: Request, res: Response): Promise<void> => {
  const { tokenRefresco } = req.body as { tokenRefresco?: string };

  if (!tokenRefresco) {
    res.status(400).json({ exito: false, mensaje: 'Token de refresco requerido.' });
    return;
  }

  try {
    const resultado = await servicio.refrescarToken(tokenRefresco);
    res.status(200).json({ exito: true, datos: resultado });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error de autenticación.';
    res.status(401).json({ exito: false, mensaje });
  }
};

/**
 * GET /api/auth/perfil
 * Devuelve el perfil del usuario autenticado con sus empresas
 */
export const perfil = async (req: Request, res: Response): Promise<void> => {
  if (!req.usuario) {
    res.status(401).json({ exito: false, mensaje: 'No autenticado.' });
    return;
  }

  try {
    const usuario = await servicio.obtenerPerfil(req.usuario.id);
    res.status(200).json({ exito: true, datos: usuario });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Usuario no encontrado.';
    res.status(404).json({ exito: false, mensaje });
  }
};
