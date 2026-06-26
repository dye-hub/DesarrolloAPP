/**
 * Rutas del módulo de autenticación — TypeScript
 * Base: /api/auth
 * DesarrolloAPP
 */
import { Router } from 'express';
import * as controlador       from './controlador';
import { verificarToken }     from '../../middleware/autenticacion';

const router = Router();

// POST /api/auth/registro — Crear nueva cuenta
router.post('/registro', controlador.registro);

// POST /api/auth/login — Iniciar sesión
router.post('/login', controlador.login);

// POST /api/auth/refrescar — Refrescar token de acceso
router.post('/refrescar', controlador.refrescar);

// GET /api/auth/perfil — Perfil del usuario autenticado (protegida)
router.get('/perfil', verificarToken, controlador.perfil);

export default router;
