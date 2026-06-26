-- Migración 002: Indicadores Económicos

CREATE TABLE IF NOT EXISTS indicadores_economicos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    valor NUMERIC(15, 2) NOT NULL,
    unidad VARCHAR(20) NOT NULL, -- ej: 'COP', '%', 'USD'
    fecha_vigencia DATE NOT NULL,
    fuente VARCHAR(100) NOT NULL,
    variacion NUMERIC(5, 2) DEFAULT 0.00,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Función para actualizar el timestamp de actualizado_en automáticamente
CREATE OR REPLACE FUNCTION actualizar_timestamp_indicadores()
RETURNS TRIGGER AS $$
BEGIN
   NEW.actualizado_en = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger
DROP TRIGGER IF EXISTS trg_actualizar_indicadores ON indicadores_economicos;
CREATE TRIGGER trg_actualizar_indicadores
BEFORE UPDATE ON indicadores_economicos
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp_indicadores();

-- Datos semilla (Valores de referencia aproximados / vigentes para 2024-2025)
INSERT INTO indicadores_economicos (codigo, nombre, valor, unidad, fecha_vigencia, fuente, variacion) VALUES
('uvt', 'Unidad de Valor Tributario (UVT)', 47065.00, 'COP', '2024-01-01', 'DIAN', 10.97),
('smmlv', 'Salario Mínimo Mensual (SMMLV)', 1300000.00, 'COP', '2024-01-01', 'MinTrabajo', 12.07),
('trm', 'Tasa Representativa del Mercado (TRM)', 3950.50, 'COP/USD', '2024-05-01', 'Superfinanciera', -0.50),
('aux_transporte', 'Auxilio de Transporte', 162000.00, 'COP', '2024-01-01', 'MinTrabajo', 15.22),
('ipc', 'Índice de Precios al Consumidor (IPC)', 7.16, '%', '2024-04-01', 'DANE', -0.20),
('dtf', 'Tasa DTF (90 días)', 10.25, '%', '2024-05-01', 'Banco de la República', -0.15)
ON CONFLICT (codigo) DO UPDATE 
SET valor = EXCLUDED.valor, 
    fecha_vigencia = EXCLUDED.fecha_vigencia,
    variacion = EXCLUDED.variacion;
