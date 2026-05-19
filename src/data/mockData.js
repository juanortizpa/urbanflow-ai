export const CITY_CENTER = [-4.0383, -79.2113]; // Loja, Ecuador

export const places = [
  {
    id: 1, name: 'Parque Central Loja', category: 'parks', tags: ['outdoor', 'family', 'nature', 'recreation', 'free'],
    description: 'El corazon verde de la ciudad, ideal para caminar, descansar y disfrutar de la naturaleza urbana.',
    lat: -4.0009, lng: -79.2041, rating: 4.7, visits: 3200, trend: 'up', price: 0,
    openHours: '24/7', image: 'https://picsum.photos/seed/park1/400/250',
    reviews: ['Muy bonito y tranquilo', 'Ideal para la familia', 'Excelente mantenimiento'],
    menu: [], popularAt: ['morning', 'evening', 'weekend'],
    weather: ['sunny', 'cloudy'], type: 'outdoor',
  },
  {
    id: 2, name: 'Cafe Bohemio', category: 'cafes', tags: ['coffee', 'wifi', 'cozy', 'artisan', 'breakfast', 'work'],
    description: 'Cafe artesanal con los mejores granos de la region y ambiente perfecto para trabajar o relajarse.',
    lat: -4.0021, lng: -79.2055, rating: 4.8, visits: 1850, trend: 'up', price: 8,
    openHours: '7:00-22:00', image: 'https://picsum.photos/seed/cafe1/400/250',
    reviews: ['El mejor cafe de la ciudad', 'WiFi excelente', 'Ambiente acogedor'],
    menu: ['cafe americano', 'cappuccino', 'latte', 'croissant', 'sandwich'],
    popularAt: ['morning', 'afternoon', 'rainy'],
    weather: ['rainy', 'cloudy'], type: 'indoor',
  },
  {
    id: 3, name: 'Burger House Premium', category: 'restaurants', tags: ['burgers', 'fast food', 'american', 'grill', 'comida americana', 'hamburguesa'],
    description: 'Las mejores hamburguesas artesanales con ingredientes frescos y salsas secretas.',
    lat: -4.0045, lng: -79.2078, rating: 4.5, visits: 2100, trend: 'stable', price: 12,
    openHours: '11:00-23:00', image: 'https://picsum.photos/seed/burger1/400/250',
    reviews: ['La mejor hamburgesa de la ciudad', 'Porciones generosas', 'Imperdible'],
    menu: ['hamburguesa clasica', 'double burger', 'chicken burger', 'papas fritas', 'milkshake', 'comida americana'],
    popularAt: ['lunch', 'dinner', 'night'],
    weather: ['any'], type: 'indoor',
  },
  {
    id: 4, name: 'Sky Rooftop Bar', category: 'bars', tags: ['nightlife', 'cocktails', 'views', 'bar', 'drinks', 'party'],
    description: 'Bar en la azotea con vista panoramica de la ciudad, cocteleria premium y ambiente exclusivo.',
    lat: -4.0033, lng: -79.2091, rating: 4.6, visits: 1400, trend: 'up', price: 20,
    openHours: '18:00-02:00', image: 'https://picsum.photos/seed/bar1/400/250',
    reviews: ['Vista increible', 'Cocteleria de primer nivel', 'El mejor spot de la ciudad'],
    menu: ['mojito', 'margarita', 'gin tonic', 'whisky sour', 'tabla de quesos'],
    popularAt: ['night', 'evening', 'weekend'],
    weather: ['sunny', 'clear'], type: 'outdoor',
  },
  {
    id: 5, name: 'Sushi Zen', category: 'restaurants', tags: ['sushi', 'japanese', 'seafood', 'asian', 'healthy', 'premium'],
    description: 'Restaurante japones autentico con sushi fresco y una experiencia culinaria unica.',
    lat: -4.0058, lng: -79.2034, rating: 4.9, visits: 1200, trend: 'up', price: 25,
    openHours: '12:00-22:00', image: 'https://picsum.photos/seed/sushi1/400/250',
    reviews: ['El mejor sushi', 'Fresco y autentico', 'Experiencia unica'],
    menu: ['salmon roll', 'tuna sashimi', 'california roll', 'miso soup', 'edamame'],
    popularAt: ['lunch', 'dinner'],
    weather: ['any'], type: 'indoor',
  },
  {
    id: 6, name: 'FitZone Gym', category: 'sports', tags: ['gym', 'fitness', 'sports', 'health', 'workout', 'exercise'],
    description: 'Centro deportivo de alta gama con equipamiento de ultima tecnologia y entrenadores certificados.',
    lat: -4.0071, lng: -79.2062, rating: 4.4, visits: 890, trend: 'stable', price: 30,
    openHours: '5:00-23:00', image: 'https://picsum.photos/seed/gym1/400/250',
    reviews: ['Excelente equipamiento', 'Buenos instructores', 'Limpio y organizado'],
    menu: [],
    popularAt: ['morning', 'evening'],
    weather: ['any'], type: 'indoor',
  },
  {
    id: 7, name: 'Heladeria Artesanal Bella', category: 'desserts', tags: ['ice cream', 'desserts', 'artisan', 'sweet', 'family'],
    description: 'Heladeria con mas de 40 sabores artesanales hechos con frutas de la region.',
    lat: -4.0015, lng: -79.2105, rating: 4.7, visits: 2800, trend: 'up', price: 5,
    openHours: '10:00-21:00', image: 'https://picsum.photos/seed/ice1/400/250',
    reviews: ['Los mejores helados', 'Sabores unicos', 'Economico y delicioso'],
    menu: ['helado de mora', 'helado de coco', 'helado de taxo', 'sundae', 'waffle'],
    popularAt: ['afternoon', 'weekend', 'sunny'],
    weather: ['sunny', 'hot'], type: 'outdoor',
  },
  {
    id: 8, name: 'Museo de la Ciudad', category: 'culture', tags: ['museum', 'culture', 'history', 'art', 'tourist', 'education'],
    description: 'Recorre la historia de la ciudad a traves de exhibiciones interactivas y arte contemporaneo.',
    lat: -4.0029, lng: -79.2018, rating: 4.3, visits: 650, trend: 'stable', price: 3,
    openHours: '9:00-17:00', image: 'https://picsum.photos/seed/museum1/400/250',
    reviews: ['Muy educativo', 'Buenas exhibiciones', 'Para toda la familia'],
    menu: [],
    popularAt: ['morning', 'weekend'],
    weather: ['rainy', 'any'], type: 'indoor',
  },
  {
    id: 9, name: 'Mercado Artesanal', category: 'shopping', tags: ['market', 'artisan', 'shopping', 'crafts', 'local', 'tourist'],
    description: 'Mercado de artesanias locales con productos unicos, tejidos y recuerdos autenticos.',
    lat: -4.0052, lng: -79.2127, rating: 4.5, visits: 1100, trend: 'up', price: 0,
    openHours: '8:00-18:00', image: 'https://picsum.photos/seed/market1/400/250',
    reviews: ['Productos autenticos', 'Buenos precios', 'Gran variedad'],
    menu: [],
    popularAt: ['morning', 'weekend', 'tourist'],
    weather: ['any'], type: 'outdoor',
  },
  {
    id: 10, name: 'Hospital Regional', category: 'emergency', tags: ['hospital', 'emergency', 'health', 'medical', 'urgent'],
    description: 'Centro medico de referencia regional con atencion de emergencias 24/7.',
    lat: -4.0088, lng: -79.2140, rating: 4.2, visits: 500, trend: 'stable', price: 0,
    openHours: '24/7', image: 'https://picsum.photos/seed/hospital1/400/250',
    reviews: ['Atencion profesional', 'Rapida respuesta en emergencias'],
    menu: [],
    popularAt: ['any'],
    weather: ['any'], type: 'indoor', isEmergency: true,
  },
  {
    id: 11, name: 'Policia Nacional', category: 'emergency', tags: ['police', 'security', 'emergency', 'safety'],
    description: 'Unidad de policia con cobertura rapida en toda la zona urbana.',
    lat: -4.0042, lng: -79.2155, rating: 4.0, visits: 200, trend: 'stable', price: 0,
    openHours: '24/7', image: 'https://picsum.photos/seed/police1/400/250',
    reviews: ['Respuesta rapida', 'Profesionales y atentos'],
    menu: [],
    popularAt: ['any'],
    weather: ['any'], type: 'indoor', isEmergency: true,
  },
  {
    id: 12, name: 'Pizzeria Napoli', category: 'restaurants', tags: ['pizza', 'italian', 'pasta', 'family', 'dinner', 'delivery'],
    description: 'Autentica pizza italiana con horno de lena y masa madre artesanal.',
    lat: -4.0063, lng: -79.2098, rating: 4.6, visits: 1750, trend: 'stable', price: 15,
    openHours: '12:00-23:00', image: 'https://picsum.photos/seed/pizza1/400/250',
    reviews: ['Pizza autentica', 'Masa perfecta', 'Buen precio'],
    menu: ['pizza margherita', 'pizza pepperoni', 'pasta carbonara', 'lasagna', 'tiramisu'],
    popularAt: ['dinner', 'weekend'],
    weather: ['any'], type: 'indoor',
  },
];

export const events = [
  {
    id: 1, name: 'Festival de Jazz Urbano', category: 'music', date: '2026-05-25', time: '19:00',
    lat: -4.0009, lng: -79.2041, attendees: 850, maxAttendees: 1000,
    impact: 'high', trafficImpact: 'high', description: 'Festival de jazz al aire libre con artistas internacionales.',
    image: 'https://picsum.photos/seed/jazz1/400/250', price: 15, tags: ['music', 'jazz', 'outdoor', 'night'],
  },
  {
    id: 2, name: 'Feria Gastronomica', category: 'food', date: '2026-05-22', time: '10:00',
    lat: -4.0033, lng: -79.2091, attendees: 1200, maxAttendees: 2000,
    impact: 'medium', trafficImpact: 'medium', description: 'La mayor feria de comida de la region con 80+ stands.',
    image: 'https://picsum.photos/seed/food1/400/250', price: 0, tags: ['food', 'gastronomy', 'family', 'day'],
  },
  {
    id: 3, name: 'Maraton Urbana 10K', category: 'sports', date: '2026-05-26', time: '6:00',
    lat: -4.0058, lng: -79.2034, attendees: 500, maxAttendees: 600,
    impact: 'high', trafficImpact: 'very_high', description: 'Carrera urbana por las calles principales de la ciudad.',
    image: 'https://picsum.photos/seed/run1/400/250', price: 10, tags: ['sports', 'running', 'morning', 'health'],
  },
  {
    id: 4, name: 'Expo Tecnologia 2026', category: 'tech', date: '2026-05-28', time: '9:00',
    lat: -4.0071, lng: -79.2062, attendees: 2000, maxAttendees: 3000,
    impact: 'high', trafficImpact: 'high', description: 'Exposicion de las ultimas tendencias en tecnologia e innovacion.',
    image: 'https://picsum.photos/seed/tech1/400/250', price: 20, tags: ['tech', 'innovation', 'startup', 'AI'],
  },
  {
    id: 5, name: 'Concierto Rock en Vivo', category: 'music', date: '2026-05-31', time: '20:00',
    lat: -4.0052, lng: -79.2127, attendees: 3000, maxAttendees: 5000,
    impact: 'very_high', trafficImpact: 'very_high', description: 'La banda mas famosa del pais en un concierto epico.',
    image: 'https://picsum.photos/seed/rock1/400/250', price: 35, tags: ['music', 'rock', 'night', 'concert'],
  },
];

export const trafficZones = [
  { id: 1, name: 'Centro Historico', lat: -4.0009, lng: -79.2041, level: 'high', congestion: 78, description: 'Alta congestion en horas pico' },
  { id: 2, name: 'Zona Comercial Norte', lat: -4.0021, lng: -79.2155, level: 'medium', congestion: 45, description: 'Trafico moderado' },
  { id: 3, name: 'Avenida Principal', lat: -4.0058, lng: -79.2034, level: 'critical', congestion: 92, description: 'Trafico critico - accidente reportado' },
  { id: 4, name: 'Barrio Universitario', lat: -4.0088, lng: -79.2098, level: 'low', congestion: 20, description: 'Flujo normal' },
  { id: 5, name: 'Zona Industrial', lat: -4.0071, lng: -79.2170, level: 'medium', congestion: 55, description: 'Congestion por camiones' },
];

export const routes = [
  {
    id: 1, name: 'Ruta Express Centro', from: 'Terminal Norte', to: 'Plaza Central',
    distance: 4.2, time: 12, cost: 0.30, congestion: 35, type: 'bus',
    stops: ['Terminal Norte', 'Av. Universitaria', 'Hospital Regional', 'Plaza Central'],
    color: '#3b82f6',
  },
  {
    id: 2, name: 'Ruta Comercial', from: 'Mercado Sur', to: 'Centro Comercial Norte',
    distance: 6.8, time: 22, cost: 0.25, congestion: 65, type: 'bus',
    stops: ['Mercado Sur', 'Barrio Las Palmas', 'Parque Central', 'Centro Comercial Norte'],
    color: '#8b5cf6',
  },
  {
    id: 3, name: 'Ruta Rapida Norte', from: 'Plaza Central', to: 'Zona Industrial',
    distance: 8.5, time: 18, cost: 0.35, congestion: 20, type: 'bus',
    stops: ['Plaza Central', 'Estadio Municipal', 'Terminal Industrial', 'Zona Industrial'],
    color: '#06b6d4',
  },
];

export const analyticsData = {
  trafficByHour: [
    { hour: '00:00', traffic: 12 }, { hour: '03:00', traffic: 8 }, { hour: '06:00', traffic: 35 },
    { hour: '09:00', traffic: 85 }, { hour: '12:00', traffic: 72 }, { hour: '15:00', traffic: 78 },
    { hour: '18:00', traffic: 92 }, { hour: '21:00', traffic: 45 }, { hour: '23:00', traffic: 22 },
  ],
  popularZones: [
    { zone: 'Centro', visits: 4200 }, { zone: 'Comercial', visits: 3100 }, { zone: 'Universitaria', visits: 2800 },
    { zone: 'Industrial', visits: 1500 }, { zone: 'Residencial', visits: 900 },
  ],
  weeklyActivity: [
    { day: 'Lun', users: 1200, places: 340 }, { day: 'Mar', users: 1350, places: 380 },
    { day: 'Mie', users: 1100, places: 310 }, { day: 'Jue', users: 1280, places: 360 },
    { day: 'Vie', users: 1680, places: 480 }, { day: 'Sab', users: 2100, places: 620 },
    { day: 'Dom', users: 1850, places: 540 },
  ],
  categoryDistribution: [
    { name: 'Restaurantes', value: 35, color: '#3b82f6' },
    { name: 'Cafes', value: 20, color: '#06b6d4' },
    { name: 'Entretenimiento', value: 18, color: '#8b5cf6' },
    { name: 'Deportes', value: 12, color: '#10b981' },
    { name: 'Cultura', value: 10, color: '#f59e0b' },
    { name: 'Otros', value: 5, color: '#6b7280' },
  ],
  kpis: {
    activeUsers: 12480, totalPlaces: 847, dailySearches: 3240,
    avgTraffic: 67, satisfactionRate: 94, newPlaces: 23,
  },
};

export const alerts = [
  { id: 1, type: 'traffic', severity: 'critical', message: 'Accidente en Av. Principal - Evita la zona', time: '2 min', icon: 'alert' },
  { id: 2, type: 'event', severity: 'info', message: 'Festival de Jazz inicia en 2 horas - Alta afluencia esperada', time: '5 min', icon: 'event' },
  { id: 3, type: 'weather', severity: 'warning', message: 'Lluvia moderada prevista para las 17:00', time: '10 min', icon: 'weather' },
  { id: 4, type: 'recommendation', severity: 'info', message: 'Cafe Bohemio: ambiente perfecto para trabajar en esta tarde', time: '15 min', icon: 'star' },
  { id: 5, type: 'traffic', severity: 'warning', message: 'Congestion en Centro Historico - Sale 15 min antes', time: '20 min', icon: 'traffic' },
];

export const weatherConditions = {
  current: 'partly_cloudy',
  temp: 18,
  humidity: 65,
  wind: 12,
  description: 'Parcialmente nublado',
  forecast: [
    { time: '15:00', condition: 'rainy', temp: 16 },
    { time: '18:00', condition: 'rainy', temp: 15 },
    { time: '21:00', condition: 'cloudy', temp: 14 },
  ],
};

export const heatmapPoints = [
  [-4.0009, -79.2041, 1.0], [-4.0021, -79.2055, 0.8], [-4.0033, -79.2091, 0.9],
  [-4.0045, -79.2078, 0.7], [-4.0058, -79.2034, 0.85], [-4.0071, -79.2062, 0.6],
  [-4.0015, -79.2105, 0.75], [-4.0029, -79.2018, 0.5], [-4.0052, -79.2127, 0.65],
  [-4.0063, -79.2098, 0.7], [-4.0088, -79.2140, 0.55], [-4.0042, -79.2155, 0.45],
];

export const touristSpots = [
  { id: 1, name: 'Cathedral de Loja', description: 'Joya arquitectonica del siglo XVIII', rating: 4.8, category: 'heritage' },
  { id: 2, name: 'Parque Nacional Podocarpus', description: 'Reserva ecologica unica en el mundo', rating: 4.9, category: 'nature' },
  { id: 3, name: 'Calle Lourdes', description: 'La calle mas pintoresca y colorida de la ciudad', rating: 4.6, category: 'culture' },
  { id: 4, name: 'Mirador El Calvario', description: 'Vista panoramica de 360 grados de la ciudad', rating: 4.7, category: 'viewpoint' },
];
