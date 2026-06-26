/**
 * Tipos globales del backend — DesarrolloAPP
 * Extiende Express para añadir el usuario autenticado al Request
 */
import type { JwtPayload } from 'jsonwebtoken';

// Payload del JWT de acceso
export interface PayloadJwt extends JwtPayload {
  id:        number;
  correo:    string;
  nombre:    string;
  apellido:  string;
  rol:       RolUsuario;
  empresaId: number | null;
}

export type RolUsuario = 'administrador' | 'contador' | 'auxiliar' | 'cliente';

// Extiende la interfaz Request de Express para incluir 'usuario'
declare global {
  namespace Express {
    interface Request {
      usuario?: PayloadJwt;
    }
  }
}
