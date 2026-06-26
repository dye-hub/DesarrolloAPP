/**
 * Definición de todos los módulos de la plataforma DesarrolloAPP
 * Usados por el Sidebar y el Dashboard de inicio
 */
import type { ModuloSidebar } from '../tipos';

export const MODULOS_PLATAFORMA: ModuloSidebar[] = [
  // ── FISCAL ──────────────────────────────────────────────────────────────
  {
    id:          'calendario',
    etiqueta:    'Calendario Tributario',
    icono:       'CalendarDays',
    ruta:        '/calendario',
    descripcion: 'Obligaciones y fechas DIAN sincronizadas automáticamente',
    disponible:  false,
    categoria:   'fiscal',
  },
  {
    id:          'retenciones-tabla',
    etiqueta:    'Tabla de Retenciones',
    icono:       'Table2',
    ruta:        '/retenciones/tabla',
    descripcion: 'Conceptos, bases mínimas y tarifas por tipo de persona',
    disponible:  false,
    categoria:   'fiscal',
  },
  {
    id:          'calculadora-retenciones',
    etiqueta:    'Calculadora de Retenciones',
    icono:       'Calculator',
    ruta:        '/retenciones/calculadora',
    descripcion: 'Calcula retefuente, reteIVA, reteICA automáticamente',
    disponible:  false,
    categoria:   'fiscal',
  },
  {
    id:          'indicadores',
    etiqueta:    'Indicadores Económicos',
    icono:       'TrendingUp',
    ruta:        '/indicadores',
    descripcion: 'UVT, TRM, DTF, IBR, IPC y más en tiempo real',
    disponible:  true,
    esNuevo:     true,
    categoria:   'fiscal',
  },
  {
    id:          'conciliacion',
    etiqueta:    'Conciliación DIAN',
    icono:       'GitCompareArrows',
    ruta:        '/conciliacion',
    descripcion: 'DIAN vs. libro mayor — diferencias en semáforo',
    disponible:  false,
    esPro:       true,
    categoria:   'fiscal',
  },

  // ── DOCUMENTOS ───────────────────────────────────────────────────────────
  {
    id:          'lector-xml-facturas',
    etiqueta:    'Lector XML Facturas',
    icono:       'FileCode2',
    ruta:        '/xml/facturas',
    descripcion: 'Parsea facturas electrónicas UBL 2.1 de la DIAN',
    disponible:  false,
    categoria:   'documentos',
  },
  {
    id:          'lector-xml-nomina',
    etiqueta:    'Lector XML Nómina',
    icono:       'Users',
    ruta:        '/xml/nomina',
    descripcion: 'Nómina electrónica — devengados, deducciones, aportes',
    disponible:  false,
    categoria:   'documentos',
  },
  {
    id:          'lector-xml-pro',
    etiqueta:    'XML Pro + Contable',
    icono:       'BookOpen',
    ruta:        '/xml/pro',
    descripcion: 'XML a comprobante PUC con debe/haber/saldo — exporta Excel',
    disponible:  false,
    esPro:       true,
    categoria:   'documentos',
  },
  {
    id:          'acuse-recibo',
    etiqueta:    'Acuse de Recibo',
    icono:       'MailCheck',
    ruta:        '/acuse-recibo',
    descripcion: 'Evento Código 030 automático hacia DIAN y proveedor',
    disponible:  false,
    categoria:   'documentos',
  },
  {
    id:          'causacion',
    etiqueta:    'Causación Automática',
    icono:       'Wand2',
    ruta:        '/causacion',
    descripcion: 'Facturas de compra → comprobante contable listo',
    disponible:  false,
    esPro:       true,
    categoria:   'documentos',
  },
  {
    id:          'archivos-planos',
    etiqueta:    'Archivos Planos',
    icono:       'FileOutput',
    ruta:        '/archivos-planos',
    descripcion: 'Genera .txt/.csv para Siigo, World Office, Helisa…',
    disponible:  false,
    categoria:   'documentos',
  },

  // ── TERCEROS ─────────────────────────────────────────────────────────────
  {
    id:          'consulta-terceros',
    etiqueta:    'Consulta Masiva DIAN',
    icono:       'Search',
    ruta:        '/terceros/consulta',
    descripcion: 'Valida NIT, razón social y régimen en lote (Excel/CSV)',
    disponible:  false,
    categoria:   'gestion',
  },
  {
    id:          'extraccion-rut',
    etiqueta:    'Extracción RUT',
    icono:       'ScanText',
    ruta:        '/terceros/rut',
    descripcion: 'RUT PDF → JSON: nombre, NIT, CIIU, dirección, régimen',
    disponible:  false,
    categoria:   'gestion',
  },

  // ── GESTIÓN ──────────────────────────────────────────────────────────────
  {
    id:          'clientes',
    etiqueta:    'Hoja de Vida Cliente',
    icono:       'BadgeCheck',
    ruta:        '/clientes',
    descripcion: 'Ficha completa, historial tributario y notas privadas',
    disponible:  false,
    categoria:   'gestion',
  },
  {
    id:          'tareas',
    etiqueta:    'Gestión de Tareas',
    icono:       'Kanban',
    ruta:        '/tareas',
    descripcion: 'Kanban por cliente — prioridad, subtareas, adjuntos',
    disponible:  false,
    categoria:   'gestion',
  },
  {
    id:          'tareas-ia',
    etiqueta:    'Buscador Tareas IA',
    icono:       'Sparkles',
    ruta:        '/tareas/ia',
    descripcion: 'Búsqueda semántica y filtros inteligentes con LLM',
    disponible:  false,
    esPro:       true,
    esNuevo:     true,
    categoria:   'gestion',
  },

  // ── AUDITORÍA ────────────────────────────────────────────────────────────
  {
    id:          'auditoria',
    etiqueta:    'Auditoría de Eventos',
    icono:       'ShieldCheck',
    ruta:        '/auditoria',
    descripcion: 'Log de acciones por usuario, fecha y módulo',
    disponible:  false,
    categoria:   'gestion',
  },
  {
    id:          'auditoria-pro',
    etiqueta:    'Auditoría Pro',
    icono:       'Shield',
    ruta:        '/auditoria/pro',
    descripcion: 'Comparación de versiones + alertas de actividad sospechosa',
    disponible:  false,
    esPro:       true,
    categoria:   'gestion',
  },

  // ── COMUNICACIÓN ─────────────────────────────────────────────────────────
  {
    id:          'reuniones',
    etiqueta:    'Reuniones Virtuales',
    icono:       'Video',
    ruta:        '/reuniones',
    descripcion: 'Agenda Meet/Zoom desde la plataforma con invitación',
    disponible:  false,
    categoria:   'comunicacion',
  },

  // ── INFORMACIÓN ──────────────────────────────────────────────────────────
  {
    id:          'normatividad',
    etiqueta:    'Normatividad',
    icono:       'BookMarked',
    ruta:        '/normatividad',
    descripcion: 'ET, Decretos DIAN, Circulares — búsqueda por palabra clave',
    disponible:  false,
    categoria:   'informacion',
  },
  {
    id:          'enlaces',
    etiqueta:    'Accesos Rápidos',
    icono:       'ExternalLink',
    ruta:        '/enlaces',
    descripcion: 'DIAN, UGPP, RUES, Supersociedades y sitios personalizados',
    disponible:  false,
    categoria:   'informacion',
  },
];

export const CATEGORIAS_MODULO: Record<string, { etiqueta: string; color: string }> = {
  fiscal:         { etiqueta: 'Fiscal & Tributario',   color: '#2563eb' },
  documentos:     { etiqueta: 'Documentos Electrónicos', color: '#7c3aed' },
  gestion:        { etiqueta: 'Gestión & Clientes',    color: '#059669' },
  comunicacion:   { etiqueta: 'Comunicación',          color: '#0891b2' },
  informacion:    { etiqueta: 'Información & Normas',  color: '#d97706' },
};
