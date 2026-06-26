/**
 * Layout principal de la aplicación
 * Compone Sidebar + Navbar + contenido de la ruta activa
 */
import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar }  from './Navbar';

interface LayoutPrincipalProps {
  children: ReactNode;
}

export function LayoutPrincipal({ children }: LayoutPrincipalProps) {
  const [sidebarColapsado] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--fondo-principal)' }}>
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Área de contenido principal */}
      <div
        className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300"
        style={{
          marginLeft: sidebarColapsado ? '72px' : '260px',
        }}
      >
        <Navbar />

        {/* Contenido de la ruta */}
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: 'var(--fondo-principal)' }}
        >
          <div className="max-w-7xl mx-auto animar-aparecer">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
