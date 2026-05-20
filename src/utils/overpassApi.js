// Overpass API — lugares reales de OpenStreetMap en Cali, Colombia
// Bounding box: S=3.28, W=-76.65, N=3.58, E=-76.43

const CALI_BBOX = '3.28,-76.65,3.58,-76.43';

// Servidores mirror de Overpass (se intenta en orden)
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

const OSM_CATEGORY_MAP = {
  restaurant:    { category: 'restaurants', tags: ['food', 'dining'] },
  cafe:          { category: 'cafes',       tags: ['coffee', 'work', 'cozy'] },
  bar:           { category: 'bars',        tags: ['drinks', 'nightlife'] },
  pub:           { category: 'bars',        tags: ['drinks', 'nightlife'] },
  fast_food:     { category: 'restaurants', tags: ['fast food', 'quick'] },
  food_court:    { category: 'restaurants', tags: ['fast food', 'food court'] },
  ice_cream:     { category: 'desserts',    tags: ['desserts', 'sweet'] },
  bakery:        { category: 'cafes',       tags: ['bread', 'coffee', 'breakfast'] },
  confectionery: { category: 'desserts',    tags: ['desserts', 'sweet', 'chocolate'] },
  nightclub:     { category: 'bars',        tags: ['nightlife', 'party', 'dancing'] },
  music_venue:   { category: 'bars',        tags: ['nightlife', 'live music'] },
  museum:        { category: 'culture',     tags: ['museum', 'history', 'art'] },
  theatre:       { category: 'culture',     tags: ['theatre', 'culture', 'entertainment'] },
  cinema:        { category: 'culture',     tags: ['cinema', 'movies'] },
  arts_centre:   { category: 'culture',     tags: ['art', 'culture', 'events'] },
  library:       { category: 'culture',     tags: ['library', 'books', 'study'] },
  gym:           { category: 'sports',      tags: ['gym', 'fitness', 'health'] },
  sports_centre: { category: 'sports',      tags: ['sports', 'fitness'] },
  swimming_pool: { category: 'sports',      tags: ['swimming', 'fitness', 'water'] },
  park:          { category: 'parks',       tags: ['outdoor', 'nature', 'family'] },
  garden:        { category: 'parks',       tags: ['outdoor', 'nature', 'relaxation'] },
  playground:    { category: 'parks',       tags: ['outdoor', 'family', 'children'] },
  attraction:    { category: 'culture',     tags: ['tourist', 'landmark'] },
  gallery:       { category: 'culture',     tags: ['art', 'gallery', 'culture'] },
  viewpoint:     { category: 'culture',     tags: ['viewpoint', 'panoramic', 'tourist'] },
  supermarket:   { category: 'shopping',   tags: ['shopping', 'grocery'] },
  mall:          { category: 'shopping',   tags: ['shopping', 'mall'] },
  department_store: { category: 'shopping', tags: ['shopping', 'department store'] },
  hotel:         { category: 'culture',     tags: ['hotel', 'accommodation', 'tourist'] },
  hostel:        { category: 'culture',     tags: ['hostel', 'accommodation', 'backpacker'] },
  university:    { category: 'culture',     tags: ['university', 'education', 'campus'] },
  college:       { category: 'culture',     tags: ['college', 'education'] },
  clinic:        { category: 'culture',     tags: ['health', 'clinic', 'medical'] },
  pharmacy:      { category: 'shopping',   tags: ['pharmacy', 'health', 'medicine'] },
};

const OVERPASS_QUERY = `
[out:json][timeout:60];
(
  node["amenity"~"restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|bakery|confectionery|nightclub|music_venue|museum|theatre|cinema|arts_centre|library|gym|swimming_pool|hotel|hostel|university|college|clinic|pharmacy"](${CALI_BBOX});
  node["leisure"~"park|garden|playground|sports_centre|fitness_centre|stadium"](${CALI_BBOX});
  node["tourism"~"museum|gallery|attraction|viewpoint|hotel|hostel"](${CALI_BBOX});
  node["shop"~"supermarket|mall|department_store|convenience|bakery|confectionery"](${CALI_BBOX});
  node["building"~"university|college|school"](${CALI_BBOX});
);
out body 2000;
`;

function estimateRating(category) {
  const base = {
    restaurants: 4.2, cafes: 4.3, bars: 4.1, desserts: 4.5,
    culture: 4.4, sports: 4.0, parks: 4.6, shopping: 4.0,
  };
  const b = base[category] || 4.0;
  return Math.round((b + (Math.random() * 0.6 - 0.3)) * 10) / 10;
}

function estimatePrice(amenity) {
  const prices = {
    restaurant: 18, cafe: 8, bar: 12, pub: 10, fast_food: 7, food_court: 8,
    ice_cream: 5, bakery: 6, confectionery: 5, nightclub: 15, music_venue: 12,
    museum: 5, theatre: 25, cinema: 18, arts_centre: 8, library: 0,
    gym: 40, sports_centre: 20, swimming_pool: 15, fitness_centre: 35,
    park: 0, garden: 0, playground: 0, stadium: 20,
    attraction: 0, gallery: 4, viewpoint: 0,
    supermarket: 30, mall: 0, department_store: 0, convenience: 10, bakery_shop: 6,
    hotel: 80, hostel: 25, university: 0, college: 0, clinic: 25, pharmacy: 15,
  };
  return prices[amenity] ?? 10;
}

function estimateVisits(category) {
  const base = {
    restaurants: 2000, cafes: 1500, bars: 2500, desserts: 1800,
    culture: 900, sports: 1200, parks: 4000, shopping: 3500,
  };
  const b = base[category] || 800;
  return Math.floor(b + (Math.random() - 0.5) * b * 0.6);
}

function popularAtByCategory(category) {
  const map = {
    cafes:       ['morning', 'afternoon'],
    restaurants: ['afternoon', 'evening'],
    bars:        ['evening', 'night'],
    desserts:    ['afternoon', 'evening'],
    parks:       ['morning', 'afternoon'],
    culture:     ['morning', 'afternoon'],
    sports:      ['morning', 'evening'],
    shopping:    ['afternoon', 'evening'],
  };
  return map[category] || ['morning', 'afternoon', 'evening'];
}

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos

async function tryFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function fetchCaliPlaces() {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  let data = null;
  for (const mirror of OVERPASS_MIRRORS) {
    try {
      data = await tryFetch(mirror);
      if (data) break;
    } catch (err) {
      console.warn(`Overpass mirror ${mirror} falló:`, err.message);
    }
  }

  if (!data) {
    console.warn('Todos los mirrors de Overpass fallaron — usando solo datos locales');
    return _cache || [];
  }

  const places = data.elements
    .filter(el => el.tags?.name && el.lat && el.lon)
    .map((el) => {
      const amenity = el.tags.amenity || el.tags.leisure || el.tags.tourism || el.tags.shop || el.tags.building || 'attraction';
      const mapping = OSM_CATEGORY_MAP[amenity] || { category: 'culture', tags: ['attraction'] };
      const category = mapping.category;
      const rating = estimateRating(category);
      const visits = estimateVisits(category);

      return {
        id: `osm_${el.id}`,
        name: el.tags.name,
        category,
        tags: [...mapping.tags, amenity],
        description: el.tags.description || el.tags['description:es'] || `${el.tags.name} — Cali, Colombia.`,
        lat: el.lat,
        lng: el.lon,
        rating,
        visits,
        trend: rating >= 4.4 ? 'up' : 'stable',
        price: estimatePrice(amenity),
        openHours: el.tags.opening_hours || '9:00-20:00',
        image: `https://picsum.photos/seed/osm${el.id}/400/250`,
        reviews: [],
        menu: [],
        popularAt: popularAtByCategory(category),
        weather: ['any'],
        type: ['park', 'garden', 'playground', 'viewpoint'].includes(amenity) ? 'outdoor' : 'indoor',
        source: 'osm',
        website: el.tags.website,
        phone: el.tags.phone,
        address: el.tags['addr:street']
          ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`.trim()
          : undefined,
      };
    });

  console.log(`Overpass: ${places.length} lugares cargados de Cali`);
  _cache = places;
  _cacheTime = Date.now();
  return places;
}
