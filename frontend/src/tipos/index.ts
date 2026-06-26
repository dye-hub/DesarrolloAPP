// Tipos globales de TypeScript para la plataforma ContaFlow CO

// ── Roles del sistema ──────────────────────────────────────────────────────
export type RolUsuario = 'administrador' | 'contador' | 'auxiliar' | 'cliente';

// ── Usuario autenticado ────────────────────────────────────────────────────
export interface Usuario {
  id:        number;
  nombre:    string;
  apellido:  string;
  correo:    string;
  rol:       RolUsuario;
  empresas?: Empresa[];
}

// ── Empresa / Tenant ───────────────────────────────────────────────────────
export interface Empresa {
  id:           number;
  nombre:       string;
  nit:          string;
  digitoVerif?: string;
  razonSocial?: string;
  regimen?:     RegimenTributario;
  actividadCiiu?: string;
  direccion?:   string;
  municipio?:   string;
  departamento?: string;
  correo?:      string;
  telefono?:    string;
}

export type RegimenTributario =
  | 'RESPONSABLE_IVA'
  | 'NO_RESPONSABLE_IVA'
  | 'GRAN_CONTRIBUYENTE'
  | 'AUTORRETENEDOR'
  | 'REGIMEN_SIMPLE';

// ── Respuesta estándar del API ─────────────────────────────────────────────
export interface RespuestaApi<T = unknown> {
  exito:   boolean;
  mensaje: string;
  datos?:  T;
  errores?: string[];
}

// ── Autenticación ──────────────────────────────────────────────────────────
export interface DatosLogin {
  correo:    string;
  contrasena: string;
}

export interface RespuestaLogin {
  usuario:       Usuario;
  tokenAcceso:   string;
  tokenRefresco: string;
}

// ── Estado de contexto de Auth ─────────────────────────────────────────────
export interface EstadoAuth {
  usuario:     Usuario | null;
  empresa:     Empresa | null;
  token:       string | null;
  cargando:    boolean;
  autenticado: boolean;
}

// ── Módulos de la plataforma ───────────────────────────────────────────────
export interface ModuloSidebar {
  id:          string;
  etiqueta:    string;
  icono:       string;  // nombre del ícono de Lucide
  ruta:        string;
  descripcion: string;
  disponible:  boolean;
  esNuevo?:    boolean;
  esPro?:      boolean;
  categoria:   CategoriaModulo;
}

export type CategoriaModulo =
  | 'fiscal'
  | 'documentos'
  | 'gestion'
  | 'herramientas'
  | 'comunicacion'
  | 'informacion';

// ── Indicador económico ────────────────────────────────────────────────────
export interface IndicadorEconomico {
  codigo:      string;
  nombre:      string;
  valor:       number;
  unidad:      string;
  fecha:       string;
  fuente:      string;
  variacion?:  number;
}

// ── Retención en la fuente ─────────────────────────────────────────────────
export interface ConceptoRetencion {
  id:           number;
  codigo:       string;
  nombre:       string;
  tipoPersona:  'NATURAL' | 'JURIDICA' | 'AMBAS';
  baseMinUvt:   number;
  tarifa:       number;
  articuloEt?:  string;
  descripcion?: string;
}

// ── Auditoría ──────────────────────────────────────────────────────────────
export interface EventoAuditoria {
  id:          number;
  usuarioId:   number;
  empresaId?:  number;
  accion:      string;
  modulo:      string;
  descripcion: string;
  ipOrigen?:   string;
  creadoEn:    string;
}
