/**
 * Servidor principal de la API — TypeScript
 * DesarrolloAPP — Plataforma SaaS Contable Colombia
 */
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import { probarConexion } from './src/config/bd';
import rutasAuth from './src/modulos/autenticacion/rutas';
import { middlewareAuditoria } from './src/middleware/auditoria';

const app = express();
const PORT = parseInt(process.env.PORT ?? '5000', 10);

// ── Seguridad ───────────────────────────────────────────────────────────────
app.use(helmet());

// Límite de solicitudes por IP para prevenir abuso
const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { exito: false, mensaje: 'Demasiadas solicitudes. Intenta en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Límite más estricto para autenticación (anti-brute-force)
const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { exito: false, mensaje: 'Demasiados intentos de autenticación. Espera 15 minutos.' },
});

app.use('/api/', limitadorGeneral);
app.use('/api/auth/login', limitadorAuth);

// ── CORS ────────────────────────────────────────────────────────────────────
const origenesPermitidos = process.env.CORS_ORIGENES
  ? process.env.CORS_ORIGENES.split(',')
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: origenesPermitidos,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// ── Parseo y logs ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Middleware de auditoría ─────────────────────────────────────────────────
app.use(middlewareAuditoria);

// ── Rutas ───────────────────────────────────────────────────────────────────
app.get('/api/salud', (req: Request, res: Response) => {
  res.json({
    exito: true,
    mensaje: 'API de DesarrolloAPP funcionando correctamente',
    version: '1.0.0',
    hora: new Date().toISOString(),
  });
});

app.use('/api/auth', rutasAuth);

// ── Ruta no encontrada ──────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    exito: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
});

// ── Manejador global de errores ─────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    exito: false,
    mensaje: 'Error interno del servidor.',
    ...(process.env.NODE_ENV === 'development' && { detalle: err.message }),
  });
});

// ── Inicio del servidor ─────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV ?? 'development'}`);
  await probarConexion();
});
