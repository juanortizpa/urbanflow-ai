export const CITY_CENTER = [3.4516, -76.5325]; // Cali, Colombia — Plaza de Caicedo

export const places = [
  {
    id: 1, name: 'Parque del Perro', category: 'parks', tags: ['outdoor', 'family', 'nature', 'recreation', 'free', 'El Peñón'],
    description: 'El parque más emblemático de Cali, epicentro social del barrio El Peñón, ideal para caminar y disfrutar al aire libre.',
    lat: 3.4681, lng: -76.5334, rating: 4.8, visits: 5200, trend: 'up', price: 0,
    openHours: '24/7', image: 'https://picsum.photos/seed/park-cali1/400/250',
    reviews: ['El mejor parque de Cali', 'Ambiente increíble los fines de semana', 'Perfecto para la tarde'],
    menu: [], popularAt: ['morning', 'evening', 'weekend'],
    weather: ['sunny', 'cloudy'], type: 'outdoor',
  },
  {
    id: 2, name: 'Juan Valdez Café El Peñón', category: 'cafes', tags: ['coffee', 'wifi', 'cozy', 'artisan', 'breakfast', 'work'],
    description: 'Café icónico con el mejor café colombiano, ambiente acogedor y vista al Parque del Perro.',
    lat: 3.4670, lng: -76.5345, rating: 4.7, visits: 2800, trend: 'up', price: 9,
    openHours: '7:00-22:00', image: 'https://picsum.photos/seed/cafe-cali1/400/250',
    reviews: ['El café más rico de Cali', 'WiFi excelente y cómodo', 'Atención de primera'],
    menu: ['café americano', 'cappuccino', 'latte', 'croissant', 'pandebono', 'buñuelo'],
    popularAt: ['morning', 'afternoon', 'rainy'],
    weather: ['rainy', 'cloudy'], type: 'indoor',
  },
  {
    id: 3, name: 'La Sucursal', category: 'restaurants', tags: ['colombian', 'traditional', 'lunch', 'bandeja paisa', 'sancocho'],
    description: 'Restaurante tradicional caleño con los mejores platos típicos del Valle del Cauca.',
    lat: 3.4588, lng: -76.5348, rating: 4.6, visits: 3100, trend: 'stable', price: 18,
    openHours: '11:00-22:00', image: 'https://picsum.photos/seed/rest-cali1/400/250',
    reviews: ['La mejor bandeja de Cali', 'Porciones generosas', 'Sabor auténtico vallecaucano'],
    menu: ['bandeja paisa', 'sancocho de gallina', 'chuleta valluna', 'arroz con pollo', 'lulada', 'champús'],
    popularAt: ['lunch', 'dinner', 'weekend'],
    weather: ['any'], type: 'indoor',
  },
  {
    id: 4, name: 'Tin Tin Deo', category: 'bars', tags: ['salsa', 'nightlife', 'bar', 'drinks', 'party', 'dancing'],
    description: 'La salsoteca más famosa de Cali, donde la salsa y la rumba se viven con toda la pasión caleña.',
    lat: 3.4542, lng: -76.5382, rating: 4.9, visits: 4500, trend: 'up', price: 15,
    openHours: '20:00-04:00', image: 'https://picsum.photos/seed/bar-cali1/400/250',
    reviews: ['La salsa más auténtica', 'Ambiente inigualable', 'La mejor noche de mi vida'],
    menu: ['aguardiente', 'ron', 'cuba libre', 'cerveza Club Colombia', 'sangría tropical'],
    popularAt: ['night', 'evening', 'weekend'],
    weather: ['any'], type: 'indoor',
  },
  {
    id: 5, name: 'Sushi Matsuri Cali', category: 'restaurants', tags: ['sushi', 'japanese', 'seafood', 'asian', 'healthy', 'premium'],
    description: 'Restaurante japonés auténtico en el corazón de Granada con sushi fresco y coctelería japonesa.',
    lat: 3.4665, lng: -76.5310, rating: 4.7, visits: 1800, trend: 'up', price: 28,
    openHours: '12:00-22:00', image: 'https://picsum.photos/seed/sushi-cali1/400/250',
    reviews: ['El mejor sushi de Cali', 'Ingredientes fresquísimos', 'Experiencia japonesa auténtica'],
    menu: ['salmon roll', 'tuna sashimi', 'california roll', 'miso soup', 'sake'],
    popularAt: ['lunch', 'dinner'],
    weather: ['any'], type: 'indoor',
  },
  {
    id: 6, name: 'Total Fitness Cali', category: 'sports', tags: ['gym', 'fitness', 'sports', 'health', 'workout', 'exercise'],
    description: 'Gimnasio de alta gama en el norte de Cali con equipos de última tecnología y entrenadores certificados.',
    lat: 3.4710, lng: -76.5290, rating: 4.5, visits: 1200, trend: 'stable', price: 35,
    openHours: '5:00-23:00', image: 'https://picsum.photos/seed/gym-cali1/400/250',
    reviews: ['Excelente equipamiento', 'Muy completo', 'Instalaciones de primer nivel'],
    menu: [],
    popularAt: ['morning', 'evening'],
    weather: ['any'], type: 'indoor',
  },
  {
    id: 7, name: 'Pozzetto Heladería', category: 'desserts', tags: ['ice cream', 'desserts', 'artisan', 'sweet', 'family', 'Italian'],
    description: 'Heladería italiana artesanal con más de 50 sabores únicos, especialidad en frutas tropicales del Valle.',
    lat: 3.4663, lng: -76.5338, rating: 4.8, visits: 3800, trend: 'up', price: 7,
    openHours: '10:00-22:00', image: 'https://picsum.photos/seed/ice-cali1/400/250',
    reviews: ['Los mejores helados de Colombia', 'Sabores únicos de frutas locales', 'Siempre con cola pero vale la pena'],
    menu: ['helado de chontaduro', 'helado de maracuyá', 'helado de guanábana', 'cono waffle', 'brownie'],
    popularAt: ['afternoon', 'weekend', 'sunny'],
    weather: ['sunny', 'hot'], type: 'outdoor',
  },
  {
    id: 8, name: 'Museo La Tertulia', category: 'culture', tags: ['museum', 'culture', 'history', 'art', 'tourist', 'education', 'contemporary'],
    description: 'El museo de arte más importante del suroccidente colombiano, con arte contemporáneo y colecciones históricas.',
    lat: 3.4616, lng: -76.5485, rating: 4.5, visits: 950, trend: 'stable', price: 5,
    openHours: '9:00-18:00', image: 'https://picsum.photos/seed/museum-cali1/400/250',
    reviews: ['Imprescindible en Cali', 'Exposiciones fascinantes', 'El jardín es precioso'],
    menu: [],
    popularAt: ['morning', 'weekend'],
    weather: ['rainy', 'any'], type: 'indoor',
  },
  {
    id: 9, name: 'Galería Alameda', category: 'shopping', tags: ['market', 'fresh', 'shopping', 'food', 'local', 'traditional'],
    description: 'El mercado más tradicional de Cali con frutas exóticas, flores y productos frescos del Valle del Cauca.',
    lat: 3.4565, lng: -76.5445, rating: 4.6, visits: 4200, trend: 'up', price: 0,
    openHours: '5:00-18:00', image: 'https://picsum.photos/seed/market-cali1/400/250',
    reviews: ['Frutas increíbles', 'Precios justos', 'El sabor auténtico del Valle'],
    menu: [],
    popularAt: ['morning', 'weekend'],
    weather: ['any'], type: 'outdoor',
  },
  {
    id: 10, name: 'Hospital Universitario del Valle', category: 'emergency', tags: ['hospital', 'emergency', 'health', 'medical', 'urgent'],
    description: 'Principal centro médico de referencia del suroccidente colombiano, con urgencias 24/7.',
    lat: 3.4328, lng: -76.5384, rating: 4.3, visits: 800, trend: 'stable', price: 0,
    openHours: '24/7', image: 'https://picsum.photos/seed/hospital-cali1/400/250',
    reviews: ['Atención profesional', 'El mejor centro médico de la región'],
    menu: [],
    popularAt: ['any'],
    weather: ['any'], type: 'indoor', isEmergency: true,
  },
  {
    id: 11, name: 'Policía Metropolitana de Cali', category: 'emergency', tags: ['police', 'security', 'emergency', 'safety'],
    description: 'Cuartel general de la Policía Metropolitana de Santiago de Cali.',
    lat: 3.4509, lng: -76.5308, rating: 4.1, visits: 300, trend: 'stable', price: 0,
    openHours: '24/7', image: 'https://picsum.photos/seed/police-cali1/400/250',
    reviews: ['Respuesta rápida', 'Siempre presentes'],
    menu: [],
    popularAt: ['any'],
    weather: ['any'], type: 'indoor', isEmergency: true,
  },
  {
    id: 12, name: 'Il Forno Pizzería', category: 'restaurants', tags: ['pizza', 'italian', 'pasta', 'family', 'dinner', 'delivery'],
    description: 'Pizzería italiana con horno de leña, masa madre artesanal y los mejores ingredientes importados.',
    lat: 3.4595, lng: -76.5390, rating: 4.5, visits: 2100, trend: 'stable', price: 16,
    openHours: '12:00-23:00', image: 'https://picsum.photos/seed/pizza-cali1/400/250',
    reviews: ['Pizza espectacular', 'Masa perfecta', 'Muy buena relación precio-calidad'],
    menu: ['pizza margherita', 'pizza al prosciutto', 'pasta alla norma', 'lasagna', 'tiramisú'],
    popularAt: ['dinner', 'weekend'],
    weather: ['any'], type: 'indoor',
  },
];

export const events = [
  {
    id: 1, name: 'Noche de Salsa en Vivo', category: 'music', date: '2026-05-25', time: '20:00',
    lat: 3.4542, lng: -76.5382, attendees: 950, maxAttendees: 1200,
    impact: 'high', trafficImpact: 'high', description: 'Gran noche de salsa con las mejores orquestas caleñas en vivo.',
    image: 'https://picsum.photos/seed/salsa1/400/250', price: 20, tags: ['music', 'salsa', 'night', 'dancing'],
  },
  {
    id: 2, name: 'Feria Gastronómica Caleña', category: 'food', date: '2026-05-22', time: '10:00',
    lat: 3.4516, lng: -76.5325, attendees: 2500, maxAttendees: 4000,
    impact: 'medium', trafficImpact: 'medium', description: 'La mayor feria de gastronomía caleña con 100+ stands de comida vallecaucana.',
    image: 'https://picsum.photos/seed/food-cali1/400/250', price: 0, tags: ['food', 'gastronomy', 'family', 'day'],
  },
  {
    id: 3, name: 'Maratón Urbana Cali 10K', category: 'sports', date: '2026-05-26', time: '6:00',
    lat: 3.4681, lng: -76.5334, attendees: 800, maxAttendees: 1000,
    impact: 'high', trafficImpact: 'very_high', description: 'Carrera urbana por las principales avenidas de Cali, pasando por Granada y El Peñón.',
    image: 'https://picsum.photos/seed/run-cali1/400/250', price: 12, tags: ['sports', 'running', 'morning', 'health'],
  },
  {
    id: 4, name: 'Expo Digital Cali 2026', category: 'tech', date: '2026-05-28', time: '9:00',
    lat: 3.4710, lng: -76.5290, attendees: 3000, maxAttendees: 5000,
    impact: 'high', trafficImpact: 'high', description: 'El mayor evento de tecnología e innovación del suroccidente colombiano.',
    image: 'https://picsum.photos/seed/tech-cali1/400/250', price: 25, tags: ['tech', 'innovation', 'startup', 'AI'],
  },
  {
    id: 5, name: 'Petronio Álvarez Anticipación', category: 'music', date: '2026-05-31', time: '18:00',
    lat: 3.4460, lng: -76.5370, attendees: 8000, maxAttendees: 12000,
    impact: 'very_high', trafficImpact: 'very_high', description: 'Pre-festival anticipando el Petronio Álvarez con músicos del Pacífico colombiano.',
    image: 'https://picsum.photos/seed/petronio1/400/250', price: 30, tags: ['music', 'pacific', 'afro', 'culture'],
  },
];

export const trafficZones = [
  // Centro
  { id: 1,  name: 'Centro Histórico',        lat: 3.4516, lng: -76.5325, level: 'high',     congestion: 78, description: 'Alta congestión en horas pico — Carrera 1 con Calle 15' },
  { id: 2,  name: 'San Nicolás',             lat: 3.4470, lng: -76.5290, level: 'medium',   congestion: 55, description: 'Tráfico moderado en Carrera 8 con Calle 12' },
  { id: 3,  name: 'La Merced',               lat: 3.4500, lng: -76.5360, level: 'high',     congestion: 70, description: 'Congestión típica en horas pico del centro' },
  { id: 4,  name: 'Alameda',                 lat: 3.4565, lng: -76.5445, level: 'medium',   congestion: 50, description: 'Flujo moderado — mercado activo toda la mañana' },
  // Norte
  { id: 5,  name: 'El Peñón',               lat: 3.4680, lng: -76.5334, level: 'medium',   congestion: 48, description: 'Tráfico moderado en Avenida 6N' },
  { id: 6,  name: 'Granada',                 lat: 3.4710, lng: -76.5310, level: 'medium',   congestion: 52, description: 'Zona restaurantera — mayor flujo en la noche' },
  { id: 7,  name: 'Avenida Sexta Norte',     lat: 3.4750, lng: -76.5270, level: 'critical', congestion: 91, description: 'Tráfico crítico en Av. 6N con Calle 44' },
  { id: 8,  name: 'Versalles',               lat: 3.4820, lng: -76.5240, level: 'low',      congestion: 28, description: 'Flujo normal en zona residencial norte' },
  { id: 9,  name: 'Santa Mónica',            lat: 3.4900, lng: -76.5150, level: 'medium',   congestion: 45, description: 'Congestión moderada en Calle 70' },
  { id: 10, name: 'Chipichape',              lat: 3.4960, lng: -76.5100, level: 'high',     congestion: 74, description: 'Alta afluencia al mall — mayor en fin de semana' },
  { id: 11, name: 'Unicentro Norte',         lat: 3.5020, lng: -76.5050, level: 'medium',   congestion: 60, description: 'Congestión en Carrera 100 con Av. Colombia' },
  { id: 12, name: 'Acopi - Yumbo',           lat: 3.5080, lng: -76.4950, level: 'medium',   congestion: 58, description: 'Congestión por camiones de carga industrial' },
  // Sur
  { id: 13, name: 'Ciudad Jardín',           lat: 3.3780, lng: -76.5310, level: 'low',      congestion: 22, description: 'Flujo normal en zona residencial sur' },
  { id: 14, name: 'Univalle - Meléndez',     lat: 3.3750, lng: -76.5380, level: 'medium',   congestion: 44, description: 'Tráfico universitario en horas pico académicas' },
  { id: 15, name: 'Tequendama',              lat: 3.4120, lng: -76.5380, level: 'medium',   congestion: 53, description: 'Congestión habitual en Av. Colombia' },
  { id: 16, name: 'El Ingenio',              lat: 3.3650, lng: -76.5250, level: 'low',      congestion: 30, description: 'Flujo tranquilo en residencial sur' },
  { id: 17, name: 'Pance - Portales',        lat: 3.3450, lng: -76.5180, level: 'low',      congestion: 18, description: 'Vía a Pance — mayor flujo en fines de semana' },
  // Oriente
  { id: 18, name: 'Aguablanca',              lat: 3.4150, lng: -76.4950, level: 'medium',   congestion: 47, description: 'Tráfico moderado en el distrito de Aguablanca' },
  { id: 19, name: 'Alfonso López',           lat: 3.4200, lng: -76.4880, level: 'medium',   congestion: 55, description: 'Congestión moderada en Cra. 50 con Calle 25' },
  { id: 20, name: 'Marroquín',               lat: 3.3980, lng: -76.4920, level: 'low',      congestion: 35, description: 'Flujo bajo en horario no pico' },
  { id: 21, name: 'Puerto Tejada - Acceso',  lat: 3.3800, lng: -76.4700, level: 'low',      congestion: 25, description: 'Acceso vía Palmira — flujo constante' },
  // Occidente
  { id: 22, name: 'Terrón Colorado',         lat: 3.4700, lng: -76.5550, level: 'high',     congestion: 65, description: 'Vía estrecha hacia los cerros — hora pico crítica' },
  { id: 23, name: 'San Antonio',             lat: 3.4580, lng: -76.5430, level: 'medium',   congestion: 42, description: 'Barrio bohemio — tráfico moderado en fin de semana' },
  { id: 24, name: 'La Tertulia - Río Cali',  lat: 3.4616, lng: -76.5485, level: 'low',      congestion: 30, description: 'Bulevar del Río — flujo controlado' },
  { id: 25, name: 'Juanchito',               lat: 3.4620, lng: -76.4960, level: 'high',     congestion: 80, description: 'Congestión alta en noches de rumba — viernes y sábado' },
  { id: 26, name: 'Buenaventura - Acceso',   lat: 3.4400, lng: -76.5600, level: 'medium',   congestion: 48, description: 'Vía al Pacífico — flujo constante de carga' },
  { id: 27, name: 'Palmira - Km 17',         lat: 3.4800, lng: -76.4500, level: 'medium',   congestion: 56, description: 'Vía Cali-Palmira — alto flujo vehicular' },
  { id: 28, name: 'Jamundí - Acceso Sur',    lat: 3.3300, lng: -76.5400, level: 'low',      congestion: 20, description: 'Acceso a Jamundí — flujo tranquilo' },
];

export const routes = [
  {
    id: 1, name: 'MIO Troncal Calle 5', from: 'Terminal Cali', to: 'Chipichape',
    distance: 9.8, time: 28, cost: 2800, congestion: 40, type: 'bus',
    stops: ['Terminal Cali', 'Av. Colombia', 'San Nicolás', 'Centro', 'Granada', 'Chipichape'],
    color: '#3b82f6',
  },
  {
    id: 2, name: 'MIO Troncal Carrera 1', from: 'Universidades', to: 'Bochalema',
    distance: 12.4, time: 35, cost: 2800, congestion: 62, type: 'bus',
    stops: ['Universidades', 'Meléndez', 'Tequendama', 'Centro', 'Alameda', 'Bochalema'],
    color: '#8b5cf6',
  },
  {
    id: 3, name: 'MIO Circular Oriente', from: 'Calipso', to: 'Aguablanca',
    distance: 7.6, time: 22, cost: 2800, congestion: 25, type: 'bus',
    stops: ['Calipso', 'Marroquín', 'El Diamante', 'Alfonso López', 'Aguablanca'],
    color: '#06b6d4',
  },
];

export const analyticsData = {
  trafficByHour: [
    { hour: '00:00', traffic: 10 }, { hour: '03:00', traffic: 7 }, { hour: '06:00', traffic: 38 },
    { hour: '09:00', traffic: 88 }, { hour: '12:00', traffic: 75 }, { hour: '15:00', traffic: 80 },
    { hour: '18:00', traffic: 95 }, { hour: '21:00', traffic: 50 }, { hour: '23:00', traffic: 20 },
  ],
  popularZones: [
    { zone: 'El Peñón', visits: 5800 }, { zone: 'Granada', visits: 4200 }, { zone: 'Centro', visits: 3900 },
    { zone: 'Ciudad Jardín', visits: 2100 }, { zone: 'Aguablanca', visits: 1400 },
  ],
  weeklyActivity: [
    { day: 'Lun', users: 1400, places: 390 }, { day: 'Mar', users: 1550, places: 420 },
    { day: 'Mie', users: 1300, places: 360 }, { day: 'Jue', users: 1480, places: 410 },
    { day: 'Vie', users: 1900, places: 540 }, { day: 'Sab', users: 2800, places: 780 },
    { day: 'Dom', users: 2400, places: 680 },
  ],
  categoryDistribution: [
    { name: 'Restaurantes', value: 32, color: '#3b82f6' },
    { name: 'Cafés', value: 18, color: '#06b6d4' },
    { name: 'Salsa / Entretenimiento', value: 22, color: '#8b5cf6' },
    { name: 'Deportes', value: 11, color: '#10b981' },
    { name: 'Cultura', value: 10, color: '#f59e0b' },
    { name: 'Otros', value: 7, color: '#6b7280' },
  ],
  kpis: {
    activeUsers: 18640, totalPlaces: 1240, dailySearches: 5820,
    avgTraffic: 71, satisfactionRate: 96, newPlaces: 34,
  },
};

export const alerts = [
  { id: 1, type: 'traffic', severity: 'critical', message: 'Accidente en Av. 6N con Calle 44 — Evita la zona norte', time: '2 min', icon: 'alert' },
  { id: 2, type: 'event', severity: 'info', message: 'Noche de Salsa en Tin Tin Deo inicia en 2 horas — Alta afluencia esperada', time: '5 min', icon: 'event' },
  { id: 3, type: 'weather', severity: 'warning', message: 'Lluvia moderada prevista para las 16:00 — Temporada de lluvias activa', time: '10 min', icon: 'weather' },
  { id: 4, type: 'recommendation', severity: 'info', message: 'Pozzetto El Peñón: perfecto para esta tarde calurosa de Cali', time: '15 min', icon: 'star' },
  { id: 5, type: 'traffic', severity: 'warning', message: 'Congestión en el Centro Histórico — Sale 20 min antes', time: '20 min', icon: 'traffic' },
];

export const weatherConditions = {
  current: 'partly_cloudy',
  temp: 27,
  humidity: 72,
  wind: 14,
  description: 'Parcialmente nublado — Cali, Colombia',
  forecast: [
    { time: '16:00', condition: 'rainy', temp: 24 },
    { time: '19:00', condition: 'rainy', temp: 22 },
    { time: '22:00', condition: 'cloudy', temp: 21 },
  ],
};

export const heatmapPoints = [
  [3.4681, -76.5334, 1.0],  // Parque del Perro
  [3.4670, -76.5345, 0.9],  // Juan Valdez
  [3.4516, -76.5325, 0.95], // Centro Histórico
  [3.4542, -76.5382, 0.85], // Tin Tin Deo
  [3.4665, -76.5310, 0.75], // Granada
  [3.4710, -76.5290, 0.65], // Norte
  [3.4663, -76.5338, 0.80], // Pozzetto
  [3.4616, -76.5485, 0.55], // Museo La Tertulia
  [3.4565, -76.5445, 0.70], // Galería Alameda
  [3.4595, -76.5390, 0.72], // Il Forno
  [3.4328, -76.5384, 0.50], // Hospital Valle
  [3.4150, -76.5050, 0.40], // Aguablanca
];

export const touristSpots = [
  { id: 1, name: 'Cristo Rey', description: 'Monumento icónico que domina la ciudad desde el cerro Los Cristales', rating: 4.8, category: 'heritage' },
  { id: 2, name: 'Zoológico de Cali', description: 'Uno de los mejores zoológicos de América Latina, a orillas del Río Cali', rating: 4.9, category: 'nature' },
  { id: 3, name: 'Barrio San Antonio', description: 'El barrio más pintoresco y bohemio de Cali, lleno de arte y cultura', rating: 4.7, category: 'culture' },
  { id: 4, name: 'Cerro de las Tres Cruces', description: 'Mirador con vista panorámica espectacular de toda la ciudad', rating: 4.6, category: 'viewpoint' },
];
