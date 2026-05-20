import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  BorderStyle, AlignmentType, WidthType, ShadingType, NumberFormat,
  Header, Footer, PageNumber, Tab, TableOfContents,
} from 'docx';
import { writeFileSync } from 'fs';

const BRAND = 'UrbanFlow AI';
const VERSION = '1.0.0';
const DATE = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

// ── Helpers ──────────────────────────────────────────────────────────────────

const h1 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  thematicBreak: false,
});

const h2 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 150 },
});

const h3 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 100 },
});

const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 22, font: 'Calibri', ...opts })],
  spacing: { after: 120 },
  alignment: AlignmentType.JUSTIFIED,
});

const bullet = (text, level = 0) => new Paragraph({
  children: [new TextRun({ text, size: 22, font: 'Calibri' })],
  bullet: { level },
  spacing: { after: 80 },
});

const bold = (text) => new TextRun({ text, bold: true, size: 22, font: 'Calibri' });

const separator = () => new Paragraph({
  children: [new TextRun({ text: '', size: 4 })],
  spacing: { after: 200 },
  border: { bottom: { color: '2563EB', size: 6, style: BorderStyle.SINGLE } },
});

const infoTable = (rows) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    insideH: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    insideV: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
  },
  rows: rows.map(([label, value], i) => new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [bold(label)], spacing: { after: 60 } })],
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: i % 2 === 0 ? { fill: 'EFF6FF', type: ShadingType.CLEAR } : { fill: 'FFFFFF', type: ShadingType.CLEAR },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 22, font: 'Calibri' })], spacing: { after: 60 } })],
        width: { size: 70, type: WidthType.PERCENTAGE },
        shading: i % 2 === 0 ? { fill: 'EFF6FF', type: ShadingType.CLEAR } : { fill: 'FFFFFF', type: ShadingType.CLEAR },
      }),
    ],
  })),
});

// ── Document ─────────────────────────────────────────────────────────────────

const doc = new Document({
  creator: 'UrbanFlow AI Team',
  title: `${BRAND} — Documentación Técnica y Comercial`,
  description: 'Documentación completa de la plataforma UrbanFlow AI para Cali, Colombia',
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22 } },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1',
        run: { bold: true, size: 32, color: '1E3A8A', font: 'Calibri' },
      },
      {
        id: 'Heading2', name: 'Heading 2',
        run: { bold: true, size: 26, color: '1D4ED8', font: 'Calibri' },
      },
      {
        id: 'Heading3', name: 'Heading 3',
        run: { bold: true, size: 24, color: '2563EB', font: 'Calibri' },
      },
    ],
  },
  sections: [
    {
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: `${BRAND} — Documentación Técnica v${VERSION}`, size: 18, color: '94A3B8', font: 'Calibri' })],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun({ text: `© 2025 ${BRAND} · Cali, Colombia · Página `, size: 18, color: '94A3B8', font: 'Calibri' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '94A3B8', font: 'Calibri' }),
              new TextRun({ text: ' de ', size: 18, color: '94A3B8', font: 'Calibri' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '94A3B8', font: 'Calibri' }),
            ],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      children: [

        // ── PORTADA ──────────────────────────────────────────────────────────
        new Paragraph({
          children: [new TextRun({ text: '', size: 48 })],
          spacing: { before: 1200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'UrbanFlow AI', bold: true, size: 72, color: '1E3A8A', font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Plataforma de Inteligencia Urbana para Cali, Colombia', size: 30, color: '3B82F6', font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Documentación Técnica y Comercial · Versión ${VERSION}`, size: 22, color: '64748B', font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: DATE, size: 22, color: '94A3B8', font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 2400 },
        }),
        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 1. DESCRIPCIÓN GENERAL ───────────────────────────────────────────
        h1('1. Descripción General del Producto'),
        separator(),
        p('UrbanFlow AI es una plataforma web progresiva de inteligencia urbana diseñada específicamente para la ciudad de Cali, Colombia. Combina datos en tiempo real, inteligencia artificial y cartografía interactiva para ofrecer a los ciudadanos caleños una herramienta integral de movilidad, exploración y recomendación urbana.'),
        p('La aplicación está orientada tanto a residentes habituales como a turistas que visitan la ciudad, proporcionando información actualizada sobre tráfico, clima, eventos culturales, lugares de interés y rutas optimizadas de transporte.'),

        h2('1.1 Misión'),
        p('Democratizar el acceso a información urbana de calidad en Cali, Colombia, facilitando la movilidad, el turismo y la calidad de vida de sus ciudadanos mediante tecnología de inteligencia artificial y datos en tiempo real.'),

        h2('1.2 Visión'),
        p('Ser la plataforma de referencia para la movilidad urbana inteligente en Colombia, expandiendo el modelo a las principales ciudades del país y convirtiéndose en el estándar de smart city para Latinoamérica.'),

        h2('1.3 Propuesta de Valor'),
        bullet('Información de tráfico en tiempo real con predicción basada en IA'),
        bullet('Ruteo inteligente con cálculo realista según modo de transporte y condiciones de tráfico'),
        bullet('Recomendaciones personalizadas basadas en contexto (hora, clima, historial, presupuesto)'),
        bullet('Integración con datos reales de OpenStreetMap para cobertura completa de Cali'),
        bullet('Eventos culturales reales de la ciudad actualizados dinámicamente'),
        bullet('Sistema de alertas de emergencia y seguridad urbana'),
        bullet('Panel de análisis de datos para administradores y tomadores de decisiones'),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 2. ARQUITECTURA TÉCNICA ──────────────────────────────────────────
        h1('2. Arquitectura Técnica'),
        separator(),

        h2('2.1 Stack Tecnológico'),
        infoTable([
          ['Framework Frontend', 'React 19 + Vite 8'],
          ['Lenguaje', 'JavaScript (ES2024) + JSX'],
          ['Estilos', 'Tailwind CSS v4 + CSS custom properties'],
          ['Ruteo', 'React Router DOM v7'],
          ['Mapas', 'Leaflet.js + React-Leaflet v4'],
          ['Gráficas', 'Recharts v2'],
          ['Autenticación', 'Firebase Authentication (Google OAuth 2.0)'],
          ['Base de datos', 'Firebase Firestore (NoSQL)'],
          ['Almacenamiento', 'Firebase Storage'],
          ['Hosting', 'Firebase Hosting (CDN global)'],
          ['Animaciones', 'CSS animations + transitions'],
          ['Íconos', 'Lucide React'],
        ]),

        h2('2.2 APIs Externas Integradas'),
        infoTable([
          ['wttr.in', 'Clima en tiempo real de Cali — actualización cada 10 minutos'],
          ['Nominatim (OSM)', 'Geocodificación de direcciones dentro de Cali — sin costo'],
          ['OSRM', 'Cálculo de rutas reales en carretera con geometría GeoJSON — sin costo'],
          ['Overpass API', 'Datos de lugares reales de OpenStreetMap en Cali — sin costo'],
          ['Firebase Auth', 'Autenticación segura con Google OAuth 2.0'],
          ['Firebase Firestore', 'Persistencia de perfiles, favoritos e historial de usuario'],
        ]),

        h2('2.3 Algoritmos Implementados'),
        h3('Algoritmo Dijkstra para Tráfico'),
        p('Implementación del algoritmo de camino más corto de Dijkstra aplicado a un grafo de 11 nodos representando zonas clave de Cali. El algoritmo ajusta los pesos de las aristas según el nivel de congestión actual, calculado mediante un modelo de predicción basado en hora del día y día de la semana.'),

        h3('Motor de Recomendaciones IA'),
        p('Sistema de puntuación multi-factor que evalúa cada lugar con los siguientes pesos:'),
        bullet('Calificación del lugar: 15 puntos'),
        bullet('Popularidad (escala logarítmica): 8 puntos'),
        bullet('Coincidencia horaria (mañana/tarde/noche): 25 puntos'),
        bullet('Coincidencia con clima actual: 20 puntos'),
        bullet('Ajuste al presupuesto del usuario: 15 puntos'),
        bullet('Coincidencia con intereses del perfil: 20 puntos'),
        bullet('Historial de búsqueda del usuario: 10 puntos'),
        bullet('Tendencia de popularidad: 5 puntos'),
        bullet('Proximidad por GPS: bonificación/penalización adicional'),

        h3('Cálculo Realista de Tiempos de Viaje'),
        p('Los tiempos de viaje se calculan considerando la distancia real de la ruta (obtenida de OSRM), la velocidad promedio por modo de transporte y el factor de tráfico actual:'),
        infoTable([
          ['MIO Bus', '18 km/h promedio + 8 min espera + factor tráfico'],
          ['Taxi', '28 km/h promedio + 3 min subida + factor tráfico'],
          ['Automóvil', '28 km/h promedio + factor tráfico'],
          ['Bicicleta', '14 km/h promedio (sin factor tráfico)'],
          ['A pie', '5 km/h promedio (sin factor tráfico)'],
        ]),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 3. FUNCIONALIDADES ───────────────────────────────────────────────
        h1('3. Funcionalidades del Sistema'),
        separator(),

        h2('3.1 Autenticación y Perfiles de Usuario'),
        bullet('Inicio de sesión con Google OAuth 2.0 (compatible con COOP de Chrome)'),
        bullet('Creación automática de perfil en Firestore al primer inicio de sesión'),
        bullet('Persistencia de favoritos, historial de búsqueda y preferencias'),
        bullet('Niveles de usuario: Estándar y Premium'),
        bullet('Personalización de presupuesto e intereses'),
        bullet('Panel de perfil con estadísticas de uso'),

        h2('3.2 Mapa Interactivo'),
        bullet('Mapa base OpenStreetMap con tema oscuro personalizado'),
        bullet('Marcadores de lugares con popups informativos'),
        bullet('Círculos de calor por zona de tráfico con código de colores'),
        bullet('Marcador animado de ubicación en tiempo real del usuario'),
        bullet('Capas intercambiables: estándar, satélite, transporte'),
        bullet('Actualización de tráfico cada 60 segundos'),
        bullet('Indicador de datos en vivo (clima y GPS)'),

        h2('3.3 SmartFlow — Rutas Inteligentes'),
        bullet('Búsqueda de direcciones reales con autocompletado (Nominatim OSM)'),
        bullet('Limitación geográfica a Cali para resultados relevantes'),
        bullet('Botón "Usar mi ubicación" con geocodificación inversa'),
        bullet('4 modos de transporte: MIO Bus, Taxi, Bicicleta, A pie'),
        bullet('Cálculo de ruta real con geometría trazada en el mapa'),
        bullet('Tiempo de viaje realista según modo y tráfico actual'),
        bullet('Estimación de costo en pesos colombianos (COP)'),
        bullet('Instrucciones paso a paso en español'),
        bullet('Rutas alternativas cuando disponibles'),
        bullet('Ajuste automático del zoom del mapa para mostrar toda la ruta'),

        h2('3.4 Exploración de Lugares'),
        bullet('Base de datos de lugares curados + datos reales de OpenStreetMap'),
        bullet('Cientos de lugares reales en Cali por categoría'),
        bullet('Búsqueda semántica con expansión de sinónimos'),
        bullet('Filtros por categoría, precio y calificación'),
        bullet('Sistema de favoritos sincronizado con Firebase'),
        bullet('Tarjetas detalladas con menú, horarios, reseñas y ubicación'),
        bullet('Historial de búsqueda personalizado'),

        h2('3.5 Recomendaciones con IA'),
        bullet('Motor de puntuación multi-factor con 9 variables contextuales'),
        bullet('Adaptación en tiempo real según hora, clima y ubicación del usuario'),
        bullet('Explicación de por qué se recomienda cada lugar'),
        bullet('Paginación inteligente con "cargar más" (12 lugares por página)'),
        bullet('Generador de plan de día personalizado con diversificación de categorías'),
        bullet('Tips específicos para cada lugar según su categoría'),
        bullet('Filtros por presupuesto, duración disponible e intereses'),

        h2('3.6 Eventos en Cali'),
        bullet('8 eventos reales y recurrentes de Cali curados editorialmente'),
        bullet('Cálculo dinámico de próxima ocurrencia según el día actual'),
        bullet('Filtros por categoría: Música, Gastronomía, Deportes, Cultura, Turismo'),
        bullet('Barra de búsqueda en tiempo real'),
        bullet('Mapa lateral con todos los venues marcados'),
        bullet('Indicador de impacto en tráfico por evento'),
        bullet('Integración directa con SmartFlow ("Cómo llegar")'),

        h2('3.7 Dashboard de Analítica'),
        bullet('KPIs en tiempo real: zonas activas, eventos activos, alertas'),
        bullet('Gráfica de tráfico por hora (predicción IA)'),
        bullet('Actividad semanal por categoría de lugar'),
        bullet('Distribución de categorías (gráfica circular)'),
        bullet('Ranking de zonas más populares'),
        bullet('Estado del sistema en tiempo real'),

        h2('3.8 Sistema de Alertas y Emergencias'),
        bullet('Alertas de tráfico cuando la congestión supera el 75%'),
        bullet('Alertas climáticas con redirección a lugares cubiertos'),
        bullet('Panel de emergencia con contactos de seguridad de Cali'),
        bullet('Números de emergencia: Policía (112), Bomberos (119), Cruz Roja (132)'),
        bullet('Modo de emergencia con mapa de hospitales y CAIs cercanos'),

        h2('3.9 Panel de Administración'),
        bullet('Métricas globales del sistema'),
        bullet('Gestión de contenido (lugares, eventos, alertas)'),
        bullet('Estadísticas de usuarios activos'),
        bullet('Control de acceso restringido a administradores'),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 4. MODELO DE NEGOCIO ─────────────────────────────────────────────
        h1('4. Modelo de Negocio'),
        separator(),

        h2('4.1 Segmentos de Clientes'),
        h3('B2C — Usuarios Finales'),
        bullet('Residentes de Cali que buscan optimizar su movilidad diaria'),
        bullet('Turistas nacionales e internacionales que visitan la ciudad'),
        bullet('Estudiantes universitarios (mercado objetivo: ~100.000 universitarios en Cali)'),
        bullet('Profesionales que se movilizan frecuentemente por la ciudad'),

        h3('B2B — Empresas e Instituciones'),
        bullet('Empresas de transporte que quieren integrar datos de movilidad'),
        bullet('Hoteles y operadores turísticos que desean ofrecer valor añadido'),
        bullet('Restaurantes y negocios locales que quieren visibilidad en la plataforma'),
        bullet('Alcaldía de Cali y entidades gubernamentales para datos de movilidad'),

        h2('4.2 Fuentes de Ingresos'),
        infoTable([
          ['Suscripción Premium (B2C)', '$15.000 COP/mes por usuario — funciones avanzadas, sin anuncios, plan IA ilimitado'],
          ['Publicidad nativa (B2B)', 'Lugares destacados en recomendaciones y mapa — desde $500.000 COP/mes'],
          ['API de datos (B2B)', 'Acceso a datos agregados de movilidad — desde $2.000.000 COP/mes'],
          ['White-label', 'Versión personalizada para empresas o municipios — precio negociado'],
          ['Comisiones', 'Porcentaje sobre reservas de restaurantes o tours integrados — 5-10%'],
        ]),

        h2('4.3 Proyección de Crecimiento'),
        p('Con una base inicial de 1.000 usuarios activos mensuales en el primer trimestre y un crecimiento orgánico del 20% mensual basado en estrategias de contenido y alianzas con la comunidad caleña:'),
        infoTable([
          ['Mes 1-3', '1.000 usuarios activos · Enfoque en validación del producto'],
          ['Mes 4-6', '5.000 usuarios activos · Inicio de monetización freemium'],
          ['Mes 7-12', '20.000 usuarios activos · Ingresos estimados $30M COP/mes'],
          ['Año 2', '100.000 usuarios activos · Expansión a otras ciudades colombianas'],
          ['Año 3', 'Presencia en 5 ciudades · Ingresos estimados $500M COP/mes'],
        ]),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 5. SEGURIDAD ─────────────────────────────────────────────────────
        h1('5. Seguridad y Privacidad'),
        separator(),

        h2('5.1 Autenticación'),
        bullet('Google OAuth 2.0 — sin almacenamiento de contraseñas en el sistema'),
        bullet('Tokens JWT de Firebase con expiración automática'),
        bullet('Configuración COOP (Cross-Origin-Opener-Policy) para protección contra ataques de ventana'),
        bullet('Reglas de seguridad de Firestore — cada usuario solo accede a su propia data'),

        h2('5.2 Protección de Datos'),
        bullet('Datos de usuario almacenados exclusivamente en Firebase (infraestructura de Google)'),
        bullet('Sin almacenamiento de información financiera sensible'),
        bullet('Historial de búsqueda limitado a 10 entradas más recientes'),
        bullet('Cumplimiento con la Ley 1581 de 2012 (Protección de Datos Personales, Colombia)'),

        h2('5.3 Infraestructura'),
        bullet('Firebase Hosting con CDN global y HTTPS forzado'),
        bullet('Headers de seguridad configurados: COOP, CSP'),
        bullet('Sin servidor propio que administrar — arquitectura serverless'),
        bullet('Disponibilidad garantizada por SLA de Google (99.9%)'),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 6. GUÍA DE INSTALACIÓN ───────────────────────────────────────────
        h1('6. Guía de Instalación y Desarrollo'),
        separator(),

        h2('6.1 Requisitos Previos'),
        bullet('Node.js v18 o superior'),
        bullet('npm v9 o superior'),
        bullet('Cuenta de Firebase con proyecto creado'),
        bullet('Git'),

        h2('6.2 Instalación'),
        p('1. Clonar el repositorio:'),
        new Paragraph({
          children: [new TextRun({ text: 'git clone https://github.com/juanortizpa/urbanflow-ai.git', font: 'Courier New', size: 20, color: '1E40AF' })],
          shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
          spacing: { after: 100 },
        }),
        p('2. Instalar dependencias:'),
        new Paragraph({
          children: [new TextRun({ text: 'npm install', font: 'Courier New', size: 20, color: '1E40AF' })],
          shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
          spacing: { after: 100 },
        }),
        p('3. Configurar Firebase en src/firebase/config.js con las credenciales del proyecto.'),
        p('4. Ejecutar en desarrollo:'),
        new Paragraph({
          children: [new TextRun({ text: 'npm run dev', font: 'Courier New', size: 20, color: '1E40AF' })],
          shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
          spacing: { after: 100 },
        }),

        h2('6.3 Despliegue a Producción'),
        new Paragraph({
          children: [new TextRun({ text: 'npm run build && npx firebase-tools deploy --only hosting', font: 'Courier New', size: 20, color: '1E40AF' })],
          shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
          spacing: { after: 200 },
        }),

        h2('6.4 Variables de Entorno'),
        p('Las credenciales de Firebase se configuran directamente en src/firebase/config.js. Para producción, se recomienda utilizar variables de entorno de Vite (.env.local):'),
        infoTable([
          ['VITE_FIREBASE_API_KEY', 'API Key del proyecto Firebase'],
          ['VITE_FIREBASE_AUTH_DOMAIN', 'Dominio de autenticación Firebase'],
          ['VITE_FIREBASE_PROJECT_ID', 'ID del proyecto Firebase'],
          ['VITE_FIREBASE_STORAGE_BUCKET', 'Bucket de Firebase Storage'],
          ['VITE_FIREBASE_MESSAGING_SENDER_ID', 'ID del remitente de mensajería'],
          ['VITE_FIREBASE_APP_ID', 'ID de la aplicación Firebase'],
        ]),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 7. ESTRUCTURA DE ARCHIVOS ────────────────────────────────────────
        h1('7. Estructura del Proyecto'),
        separator(),
        new Paragraph({
          children: [new TextRun({
            text: [
              'urbanflow-ai/',
              '├── src/',
              '│   ├── components/          # Componentes reutilizables',
              '│   │   ├── InteractiveMap.jsx',
              '│   │   ├── PlaceCard.jsx',
              '│   │   ├── RecommendationCard.jsx',
              '│   │   ├── Sidebar.jsx',
              '│   │   └── Topbar.jsx',
              '│   ├── context/',
              '│   │   └── AppContext.jsx    # Estado global + Firebase + APIs',
              '│   ├── data/',
              '│   │   └── mockData.js      # Datos curados de Cali',
              '│   ├── firebase/',
              '│   │   └── config.js        # Configuración Firebase',
              '│   ├── hooks/',
              '│   │   └── useGeolocation.js',
              '│   ├── layouts/',
              '│   │   └── MainLayout.jsx',
              '│   ├── pages/',
              '│   │   ├── Admin.jsx',
              '│   │   ├── Dashboard.jsx',
              '│   │   ├── Emergency.jsx',
              '│   │   ├── Events.jsx',
              '│   │   ├── Explore.jsx',
              '│   │   ├── Favorites.jsx',
              '│   │   ├── Home.jsx',
              '│   │   ├── Login.jsx',
              '│   │   ├── MapPage.jsx',
              '│   │   ├── Profile.jsx',
              '│   │   ├── Recommendations.jsx',
              '│   │   └── SmartRoutes.jsx',
              '│   ├── routes/',
              '│   │   └── AppRoutes.jsx',
              '│   └── utils/',
              '│       ├── aiRecommendations.js  # Motor de IA',
              '│       ├── dijkstra.js           # Algoritmo de rutas',
              '│       ├── nominatim.js          # Geocodificación',
              '│       ├── osrm.js               # Routing real',
              '│       ├── overpassApi.js        # Lugares OSM',
              '│       └── searchEngine.js       # Búsqueda semántica',
              '├── firebase.json            # Config hosting',
              '├── vite.config.js',
              '└── package.json',
            ].join('\n'),
            font: 'Courier New', size: 18, color: '1E3A8A',
          })],
          shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
          spacing: { after: 200 },
        }),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 8. ROADMAP ───────────────────────────────────────────────────────
        h1('8. Roadmap de Producto'),
        separator(),

        h2('Versión 1.0 — Actual (Mayo 2025)'),
        bullet('Autenticación Google OAuth'),
        bullet('Mapa interactivo con tráfico en tiempo real'),
        bullet('SmartFlow con routing real OSRM + Nominatim'),
        bullet('Motor de recomendaciones IA multi-factor'),
        bullet('Eventos reales de Cali'),
        bullet('Dashboard de analítica'),
        bullet('Sistema de emergencias'),
        bullet('Despliegue en Firebase Hosting'),

        h2('Versión 1.1 — Q3 2025'),
        bullet('Integración con API del sistema MIO (rutas y horarios reales)'),
        bullet('Notificaciones push para alertas de tráfico'),
        bullet('Sistema de reseñas y calificaciones de usuarios'),
        bullet('Modo offline con Service Worker'),
        bullet('App móvil (React Native)'),

        h2('Versión 2.0 — Q1 2026'),
        bullet('Expansión a Bogotá, Medellín y Barranquilla'),
        bullet('Integración con plataformas de reservas (restaurantes, hoteles)'),
        bullet('IA generativa para planes de visita personalizados'),
        bullet('Dashboard para negocios (analytics de visitas)'),
        bullet('Marketplace de experiencias locales'),

        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),

        // ── 9. GLOSARIO ──────────────────────────────────────────────────────
        h1('9. Glosario Técnico'),
        separator(),
        infoTable([
          ['API', 'Application Programming Interface — interfaz de comunicación entre sistemas'],
          ['COOP', 'Cross-Origin-Opener-Policy — política de seguridad del navegador'],
          ['Firestore', 'Base de datos NoSQL en tiempo real de Google Firebase'],
          ['Geocodificación', 'Proceso de convertir una dirección en coordenadas geográficas'],
          ['GeoJSON', 'Formato estándar para representar datos geográficos en JSON'],
          ['JWT', 'JSON Web Token — estándar para transmisión segura de información'],
          ['MIO', 'Masivo Integrado de Occidente — sistema de transporte público de Cali'],
          ['Nominatim', 'Servicio de geocodificación basado en datos de OpenStreetMap'],
          ['OSRM', 'Open Source Routing Machine — motor de ruteo de código abierto'],
          ['OSM', 'OpenStreetMap — mapa colaborativo de libre acceso'],
          ['Overpass API', 'API de consulta para datos de OpenStreetMap'],
          ['PWA', 'Progressive Web App — aplicación web con capacidades de app nativa'],
          ['SLA', 'Service Level Agreement — acuerdo de nivel de servicio'],
          ['SSO', 'Single Sign-On — autenticación única para múltiples servicios'],
          ['Vite', 'Herramienta de construcción moderna para proyectos JavaScript'],
        ]),

        // ── 10. CONTACTO ──────────────────────────────────────────────────────
        new Paragraph({ children: [new TextRun('')], pageBreakBefore: true }),
        h1('10. Información de Contacto'),
        separator(),
        infoTable([
          ['Producto', 'UrbanFlow AI'],
          ['Versión', VERSION],
          ['Repositorio', 'https://github.com/juanortizpa/urbanflow-ai'],
          ['Aplicación en producción', 'https://urbanflow-ai-bfefb.web.app'],
          ['Ciudad', 'Cali, Valle del Cauca, Colombia'],
          ['Año', '2025'],
        ]),

        new Paragraph({ children: [new TextRun('')], spacing: { before: 400 } }),
        new Paragraph({
          children: [new TextRun({ text: 'Este documento es confidencial y está destinado únicamente al uso interno y comercial del proyecto UrbanFlow AI.', size: 18, color: '94A3B8', italics: true, font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

// ── Output ────────────────────────────────────────────────────────────────────
Packer.toBuffer(doc).then(buffer => {
  const outputPath = 'UrbanFlow-AI-Documentacion.docx';
  writeFileSync(outputPath, buffer);
  console.log(`✓ Documento generado: ${outputPath}`);
});
