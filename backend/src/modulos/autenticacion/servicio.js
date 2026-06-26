/**
 * Servicio de autenticación
 * Lógica de negocio para login, registro y gestión de tokens
 */
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const { consultar } = require('../../config/bd');

// Roles válidos del sistema
const ROLES_VALIDOS = ['administrador', 'contador', 'auxiliar', 'cliente'];

/**
 * Genera un par de tokens JWT (acceso + refresco)
 * @param {Object} usuario - Datos del usuario para el payload
 */
const generarTokens = (usuario) => {
  const payload = {
    id:        usuario.id,
    correo:    usuario.correo,
    nombre:    usuario.nombre,
    apellido:  usuario.apellido,
    rol:       usuario.rol,
    empresaId: usuario.empresa_activa_id || null,
  };

  const tokenAcceso = jwt.sign(payload, process.env.JWT_SECRETO, {
    expiresIn: process.env.JWT_EXPIRA_EN || '8h',
  });

  const tokenRefresco = jwt.sign(
    { id: usuario.id },
    process.env.JWT_SECRETO_REFRESCO || process.env.JWT_SECRETO,
    { expiresIn: '30d' }
  );

  return { tokenAcceso, tokenRefresco };
};

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} datos - { nombre, apellido, correo, contrasena, rol }
 */
const registrarUsuario = async (datos) => {
  const { nombre, apellido, correo, contrasena, rol = 'contador' } = datos;

  if (!ROLES_VALIDOS.includes(rol)) {
    throw new Error(`Rol inválido. Roles permitidos: ${ROLES_VALIDOS.join(', ')}`);
  }

  // Verificar si el correo ya existe
  const existente = await consultar(
    'SELECT id FROM usuarios WHERE correo = $1',
    [correo.toLowerCase()]
  );
  if (existente.rows.length > 0) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.');
  }

  // Hash de la contraseña (costo 12 para seguridad apropiada)
  const hashContrasena = await bcrypt.hash(contrasena, 12);

  const resultado = await consultar(
    `INSERT INTO usuarios (nombre, apellido, correo, contrasena_hash, rol)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, apellido, correo, rol, creado_en`,
    [nombre.trim(), apellido.trim(), correo.toLowerCase(), hashContrasena, rol]
  );

  return resultado.rows[0];
};

/**
 * Autentica un usuario con correo y contraseña
 * @param {string} correo
 * @param {string} contrasena
 */
const iniciarSesion = async (correo, contrasena) => {
  // Mensaje genérico para no revelar si el correo existe
  const errorGenerico = 'Correo o contraseña incorrectos.';

  const resultado = await consultar(
    `SELECT id, nombre, apellido, correo, contrasena_hash, rol, activo, empresa_activa_id
     FROM usuarios
     WHERE correo = $1`,
    [correo.toLowerCase()]
  );

  const usuario = resultado.rows[0];
  if (!usuario) throw new Error(errorGenerico);

  if (!usuario.activo) {
    throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
  if (!contrasenaValida) throw new Error(errorGenerico);

  // Actualizar último acceso
  await consultar(
    'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1',
    [usuario.id]
  );

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
 * Refresca el token de acceso usando el token de refresco
 * @param {string} tokenRefresco
 */
const refrescarToken = async (tokenRefresco) => {
  try {
    const decodificado = jwt.verify(
      tokenRefresco,
      process.env.JWT_SECRETO_REFRESCO || process.env.JWT_SECRETO
    );

    const resultado = await consultar(
      'SELECT * FROM usuarios WHERE id = $1 AND activo = true',
      [decodificado.id]
    );

    if (resultado.rows.length === 0) {
      throw new Error('Usuario no encontrado o inactivo.');
    }

    const { tokenAcceso } = generarTokens(resultado.rows[0]);
    return { tokenAcceso };
  } catch (err) {
    throw new Error('Token de refresco inválido o expirado.');
  }
};

/**
 * Obtiene el perfil completo del usuario autenticado
 * @param {number} usuarioId
 */
const obtenerPerfil = async (usuarioId) => {
  const resultado = await consultar(
    `SELECT u.id, u.nombre, u.apellido, u.correo, u.rol, u.creado_en, u.ultimo_acceso,
            array_agg(json_build_object('id', e.id, 'nombre', e.nombre, 'nit', e.nit)) AS empresas
     FROM usuarios u
     LEFT JOIN empresas_usuarios eu ON u.id = eu.usuario_id
     LEFT JOIN empresas e ON eu.empresa_id = e.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [usuarioId]
  );

  if (resultado.rows.length === 0) {
    throw new Error('Usuario no encontrado.');
  }

  return resultado.rows[0];
};

module.exports = { registrarUsuario, iniciarSesion, refrescarToken, obtenerPerfil };
