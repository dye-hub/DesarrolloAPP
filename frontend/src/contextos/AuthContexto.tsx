/**
 * Contexto global de autenticación
 * Gestiona el estado del usuario autenticado y la empresa activa
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { EstadoAuth, Usuario, Empresa, DatosLogin, RespuestaLogin } from '../tipos';

interface ContextoAuthValor extends EstadoAuth {
  login:        (datos: DatosLogin) => Promise<void>;
  logout:       () => void;
  setEmpresa:   (empresa: Empresa) => void;
}

const ContextoAuth = createContext<ContextoAuthValor | null>(null);

const API_URL    = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const LLAVE_TOKEN   = 'desarrolloapp_token';
const LLAVE_USUARIO = 'desarrolloapp_usuario';
const LLAVE_EMPRESA = 'desarrolloapp_empresa';

export function ProveedorAuth({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoAuth>({
    usuario:     null,
    empresa:     null,
    token:       null,
    cargando:    true,
    autenticado: false,
  });

  // Restaurar sesión desde localStorage al cargar
  useEffect(() => {
    try {
      const token   = localStorage.getItem(LLAVE_TOKEN);
      const usuario = localStorage.getItem(LLAVE_USUARIO);
      const empresa = localStorage.getItem(LLAVE_EMPRESA);

      if (token && usuario) {
        setEstado({
          token,
          usuario:     JSON.parse(usuario) as Usuario,
          empresa:     empresa ? JSON.parse(empresa) as Empresa : null,
          cargando:    false,
          autenticado: true,
        });
      } else {
        setEstado(prev => ({ ...prev, cargando: false }));
      }
    } catch {
      setEstado(prev => ({ ...prev, cargando: false }));
    }
  }, []);

  const login = useCallback(async (datos: DatosLogin) => {
    const respuesta = await fetch(`${API_URL}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(datos),
    });

    const json = await respuesta.json();

    if (!respuesta.ok || !json.exito) {
      throw new Error(json.mensaje || 'Error al iniciar sesión.');
    }

    const { usuario, tokenAcceso, tokenRefresco }: RespuestaLogin = json.datos;

    localStorage.setItem(LLAVE_TOKEN,   tokenAcceso);
    localStorage.setItem('desarrolloapp_refresh', tokenRefresco);
    localStorage.setItem(LLAVE_USUARIO, JSON.stringify(usuario));

    setEstado({
      usuario,
      empresa:     null,
      token:       tokenAcceso,
      cargando:    false,
      autenticado: true,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LLAVE_TOKEN);
    localStorage.removeItem(LLAVE_USUARIO);
    localStorage.removeItem(LLAVE_EMPRESA);
    localStorage.removeItem('desarrolloapp_refresh');
    setEstado({
      usuario: null, empresa: null, token: null,
      cargando: false, autenticado: false,
    });
  }, []);

  const setEmpresa = useCallback((empresa: Empresa) => {
    localStorage.setItem(LLAVE_EMPRESA, JSON.stringify(empresa));
    setEstado(prev => ({ ...prev, empresa }));
  }, []);

  return (
    <ContextoAuth.Provider value={{ ...estado, login, logout, setEmpresa }}>
      {children}
    </ContextoAuth.Provider>
  );
}

/** Hook para acceder al contexto de autenticación */
export function useAuth(): ContextoAuthValor {
  const ctx = useContext(ContextoAuth);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <ProveedorAuth>');
  return ctx;
}
