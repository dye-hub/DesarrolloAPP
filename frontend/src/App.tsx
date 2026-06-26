/**
 * Componente raíz de DesarrolloAPP
 * Conecta todos los proveedores de contexto con el router
 */
import { ProveedorAuth } from './contextos/AuthContexto';
import { ProveedorTema } from './contextos/TemaContexto';
import { Rutas }         from './rutas';

function App() {
  return (
    <ProveedorTema>
      <ProveedorAuth>
        <Rutas />
      </ProveedorAuth>
    </ProveedorTema>
  );
}

export default App;
