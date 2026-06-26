/**
 * Sidebar principal de la plataforma DesarrolloAPP
 * Muestra todos los módulos agrupados por categoría con animaciones
 */
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  CalendarDays, Table2, Calculator, TrendingUp, GitCompareArrows,
  FileCode2, Users, BookOpen, MailCheck, Wand2, FileOutput,
  Search, ScanText, BadgeCheck, Kanban, Sparkles,
  ShieldCheck, Shield, Video, BookMarked, ExternalLink,
  ChevronLeft, ChevronRight, LogOut, Settings, Building2,
  LayoutDashboard, Menu, X,
} from 'lucide-react';
import { useAuth }  from '../../contextos/AuthContexto';
import { MODULOS_PLATAFORMA, CATEGORIAS_MODULO } from '../../utilidades/modulos';
import type { ModuloSidebar } from '../../tipos';

// Mapa de íconos de Lucide por nombre de string
const ICONOS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  CalendarDays, Table2, Calculator, TrendingUp, GitCompareArrows,
  FileCode2, Users, BookOpen, MailCheck, Wand2, FileOutput,
  Search, ScanText, BadgeCheck, Kanban, Sparkles,
  ShieldCheck, Shield, Video, BookMarked, ExternalLink,
  LayoutDashboard,
};

interface ItemSidebarProps {
  modulo:     ModuloSidebar;
  colapsado:  boolean;
}

function ItemSidebar({ modulo, colapsado }: ItemSidebarProps) {
  const Icono = ICONOS[modulo.icono] || LayoutDashboard;
  const location = useLocation();
  const estaActivo = location.pathname === modulo.ruta;

  if (!modulo.disponible) {
    return (
      <div
        title={colapsado ? `${modulo.etiqueta} — Próximamente` : undefined}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-not-allowed opacity-45
          transition-all duration-150 group relative
        `}
      >
        <Icono size={18} className="shrink-0 text-slate-400" />
        {!colapsado && (
          <span className="text-sm text-slate-400 font-medium truncate flex-1">
            {modulo.etiqueta}
          </span>
        )}
        {!colapsado && (modulo.esPro || modulo.esNuevo) && (
          <span className={`
            text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0
            ${modulo.esPro
              ? 'bg-violet-500/20 text-violet-300'
              : 'bg-emerald-500/20 text-emerald-300'}
          `}>
            {modulo.esPro ? 'PRO' : 'NUEVO'}
          </span>
        )}
        {colapsado && (
          <span className={`
            absolute left-full ml-3 whitespace-nowrap text-xs font-medium
            bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg shadow-xl
            opacity-0 pointer-events-none group-hover:opacity-100
            transition-opacity duration-150 z-50
          `}>
            {modulo.etiqueta} — Próximamente
          </span>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={modulo.ruta}
      title={colapsado ? modulo.etiqueta : undefined}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-150 group relative
        ${isActive || estaActivo
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'}
      `}
    >
      <Icono size={18} className="shrink-0" />
      {!colapsado && (
        <span className="text-sm font-medium truncate flex-1">{modulo.etiqueta}</span>
      )}
      {!colapsado && (modulo.esPro || modulo.esNuevo) && (
        <span className={`
          text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0
          ${modulo.esPro
            ? 'bg-violet-500/20 text-violet-300'
            : 'bg-emerald-500/20 text-emerald-300'}
        `}>
          {modulo.esPro ? 'PRO' : 'NUEVO'}
        </span>
      )}
      {colapsado && (
        <span className={`
          absolute left-full ml-3 whitespace-nowrap text-xs font-medium
          bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg shadow-xl
          opacity-0 pointer-events-none group-hover:opacity-100
          transition-opacity duration-150 z-50
        `}>
          {modulo.etiqueta}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const [colapsado, setColapsado] = useState(false);
  const [abierto, setAbierto]     = useState(false); // para móvil
  const { usuario, empresa, logout } = useAuth();

  const categorias = Object.keys(CATEGORIAS_MODULO);

  return (
    <>
      {/* Botón hamburguesa en móvil */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white shadow-lg"
        aria-label="Abrir menú"
      >
        {abierto ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay en móvil */}
      {abierto && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setAbierto(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: colapsado ? '72px' : '260px' }}
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-slate-900 border-r border-slate-700/50
          transition-all duration-300 ease-in-out
          ${abierto ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo / Nombre */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg shadow-blue-600/40">
            CF
          </div>
          {!colapsado && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-base leading-none truncate">DesarrolloAPP</p>
              <p className="text-blue-400 text-xs font-medium mt-0.5">Colombia</p>
            </div>
          )}
        </div>

        {/* Empresa activa */}
        {!colapsado && empresa && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-blue-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">{empresa.nombre}</p>
                <p className="text-slate-400 text-[10px]">NIT: {empresa.nit}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard link */}
        <div className="px-3 mt-3 shrink-0">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-150 group relative
              ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'}
            `}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            {!colapsado && (
              <span className="text-sm font-medium">Inicio</span>
            )}
          </NavLink>
        </div>

        {/* Lista de módulos con scroll */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
          {categorias.map((cat) => {
            const modulosCat = MODULOS_PLATAFORMA.filter(m => m.categoria === cat);
            if (modulosCat.length === 0) return null;
            const infoCat = CATEGORIAS_MODULO[cat];

            return (
              <div key={cat}>
                {!colapsado && (
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 px-3"
                    style={{ color: infoCat.color }}
                  >
                    {infoCat.etiqueta}
                  </p>
                )}
                {colapsado && (
                  <div
                    className="h-px mx-2 mb-2 mt-1"
                    style={{ backgroundColor: `${infoCat.color}40` }}
                  />
                )}
                <div className="space-y-0.5">
                  {modulosCat.map(m => (
                    <ItemSidebar key={m.id} modulo={m} colapsado={colapsado} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer: usuario + acciones */}
        <div className="shrink-0 border-t border-slate-700/50 p-3 space-y-1">
          <NavLink
            to="/configuracion"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all duration-150"
          >
            <Settings size={16} className="shrink-0" />
            {!colapsado && <span className="text-sm">Configuración</span>}
          </NavLink>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut size={16} className="shrink-0" />
            {!colapsado && <span className="text-sm">Cerrar sesión</span>}
          </button>

          {!colapsado && usuario && (
            <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {usuario.nombre[0]}{usuario.apellido[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">
                  {usuario.nombre} {usuario.apellido}
                </p>
                <p className="text-slate-400 text-[10px] capitalize">{usuario.rol}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón colapsar (solo desktop) */}
        <button
          onClick={() => setColapsado(!colapsado)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-150 shadow-md"
          aria-label={colapsado ? 'Expandir menú' : 'Colapsar menú'}
        >
          {colapsado
            ? <ChevronRight size={12} />
            : <ChevronLeft  size={12} />
          }
        </button>
      </aside>
    </>
  );
}
