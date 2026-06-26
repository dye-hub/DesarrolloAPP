/**
 * Servicio de autenticación — TypeScript
 * DesarrolloAPP
 */
import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import { consultar } from '../../config/bd';
import type {
  DatosRegistro, DatosLogin, UsuarioPublico, RespuestaLogin, RespuestaRefresco,
  FilaUsuario,
} from './tipos';
import { ROLES_VALIDOS } from './tipos';
import type { PayloadJwt } from '../../tipos/global';

// ── Helpers de JWT ────────────────────────────────────────────────────────

/**
 * Genera el par de tokens JWT (acceso + refresco) para un usuario
 */
const generarTokens = (
  usuario: FilaUsuario
): { tokenAcceso: string; tokenRefresco: string } => {
  const payload: Omit<PayloadJwt, 'iat' | 'exp'> = {
    id:        usuario.id,
    correo:    usuario.correo,
    nombre:    usuario.nombre,
    apellido:  usuario.apellido,
    rol:       usuario.rol,
    empresaId: usuario.empresa_activa_id,
  };

  const secreto         = process.env.JWT_SECRETO          ?? 'secreto-dev';
  const secretoRefresco = process.env.JWT_SECRETO_REFRESCO ?? secreto;
  const expiraEn        = process.env.JWT_EXPIRA_EN         ?? '8h';

  const tokenAcceso   = jwt.sign(payload, secreto,         { expiresIn: expiraEn as jwt.SignOptions['expiresIn'] });
  const tokenRefresco = jwt.sign({ id: usuario.id }, secretoRefresco, { expiresIn: '30d' });

  return { tokenAcceso, tokenRefresco };
};

// ── Operaciones del servicio ───────────────────────────────────────────────

/**
 * Crea una nueva cuenta de usuario en el sistema
 */
export const registrarUsuario = async (
  datos: DatosRegistro
): Promise<UsuarioPublico> => {
  const { nombre, apellido, correo, contrasena, rol = 'contador' } = datos;

  if (!ROLES_VALIDOS.includes(rol)) {
    throw new Error(`Rol inválido. Roles permitidos: ${ROLES_VALIDOS.join(', ')}`);
  }

  // Verificar duplicado
  const existente = await consultar<{ id: number }>(
    'SELECT id FROM usuarios WHERE correo = $1',
    [correo.toLowerCase()]
  );
  if (existente.rows.length > 0) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.');
  }

  // Hash de contraseña (costo 12 para seguridad apropiada en producción)
  const hashContrasena = await bcrypt.hash(contrasena, 12);

  const resultado = await consultar<UsuarioPublico>(
    `INSERT INTO usuarios (nombre, apellido, correo, contrasena_hash, rol)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, apellido, correo, rol, creado_en AS "creadoEn"`,
    [nombre.trim(), apellido.trim(), correo.toLowerCase(), hashContrasena, rol]
  );

  return resultado.rows[0];
};

/**
 * Autentica un usuario y devuelve los tokens JWT
 */
export const iniciarSesion = async (
  datos: DatosLogin
): Promise<RespuestaLogin> => {
  // Mensaje genérico para no revelar si el correo existe (previene enumeración)
  const errorGenerico = 'Correo o contraseña incorrectos.';

  const resultado = await consultar<FilaUsuario>(
    `SELECT id, nombre, apellido, correo, contrasena_hash, rol,
            activo, empresa_activa_id, ultimo_acceso
     FROM usuarios
     WHERE correo = $1`,
    [datos.correo.toLowerCase()]
  );

  const usuario = resultado.rows[0];
  if (!usuario) throw new Error(errorGenerico);

  if (!usuario.activo) {
    throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
  }

  const contrasenaValida = await bcrypt.compare(datos.contrasena, usuario.contrasena_hash);
  if (!contrasenaValida) throw new Error(errorGenerico);

  // Actualizar último acceso (fire-and-forget)
  consultar('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1', [usuario.id])
    .catch(() => undefined);

  const { tokenAcceso, tokenRefresco } = generarTokens(usuario);

  return {
    usuario: {
      id:       usuario.id,
      nombre:   usuario.nombre,
      apellido: usuario.apellido,
      correo:   usuario.correo,
      rol:      usuario.rol,
    },
    tokenAcceso,
    tokenRefresco,
  };
};

/**
 * Genera un nuevo token de acceso usando el token de refresco
 */
export const refrescarToken = async (
  tokenRefresco: string
): Promise<RespuestaRefresco> => {
  const secretoRefresco = process.env.JWT_SECRETO_REFRESCO ?? process.env.JWT_SECRETO ?? '';

  let decodificado: { id: number };
  try {
    decodificado = jwt.verify(tokenRefresco, secretoRefresco) as { id: number };
  } catch {
    throw new Error('Token de refresco inválido o expirado.');
  }

  const resultado = await consultar<FilaUsuario>(
    'SELECT * FROM usuarios WHERE id = $1 AND activo = true',
    [decodificado.id]
  );

  if (resultado.rows.length === 0) {
    throw new Error('Usuario no encontrado o inactivo.');
  }

  const { tokenAcceso } = generarTokens(resultado.rows[0]);
  return { tokenAcceso };
};

// ── Tipos para perfil ─────────────────────────────────────────────────────
interface FilaEmpresaJson {
  id:     number | null;
  nombre: string | null;
  nit:    string | null;
}
interface FilaPerfil extends UsuarioPublico {
  ultimo_acceso: Date | null;
  empresas:      FilaEmpresaJson[];
}

/**
 * Devuelve el perfil completo del usuario autenticado con sus empresas
 */
export const obtenerPerfil = async (
  usuarioId: number
): Promise<FilaPerfil> => {
  const resultado = await consultar<FilaPerfil>(
    `SELECT
       u.id, u.nombre, u.apellido, u.correo, u.rol,
       u.creado_en AS "creadoEn", u.ultimo_acceso,
       COALESCE(
         json_agg(
           json_build_object('id', e.id, 'nombre', e.nombre, 'nit', e.nit)
         ) FILTER (WHERE e.id IS NOT NULL),
         '[]'
       ) AS empresas
     FROM usuarios u
     LEFT JOIN empresas_usuarios eu ON u.id  = eu.usuario_id
     LEFT JOIN empresas           e  ON eu.empresa_id = e.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [usuarioId]
  );

  if (resultado.rows.length === 0) throw new Error('Usuario no encontrado.');
  return resultado.rows[0];
};
