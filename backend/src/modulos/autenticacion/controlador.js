/**
 * Controlador de autenticación
 * Maneja las solicitudes HTTP y delega la lógica al servicio
 */
const Joi = require('joi');
const servicio = require('./servicio');

// Esquemas de validación con Joi
const esquemaRegistro = Joi.object({
  nombre:     Joi.string().min(2).max(100).required().messages({
    'string.min':  'El nombre debe tener al menos 2 caracteres.',
    'any.required': 'El nombre es obligatorio.',
  }),
  apellido:   Joi.string().min(2).max(100).required(),
  correo:     Joi.string().email().required().messages({
    'string.email': 'Ingresa un correo electrónico válido.',
  }),
  contrasena: Joi.string().min(8).max(72).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
  }),
  rol:        Joi.string().valid('administrador', 'contador', 'auxiliar', 'cliente').default('contador'),
});

const esquemaLogin = Joi.object({
  correo:     Joi.string().email().required(),
  contrasena: Joi.string().required(),
});

/**
 * POST /api/auth/registro
 * Crea una nueva cuenta de usuario
 */
const registro = async (req, res) => {
  const { error, value } = esquemaRegistro.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Datos de registro inválidos.',
      errores: error.details.map((d) => d.message),
    });
  }

  try {
    const nuevoUsuario = await servicio.registrarUsuario(value);
    return res.status(201).json({
      exito: true,
      mensaje: 'Cuenta creada exitosamente.',
      datos: nuevoUsuario,
    });
  } catch (err) {
    const codigoHttp = err.message.includes('Ya existe') ? 409 : 500;
    return res.status(codigoHttp).json({ exito: false, mensaje: err.message });
  }
};

/**
 * POST /api/auth/login
 * Inicia sesión y devuelve tokens JWT
 */
const login = async (req, res) => {
  const { error, value } = esquemaLogin.validate(req.body);
  if (error) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Correo o contraseña requeridos.',
    });
  }

  try {
    const resultado = await servicio.iniciarSesion(value.correo, value.contrasena);
    return res.status(200).json({
      exito: true,
      mensaje: 'Sesión iniciada correctamente.',
      datos: resultado,
    });
  } catch (err) {
    return res.status(401).json({ exito: false, mensaje: err.message });
  }
};

/**
 * POST /api/auth/refrescar
 * Obtiene un nuevo token de acceso usando el token de refresco
 */
const refrescar = async (req, res) => {
  const { tokenRefresco } = req.body;
  if (!tokenRefresco) {
    return res.status(400).json({ exito: false, mensaje: 'Token de refresco requerido.' });
  }

  try {
    const resultado = await servicio.refrescarToken(tokenRefresco);
    return res.status(200).json({ exito: true, datos: resultado });
  } catch (err) {
    return res.status(401).json({ exito: false, mensaje: err.message });
  }
};

/**
 * GET /api/auth/perfil
 * Devuelve el perfil del usuario autenticado
 */
const perfil = async (req, res) => {
  try {
    const usuario = await servicio.obtenerPerfil(req.usuario.id);
    return res.status(200).json({ exito: true, datos: usuario });
  } catch (err) {
    return res.status(404).json({ exito: false, mensaje: err.message });
  }
};

module.exports = { registro, login, refrescar, perfil };
