/**
 * Barra de navegación superior de la plataforma DesarrolloAPP
 */
import { Bell, Sun, Moon, Search, ChevronDown, Building2 } from 'lucide-react';
import { useAuth }  from '../../contextos/AuthContexto';
import { useTema }  from '../../contextos/TemaContexto';

export function Navbar() {
  const { usuario, empresa } = useAuth();
  const { esModoOscuro, alternarTema } = useTema();

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b shrink-0 sticky top-0 z-20"
      style={{
        backgroundColor: 'var(--fondo-navbar)',
        borderColor:     'var(--borde)',
        boxShadow:       'var(--sombra-sm)',
      }}
    >
      {/* Buscador rápido */}
      <div className="flex items-center gap-2 flex-1 max-w-sm">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg w-full"
          style={{
            backgroundColor: 'var(--fondo-principal)',
            border:          '1px solid var(--borde)',
            color:           'var(--texto-secundario)',
          }}
        >
          <Search size={15} className="shrink-0" />
          <input
            type="text"
            placeholder="Buscar módulo..."
            className="bg-transparent text-sm w-full outline-none"
            style={{ color: 'var(--texto-principal)' }}
          />
          <kbd
            className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0"
            style={{
              backgroundColor: 'var(--borde)',
              color:           'var(--texto-terciario)',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Acciones derechas */}
      <div className="flex items-center gap-2 ml-4">
        {/* Selector de empresa */}
        {empresa && (
          <button
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150"
            style={{
              backgroundColor: 'var(--fondo-principal)',
              border:          '1px solid var(--borde)',
              color:           'var(--texto-principal)',
            }}
          >
            <Building2 size={14} style={{ color: 'var(--color-primario)' }} />
            <span className="max-w-[140px] truncate font-medium">{empresa.nombre}</span>
            <ChevronDown size={12} style={{ color: 'var(--texto-terciario)' }} />
          </button>
        )}

        {/* Toggle tema */}
        <button
          onClick={alternarTema}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{
            backgroundColor: 'var(--fondo-principal)',
            border:          '1px solid var(--borde)',
            color:           'var(--texto-secundario)',
          }}
          title={esModoOscuro ? 'Modo claro' : 'Modo oscuro'}
          aria-label="Cambiar tema"
        >
          {esModoOscuro
            ? <Sun  size={16} />
            : <Moon size={16} />
          }
        </button>

        {/* Notificaciones */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-all duration-150"
          style={{
            backgroundColor: 'var(--fondo-principal)',
            border:          '1px solid var(--borde)',
            color:           'var(--texto-secundario)',
          }}
          title="Notificaciones"
        >
          <Bell size={16} />
          {/* Badge de notificaciones */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-error)' }}
          />
        </button>

        {/* Avatar usuario */}
        {usuario && (
          <button
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-all duration-150"
            style={{
              backgroundColor: 'var(--fondo-principal)',
              border:          '1px solid var(--borde)',
            }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {usuario.nombre[0]}{usuario.apellido[0]}
            </div>
            <div className="hidden sm:block text-left">
              <p
                className="text-xs font-semibold leading-none"
                style={{ color: 'var(--texto-principal)' }}
              >
                {usuario.nombre}
              </p>
              <p
                className="text-[10px] capitalize mt-0.5"
                style={{ color: 'var(--texto-terciario)' }}
              >
                {usuario.rol}
              </p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
