/**
 * Configuración de rutas de la plataforma DesarrolloAPP
 * Usa React Router v6 con rutas protegidas por autenticación
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth }            from '../contextos/AuthContexto';
import { LayoutPrincipal }    from '../components/layout/LayoutPrincipal';
import { PaginaLogin }        from '../modulos/autenticacion/PaginaLogin';
import { PaginaDashboard }    from '../modulos/dashboard/PaginaDashboard';
import { PaginaIndicadores }  from '../modulos/indicadores/PaginaIndicadores';
import { PaginaNoEncontrada } from '../modulos/NoEncontrada';

/** Ruta protegida: redirige a /login si no está autenticado */
function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--fondo-principal)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            CF
          </div>
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animar-girar" />
        </div>
      </div>
    );
  }

  return autenticado ? <>{children}</> : <Navigate to="/login" replace />;
}

/** Ruta pública: redirige al dashboard si ya está autenticado */
function RutaPublica({ children }: { children: React.ReactNode }) {
  const { autenticado, cargando } = useAuth();
  if (cargando) return null;
  return autenticado ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

/** Página placeholder para módulos en desarrollo */
function ModuloProximamente({ nombre }: { nombre: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center animar-aparecer">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
          style={{ backgroundColor: 'var(--color-primario-suave)', border: '1px solid #bfdbfe' }}
        >
          🚧
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--texto-principal)' }}>
          {nombre}
        </h2>
        <p className="text-sm" style={{ color: 'var(--texto-secundario)' }}>
          Este módulo está en desarrollo activo y estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}

export function Rutas() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz → dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={
          <RutaPublica><PaginaLogin /></RutaPublica>
        } />

        {/* Rutas protegidas con layout principal */}
        <Route path="/*" element={
          <RutaProtegida>
            <LayoutPrincipal>
              <Routes>
                <Route path="dashboard"            element={<PaginaDashboard />} />
                <Route path="indicadores"          element={<PaginaIndicadores />} />
                <Route path="calendario"           element={<ModuloProximamente nombre="Calendario Tributario" />} />
                <Route path="retenciones/tabla"    element={<ModuloProximamente nombre="Tabla de Retenciones" />} />
                <Route path="retenciones/calculadora" element={<ModuloProximamente nombre="Calculadora de Retenciones" />} />
                <Route path="conciliacion"         element={<ModuloProximamente nombre="Conciliación DIAN vs Contabilidad" />} />
                <Route path="xml/facturas"         element={<ModuloProximamente nombre="Lector XML Facturas" />} />
                <Route path="xml/nomina"           element={<ModuloProximamente nombre="Lector XML Nómina" />} />
                <Route path="xml/pro"              element={<ModuloProximamente nombre="XML Pro + Contable" />} />
                <Route path="acuse-recibo"         element={<ModuloProximamente nombre="Acuse de Recibo Automático" />} />
                <Route path="causacion"            element={<ModuloProximamente nombre="Causación Automática" />} />
                <Route path="archivos-planos"      element={<ModuloProximamente nombre="Archivos Planos por Software" />} />
                <Route path="terceros/consulta"    element={<ModuloProximamente nombre="Consulta Masiva DIAN" />} />
                <Route path="terceros/rut"         element={<ModuloProximamente nombre="Extracción RUT" />} />
                <Route path="clientes"             element={<ModuloProximamente nombre="Hoja de Vida del Cliente" />} />
                <Route path="tareas"               element={<ModuloProximamente nombre="Gestión de Tareas" />} />
                <Route path="tareas/ia"            element={<ModuloProximamente nombre="Buscador de Tareas con IA" />} />
                <Route path="auditoria"            element={<ModuloProximamente nombre="Auditoría de Eventos" />} />
                <Route path="auditoria/pro"        element={<ModuloProximamente nombre="Auditoría Pro" />} />
                <Route path="reuniones"            element={<ModuloProximamente nombre="Reuniones Virtuales" />} />
                <Route path="normatividad"         element={<ModuloProximamente nombre="Normatividad DIAN" />} />
                <Route path="enlaces"              element={<ModuloProximamente nombre="Accesos Rápidos" />} />
                <Route path="configuracion"        element={<ModuloProximamente nombre="Configuración" />} />
                <Route path="*"                    element={<PaginaNoEncontrada />} />
              </Routes>
            </LayoutPrincipal>
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  );
}
