/**
 * Tipos del módulo de autenticación — DesarrolloAPP
 */

export type RolUsuario = 'administrador' | 'contador' | 'auxiliar' | 'cliente';
export const ROLES_VALIDOS: RolUsuario[] = ['administrador', 'contador', 'auxiliar', 'cliente'];

// ── DTOs de entrada ───────────────────────────────────────────────────────
export interface DatosRegistro {
  nombre:     string;
  apellido:   string;
  correo:     string;
  contrasena: string;
  rol?:       RolUsuario;
}

export interface DatosLogin {
  correo:     string;
  contrasena: string;
}

// ── DTOs de salida ────────────────────────────────────────────────────────
export interface UsuarioPublico {
  id:         number;
  nombre:     string;
  apellido:   string;
  correo:     string;
  rol:        RolUsuario;
  creadoEn?:  Date;
}

export interface RespuestaLogin {
  usuario:       UsuarioPublico;
  tokenAcceso:   string;
  tokenRefresco: string;
}

export interface RespuestaRefresco {
  tokenAcceso: string;
}

// ── Filas de BD ───────────────────────────────────────────────────────────
export interface FilaUsuario {
  id:                 number;
  nombre:             string;
  apellido:           string;
  correo:             string;
  contrasena_hash:    string;
  rol:                RolUsuario;
  activo:             boolean;
  empresa_activa_id:  number | null;
  ultimo_acceso:      Date | null;
  creado_en:          Date;
}

export interface FilaEmpresa {
  id:     number;
  nombre: string;
  nit:    string;
}
