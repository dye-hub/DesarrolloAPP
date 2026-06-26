/**
 * Contexto global de tema (modo oscuro / claro)
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Tema = 'claro' | 'oscuro';

interface ContextoTemaValor {
  tema:       Tema;
  alternarTema: () => void;
  esModoOscuro: boolean;
}

const ContextoTema = createContext<ContextoTemaValor | null>(null);
const LLAVE_TEMA = 'desarrolloapp_tema';

export function ProveedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => {
    const guardado = localStorage.getItem(LLAVE_TEMA) as Tema | null;
    if (guardado) return guardado;
    // Respetar preferencia del sistema operativo
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  });

  // Aplicar atributo al <html> para que las variables CSS reaccionen
  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem(LLAVE_TEMA, tema);
  }, [tema]);

  const alternarTema = () =>
    setTema(prev => (prev === 'claro' ? 'oscuro' : 'claro'));

  return (
    <ContextoTema.Provider value={{ tema, alternarTema, esModoOscuro: tema === 'oscuro' }}>
      {children}
    </ContextoTema.Provider>
  );
}

export function useTema(): ContextoTemaValor {
  const ctx = useContext(ContextoTema);
  if (!ctx) throw new Error('useTema debe usarse dentro de <ProveedorTema>');
  return ctx;
}
