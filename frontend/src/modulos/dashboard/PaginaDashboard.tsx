/**
 * Dashboard principal — DesarrolloAPP
 * Muestra todos los módulos en tarjetas agrupadas por categoría
 * con estadísticas rápidas e indicadores de estado
 */
import {
  CalendarDays, Table2, Calculator, TrendingUp, GitCompareArrows,
  FileCode2, Users, BookOpen, MailCheck, Wand2, FileOutput,
  Search, ScanText, BadgeCheck, LayoutKanban, Sparkles,
  ShieldCheck, Shield, Video, BookMarked, ExternalLink,
  ArrowRight, Zap, Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../../contextos/AuthContexto';
import { MODULOS_PLATAFORMA, CATEGORIAS_MODULO } from '../../utilidades/modulos';
import type { ModuloSidebar } from '../../tipos';

const ICONOS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  CalendarDays, Table2, Calculator, TrendingUp, GitCompareArrows,
  FileCode2, Users, BookOpen, MailCheck, Wand2, FileOutput,
  Search, ScanText, BadgeCheck, LayoutKanban, Sparkles,
  ShieldCheck, Shield, Video, BookMarked, ExternalLink,
};

const COLORES_CATEGORIA: Record<string, { bg: string; texto: string; borde: string }> = {
  fiscal:       { bg: '#eff6ff', texto: '#1d4ed8', borde: '#bfdbfe' },
  documentos:   { bg: '#f5f3ff', texto: '#6d28d9', borde: '#ddd6fe' },
  gestion:      { bg: '#ecfdf5', texto: '#065f46', borde: '#a7f3d0' },
  comunicacion: { bg: '#ecfeff', texto: '#164e63', borde: '#a5f3fc' },
  informacion:  { bg: '#fffbeb', texto: '#92400e', borde: '#fde68a' },
};

function TarjetaModulo({ modulo }: { modulo: ModuloSidebar }) {
  const navigate  = useNavigate();
  const Icono     = ICONOS[modulo.icono] || FileCode2;
  const colores   = COLORES_CATEGORIA[modulo.categoria];

  const manejarClick = () => {
    if (modulo.disponible) navigate(modulo.ruta);
  };

  return (
    <div
      onClick={manejarClick}
      className={`
        group relative rounded-2xl p-5 transition-all duration-200
        ${modulo.disponible
          ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
          : 'cursor-not-allowed opacity-60'}
      `}
      style={{
        backgroundColor: 'var(--fondo-tarjeta)',
        border:          '1px solid var(--borde)',
        boxShadow:       'var(--sombra-sm)',
      }}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        {modulo.esNuevo && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
          >
            NUEVO
          </span>
        )}
        {modulo.esPro && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#ede9fe', color: '#5b21b6' }}
          >
            PRO
          </span>
        )}
        {!modulo.disponible && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ backgroundColor: 'var(--borde)', color: 'var(--texto-terciario)' }}
          >
            <Lock size={8} />
            Pronto
          </span>
        )}
      </div>

      {/* Ícono */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-110"
        style={{
          backgroundColor: colores.bg,
          border:          `1px solid ${colores.borde}`,
        }}
      >
        <Icono size={20} style={{ color: colores.texto }} />
      </div>

      {/* Título y descripción */}
      <h3
        className="text-sm font-semibold mb-1.5 pr-16"
        style={{ color: 'var(--texto-principal)' }}
      >
        {modulo.etiqueta}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>
        {modulo.descripcion}
      </p>

      {/* Flecha hover */}
      {modulo.disponible && (
        <div
          className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ color: colores.texto }}
        >
          Abrir módulo
          <ArrowRight size={12} />
        </div>
      )}
    </div>
  );
}

export function PaginaDashboard() {
  const { usuario } = useAuth();
  const categorias  = Object.keys(CATEGORIAS_MODULO);

  const totalModulos       = MODULOS_PLATAFORMA.length;
  const modulosDisponibles = MODULOS_PLATAFORMA.filter(m => m.disponible).length;

  const ahora     = new Date();
  const horaStr   = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const fechaStr  = ahora.toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Encabezado de bienvenida */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--texto-principal)' }}
          >
            Buenos días, {usuario?.nombre ?? 'Contador'} 👋
          </h1>
          <p className="text-sm capitalize" style={{ color: 'var(--texto-secundario)' }}>
            {fechaStr} · {horaStr}
          </p>
        </div>

        {/* Stats rápidas */}
        <div className="hidden md:flex items-center gap-4">
          <div
            className="text-center px-5 py-3 rounded-xl"
            style={{
              backgroundColor: 'var(--fondo-tarjeta)',
              border:          '1px solid var(--borde)',
            }}
          >
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primario)' }}>
              {totalModulos}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
              Módulos totales
            </p>
          </div>
          <div
            className="text-center px-5 py-3 rounded-xl"
            style={{
              backgroundColor: 'var(--fondo-tarjeta)',
              border:          '1px solid var(--borde)',
            }}
          >
            <p className="text-2xl font-bold" style={{ color: 'var(--color-acento)' }}>
              {modulosDisponibles}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
              Disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Banner de estado de plataforma */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Zap size={20} className="text-yellow-300" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">
            🚀 Plataforma en construcción activa
          </p>
          <p className="text-blue-200 text-xs mt-0.5">
            Los módulos se irán habilitando progresivamente. Cada semana nuevas funcionalidades.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: '120px',
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <div
                className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${(modulosDisponibles / totalModulos) * 100}%` }}
              />
            </div>
            <span className="text-white text-xs font-medium">
              {Math.round((modulosDisponibles / totalModulos) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Módulos por categoría */}
      {categorias.map((cat) => {
        const modulosCat = MODULOS_PLATAFORMA.filter(m => m.categoria === cat);
        if (modulosCat.length === 0) return null;
        const infoCat = CATEGORIAS_MODULO[cat];

        return (
          <section key={cat}>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: infoCat.color }}
              />
              <h2
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'var(--texto-secundario)' }}
              >
                {infoCat.etiqueta}
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: 'var(--borde)',
                  color:           'var(--texto-terciario)',
                }}
              >
                {modulosCat.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {modulosCat.map(m => (
                <TarjetaModulo key={m.id} modulo={m} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
