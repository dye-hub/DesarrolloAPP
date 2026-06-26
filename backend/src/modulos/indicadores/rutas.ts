import { Router } from 'express';
import { obtenerIndicadores } from './controlador';
import { verificarToken } from '../../middleware/autenticacion';

const enrutador = Router();

// GET /api/indicadores - Protegido por JWT (requiere estar autenticado)
enrutador.get('/', verificarToken, obtenerIndicadores);

export default enrutador;
