/**
 * Página de inicio de sesión — DesarrolloAPP
 * Diseño premium con gradiente y formulario glassmorphism
 */
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contextos/AuthContexto';

export function PaginaLogin() {
  const [correo,     setCorreo]     = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [cargando,   setCargando]   = useState(false);
  const [error,      setError]      = useState('');

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    if (!correo || !contrasena) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setCargando(true);
    setError('');

    try {
      await login({ correo, contrasena });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — decorativo */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)',
        }}
      >
        {/* Círculos decorativos */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        />
        <div
          className="absolute bottom-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #93c5fd, transparent)',
          }}
        />

        {/* Contenido del panel */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-white font-bold text-lg border border-white/20">
              CF
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">DesarrolloAPP</p>
              <p className="text-blue-300 text-xs mt-0.5">Plataforma Contable Colombia</p>
            </div>
          </div>

          {/* Slogan central */}
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              La plataforma que los contadores colombianos necesitaban
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              21 módulos especializados en tributario, facturación electrónica
              DIAN y gestión contable — todo en un solo lugar.
            </p>

            {/* Características */}
            <div className="mt-8 space-y-3">
              {[
                'Calendario tributario DIAN automatizado',
                'Lector XML UBL 2.1 con exportación contable PUC',
                'Calculadora de retenciones en la fuente',
                'Indicadores económicos en tiempo real',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/30 border border-blue-400/50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>
                  <span className="text-blue-100 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-blue-400 text-xs">
            Cumple con Resolución 000042/2020 DIAN · Ley 1581/2012 Habeas Data
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{ backgroundColor: 'var(--fondo-principal)' }}
      >
        <div className="w-full max-w-md animar-aparecer">
          {/* Encabezado móvil */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              CF
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--texto-principal)' }}>DesarrolloAPP</p>
              <p className="text-xs" style={{ color: 'var(--texto-secundario)' }}>Plataforma Contable Colombia</p>
            </div>
          </div>

          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--texto-principal)' }}
          >
            Iniciar sesión
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--texto-secundario)' }}>
            Accede a tu plataforma contable
          </p>

          {/* Mensaje de error */}
          {error && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl mb-6 animar-aparecer"
              style={{
                backgroundColor: '#fef2f2',
                border:          '1px solid #fecaca',
              }}
            >
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-5">
            {/* Campo correo */}
            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--texto-principal)' }}
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="contador@empresa.com.co"
                disabled={cargando}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-150 outline-none"
                style={{
                  backgroundColor: 'var(--fondo-tarjeta)',
                  border:          '1px solid var(--borde)',
                  color:           'var(--texto-principal)',
                }}
              />
            </div>

            {/* Campo contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="contrasena"
                  className="block text-sm font-medium"
                  style={{ color: 'var(--texto-principal)' }}
                >
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-xs transition-colors duration-150"
                  style={{ color: 'var(--color-primario)' }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  id="contrasena"
                  type={mostrarPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  disabled={cargando}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm transition-all duration-150 outline-none"
                  style={{
                    backgroundColor: 'var(--fondo-tarjeta)',
                    border:          '1px solid var(--borde)',
                    color:           'var(--texto-principal)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: 'var(--texto-terciario)' }}
                  aria-label={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón de ingreso */}
            <button
              type="submit"
              disabled={cargando}
              id="btn-login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background:   'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow:    '0 4px 15px rgba(37, 99, 235, 0.35)',
              }}
            >
              {cargando ? (
                <>
                  <Loader2 size={16} className="animar-girar" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Ingresar a la plataforma
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div
            className="mt-6 p-4 rounded-xl text-center"
            style={{
              backgroundColor: 'var(--color-primario-suave)',
              border:          '1px solid #bfdbfe',
            }}
          >
            <p className="text-xs" style={{ color: 'var(--color-primario)' }}>
              <strong>Acceso demo:</strong> admin@contaflow.co / Admin2024!
            </p>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--texto-terciario)' }}>
            Al ingresar aceptas los Términos de Uso y la Política de Privacidad
            de acuerdo a la Ley 1581 de 2012.
          </p>
        </div>
      </div>
    </div>
  );
}
