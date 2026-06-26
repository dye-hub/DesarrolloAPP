import { useState, useEffect } from 'react';
import { useAuth } from '../../contextos/AuthContexto';
import type { IndicadorEconomico } from '../../tipos';
import { TrendingUp, TrendingDown, Minus, Info, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function PaginaIndicadores() {
  const { token } = useAuth();
  const [indicadores, setIndicadores] = useState<IndicadorEconomico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarIndicadores = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const respuesta = await fetch(`${API_URL}/api/indicadores`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const json = await respuesta.json();
      
      if (!respuesta.ok) {
        throw new Error(json.mensaje || 'Error al obtener indicadores');
      }
      
      setIndicadores(json.datos);
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarIndicadores();
  }, [token]);

  // Funciones de formateo
  const formatearValor = (valor: number, unidad: string) => {
    if (unidad === 'COP' || unidad === 'COP/USD') {
      return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP',
        maximumFractionDigits: unidad === 'COP/USD' ? 2 : 0
      }).format(valor);
    }
    if (unidad === '%') {
      return `${valor.toFixed(2)}%`;
    }
    return valor.toString();
  };

  const renderizarVariacion = (variacion?: number) => {
    if (variacion === undefined || variacion === 0) {
      return (
        <span className="flex items-center text-sm font-medium text-[var(--texto-terciario)]">
          <Minus size={16} className="mr-1" />
          0.00%
        </span>
      );
    }
    
    const esPositivo = variacion > 0;
    
    return (
      <span className={`flex items-center text-sm font-bold ${
        esPositivo ? 'text-[var(--color-exito)]' : 'text-[var(--color-error)]'
      }`}>
        {esPositivo ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        {Math.abs(variacion).toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="animar-aparecer max-w-7xl mx-auto space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            Indicadores Económicos
          </h1>
          <p className="text-[var(--texto-secundario)] text-sm mt-1">
            Tasas y valores oficiales actualizados para tus cálculos contables.
          </p>
        </div>
        
        <button 
          onClick={cargarIndicadores}
          disabled={cargando}
          className="flex items-center justify-center px-4 py-2 bg-[var(--fondo-tarjeta)] border border-[var(--borde)] rounded-lg text-sm font-medium hover:bg-[var(--borde-suave)] transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`mr-2 ${cargando ? 'animar-girar' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Manejo de estados (Cargando / Error) */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start">
          <AlertCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-400">Error de conexión</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Grid de Indicadores */}
      {cargando && !indicadores.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 rounded-xl bg-[var(--fondo-tarjeta)] border border-[var(--borde)] animate-pulse flex flex-col p-5">
              <div className="h-4 bg-[var(--borde)] rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-[var(--borde)] rounded w-1/2 mb-4 mt-auto"></div>
              <div className="h-3 bg-[var(--borde)] rounded w-1/4 mt-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {indicadores.map((ind) => (
            <div 
              key={ind.codigo}
              className="group flex flex-col p-6 rounded-2xl bg-[var(--fondo-tarjeta)] border border-[var(--borde)] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Decoración superior */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primario)] to-[var(--color-acento)] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-[var(--texto-secundario)] truncate pr-4" title={ind.nombre}>
                  {ind.nombre}
                </h3>
                <div className="shrink-0 p-1.5 rounded-full bg-[var(--fondo-principal)] text-[var(--texto-terciario)]" title={`Fuente: ${ind.fuente}`}>
                  <Info size={14} />
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-black tracking-tight text-[var(--texto-principal)]">
                  {formatearValor(ind.valor, ind.unidad)}
                </span>
                <span className="text-sm font-medium text-[var(--texto-secundario)] ml-2">
                  {ind.unidad === 'COP' || ind.unidad === 'COP/USD' ? '' : ind.unidad}
                </span>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--borde-suave)]">
                {renderizarVariacion(ind.variacion)}
                <span className="text-xs font-medium text-[var(--texto-terciario)]">
                  Vigencia: {new Date(ind.fecha).toLocaleDateString('es-CO')}
                </span>
              </div>
            </div>
          ))}
          
          {!cargando && indicadores.length === 0 && !error && (
            <div className="col-span-full py-12 text-center bg-[var(--fondo-tarjeta)] border border-[var(--borde)] rounded-xl border-dashed">
              <Info size={40} className="mx-auto text-[var(--texto-terciario)] mb-3" />
              <h3 className="text-lg font-medium text-[var(--texto-principal)]">Sin datos disponibles</h3>
              <p className="text-[var(--texto-secundario)] mt-1 max-w-md mx-auto">
                No se encontraron indicadores económicos. Ejecuta la migración SQL `002_indicadores.sql` en tu base de datos para cargar los valores iniciales.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Panel informativo adicional */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[var(--color-primario-suave)] to-[var(--fondo-tarjeta)] border border-[var(--borde)]">
        <h3 className="text-sm font-bold text-[var(--texto-principal)] flex items-center mb-2">
          <AlertCircle size={16} className="mr-2 text-[var(--color-primario)]" />
          Nota sobre actualización de valores
        </h3>
        <p className="text-sm text-[var(--texto-secundario)] leading-relaxed">
          Los indicadores económicos mostrados en este módulo son de carácter informativo y se actualizan periódicamente. 
          En esta versión del sistema (Fase 2), la fuente de verdad es la base de datos interna. En futuras actualizaciones, 
          este panel sincronizará automáticamente sus valores con los servicios web oficiales de la DIAN y el Banco de la República.
        </p>
      </div>

    </div>
  );
}
