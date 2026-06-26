/**
 * Página 404 — Ruta no encontrada
 */
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export function PaginaNoEncontrada() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--fondo-principal)' }}>
      <div className="text-center max-w-md animar-aparecer">
        <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-orange-500" />
        </div>
        <h1 className="text-6xl font-bold mb-3" style={{ color: 'var(--texto-principal)' }}>404</h1>
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--texto-principal)' }}>
          Módulo no encontrado
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--texto-secundario)' }}>
          La página que buscas no existe o aún está en desarrollo.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          <Home size={16} />
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
