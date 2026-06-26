/**
 * Rutas de autenticación
 * Base: /api/auth
 */
const express     = require('express');
const controlador = require('./controlador');
const { verificarToken } = require('../../middleware/autenticacion');

const router = express.Router();

// POST /api/auth/registro — Crear nueva cuenta
router.post('/registro', controlador.registro);

// POST /api/auth/login — Iniciar sesión
router.post('/login', controlador.login);

// POST /api/auth/refrescar — Refrescar token de acceso
router.post('/refrescar', controlador.refrescar);

// GET /api/auth/perfil — Perfil del usuario autenticado (protegida)
router.get('/perfil', verificarToken, controlador.perfil);

module.exports = router;
