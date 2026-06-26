-- ============================================================
-- Migración 001: Esquema inicial de la plataforma SaaS
-- Plataforma Contable Colombia — DesarrolloAPP
-- ============================================================

-- Extensiones útiles de PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLA: usuarios
-- Almacena todos los usuarios del sistema con su rol
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id                  SERIAL PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL,
  apellido            VARCHAR(100) NOT NULL,
  correo              VARCHAR(255) NOT NULL UNIQUE,
  contrasena_hash     VARCHAR(255) NOT NULL,
  rol                 VARCHAR(20)  NOT NULL DEFAULT 'contador'
                        CHECK (rol IN ('administrador', 'contador', 'auxiliar', 'cliente')),
  activo              BOOLEAN      NOT NULL DEFAULT true,
  mfa_habilitado      BOOLEAN      NOT NULL DEFAULT false,
  mfa_secreto         VARCHAR(255),
  empresa_activa_id   INTEGER,                    -- FK se añade después
  ultimo_acceso       TIMESTAMPTZ,
  creado_en           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  usuarios IS 'Usuarios del sistema con control de acceso basado en roles';
COMMENT ON COLUMN usuarios.rol IS 'administrador | contador | auxiliar | cliente';

-- ============================================================
-- TABLA: empresas
-- Cada empresa es un tenant aislado (multiempresa)
-- ============================================================
CREATE TABLE IF NOT EXISTS empresas (
  id              SERIAL PRIMARY KEY,
  nombre          VARCHAR(255) NOT NULL,
  nit             VARCHAR(20)  NOT NULL UNIQUE,
  digito_verif    CHAR(1),
  razon_social    VARCHAR(255),
  regimen         VARCHAR(50)  CHECK (regimen IN (
                    'RESPONSABLE_IVA',
                    'NO_RESPONSABLE_IVA',
                    'GRAN_CONTRIBUYENTE',
                    'AUTORRETENEDOR',
                    'REGIMEN_SIMPLE'
                  )),
  actividad_ciiu  VARCHAR(10),
  direccion       VARCHAR(255),
  municipio       VARCHAR(100),
  departamento    VARCHAR(100),
  correo_principal VARCHAR(255),
  telefono        VARCHAR(50),
  activa          BOOLEAN NOT NULL DEFAULT true,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  empresas IS 'Empresas/clientes gestionados en la plataforma (multitenancy)';
COMMENT ON COLUMN empresas.nit IS 'NIT sin dígito de verificación';

-- ============================================================
-- TABLA: empresas_usuarios (relación N:N)
-- Un usuario puede gestionar múltiples empresas
-- ============================================================
CREATE TABLE IF NOT EXISTS empresas_usuarios (
  id          SERIAL PRIMARY KEY,
  empresa_id  INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_empresa VARCHAR(20) NOT NULL DEFAULT 'contador'
                CHECK (rol_empresa IN ('administrador', 'contador', 'auxiliar', 'cliente')),
  activo      BOOLEAN NOT NULL DEFAULT true,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(empresa_id, usuario_id)
);

COMMENT ON TABLE empresas_usuarios IS 'Relación usuarios-empresas con rol específico por empresa';

-- FK diferida: empresa_activa del usuario
ALTER TABLE usuarios
  ADD CONSTRAINT fk_empresa_activa
  FOREIGN KEY (empresa_activa_id)
  REFERENCES empresas(id)
  ON DELETE SET NULL;

-- ============================================================
-- TABLA: sesiones
-- Control de sesiones activas y tokens de refresco
-- ============================================================
CREATE TABLE IF NOT EXISTS sesiones (
  id              SERIAL PRIMARY KEY,
  usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_refresco  TEXT    NOT NULL,
  ip_origen       VARCHAR(50),
  dispositivo     VARCHAR(255),
  activa          BOOLEAN     NOT NULL DEFAULT true,
  expira_en       TIMESTAMPTZ NOT NULL,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: auditoria_eventos
-- Registro inmutable de todas las acciones del sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS auditoria_eventos (
  id                SERIAL PRIMARY KEY,
  usuario_id        INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  empresa_id        INTEGER REFERENCES empresas(id) ON DELETE SET NULL,
  accion            VARCHAR(20) NOT NULL,  -- GET, POST, PUT, DELETE, LOGIN, etc.
  modulo            VARCHAR(100) NOT NULL,
  descripcion       TEXT,
  ip_origen         VARCHAR(50),
  datos_anteriores  JSONB,
  datos_nuevos      JSONB,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE auditoria_eventos IS 'Log de auditoría inmutable — no se hacen UPDATE ni DELETE aquí';

-- ============================================================
-- TABLA: obligaciones_tributarias
-- Base del calendario tributario automatizado
-- ============================================================
CREATE TABLE IF NOT EXISTS obligaciones_tributarias (
  id              SERIAL PRIMARY KEY,
  empresa_id      INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
  nombre          VARCHAR(255) NOT NULL,
  tipo            VARCHAR(50)  NOT NULL CHECK (tipo IN (
                    'IVA', 'RETENCION', 'RENTA', 'ICA', 'CREE',
                    'NOMINA', 'INDUSTRIA_COMERCIO', 'OTRO'
                  )),
  periodicidad    VARCHAR(20) CHECK (periodicidad IN (
                    'MENSUAL', 'BIMESTRAL', 'CUATRIMESTRAL',
                    'ANUAL', 'UNICA'
                  )),
  fecha_limite    DATE NOT NULL,
  estado          VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                    CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'CUMPLIDA', 'VENCIDA')),
  formulario_dian VARCHAR(20),
  notas           TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES para optimización de consultas frecuentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_correo         ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_empresas_nit            ON empresas(nit);
CREATE INDEX IF NOT EXISTS idx_empresas_usuarios_emp   ON empresas_usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_empresas_usuarios_usr   ON empresas_usuarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario       ON auditoria_eventos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_empresa       ON auditoria_eventos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_creado        ON auditoria_eventos(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_obligaciones_empresa    ON obligaciones_tributarias(empresa_id);
CREATE INDEX IF NOT EXISTS idx_obligaciones_fecha      ON obligaciones_tributarias(fecha_limite);

-- ============================================================
-- FUNCIÓN: actualiza 'actualizado_en' automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION fn_actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de actualización automática
CREATE OR REPLACE TRIGGER trg_usuarios_actualizado
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE OR REPLACE TRIGGER trg_empresas_actualizado
  BEFORE UPDATE ON empresas
  FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE OR REPLACE TRIGGER trg_obligaciones_actualizado
  BEFORE UPDATE ON obligaciones_tributarias
  FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

-- ============================================================
-- DATOS INICIALES: Usuario administrador por defecto
-- Contraseña: Admin2024! (cambiar inmediatamente en producción)
-- Hash bcrypt costo 12
-- ============================================================
INSERT INTO usuarios (nombre, apellido, correo, contrasena_hash, rol)
VALUES (
  'Administrador',
  'Sistema',
  'admin@contaflow.co',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgJGmZ9.b7PQ5YQ8gGvF.i',
  'administrador'
) ON CONFLICT (correo) DO NOTHING;
