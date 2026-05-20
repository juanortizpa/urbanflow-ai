// OSRM routing — uses driving profile for geometry (only supported profile
// on the public demo server). Mode-specific durations are computed from
// the road distance using realistic urban speeds + traffic factor.

const BASE = 'https://router.project-osrm.org/route/v1/driving';

// Average urban speeds in Cali (km/h)
const SPEEDS = {
  bus:  18,   // MIO: stops, traffic lights, detours
  taxi: 28,   // car with typical Cali traffic
  car:  28,
  bike: 14,   // cycling in city
  walk:  5,   // walking
};

// Extra fixed time per mode (minutes) — waiting for bus, etc.
const FIXED_OVERHEAD = {
  bus:  8,   // wait at stop + boarding
  taxi: 3,   // hailing + seating
  car:  0,
  bike: 0,
  walk: 0,
};

// Traffic multiplier based on congestion level (0-100)
function trafficMultiplier(congestion = 40) {
  if (congestion >= 80) return 1.6;
  if (congestion >= 60) return 1.35;
  if (congestion >= 40) return 1.15;
  return 1.0;
}

const MANEUVER_LABELS = {
  'turn':             { right: 'Girar a la derecha', left: 'Girar a la izquierda', default: 'Girar' },
  'new name':         { default: 'Continuar por' },
  'depart':           { default: 'Iniciar recorrido' },
  'arrive':           { default: 'Has llegado a tu destino' },
  'merge':            { default: 'Incorporarse al carril' },
  'on ramp':          { right: 'Incorporarse por la derecha', left: 'Incorporarse por la izquierda', default: 'Incorporarse a la vía' },
  'off ramp':         { right: 'Salir por la derecha', left: 'Salir por la izquierda', default: 'Salir de la vía' },
  'fork':             { right: 'Tomar ramal derecho', left: 'Tomar ramal izquierdo', default: 'Tomar el ramal' },
  'end of road':      { right: 'Al final, girar a la derecha', left: 'Al final, girar a la izquierda', default: 'Al final de la vía' },
  'use lane':         { default: 'Usar el carril indicado' },
  'continue':         { default: 'Continuar recto' },
  'roundabout':       { default: 'Incorporarse a la rotonda' },
  'rotary':           { default: 'Incorporarse a la glorieta' },
  'roundabout turn':  { default: 'En la rotonda, girar' },
  'notification':     { default: 'Continuar' },
  'exit roundabout':  { default: 'Salir de la rotonda' },
  'exit rotary':      { default: 'Salir de la glorieta' },
};

function getInstruction(step) {
  const { type, modifier } = step.maneuver;
  if (type === 'arrive') return '📍 Has llegado a tu destino';
  if (type === 'depart') return `🚀 Iniciar por ${step.name || 'la vía'}`;

  const group = MANEUVER_LABELS[type] || {};
  const base = group[modifier] || group.default || 'Continuar';
  const streetName = step.name ? ` por ${step.name}` : '';

  const arrows = {
    right: '→', left: '←', 'slight right': '↗', 'slight left': '↖',
    'sharp right': '↱', 'sharp left': '↰', uturn: '↩', straight: '↑',
  };
  const arrow = arrows[modifier] || '';
  return `${arrow} ${base}${streetName}`.trim();
}

export async function getRoute(from, to, mode = 'bus', congestion = 40) {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `${BASE}/${coords}?overview=full&geometries=geojson&steps=true&alternatives=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo calcular la ruta');
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error(data.message || 'Ruta no encontrada');

  const speed = SPEEDS[mode] || SPEEDS.bus;
  const overhead = FIXED_OVERHEAD[mode] || 0;
  const tfactor = (mode === 'bus' || mode === 'taxi' || mode === 'car')
    ? trafficMultiplier(congestion) : 1.0;

  return data.routes.map((route, idx) => {
    const distKm = route.distance / 1000;
    // Realistic duration: distance / mode speed * traffic, + overhead
    const durationSec = Math.round((distKm / speed) * 3600 * tfactor + overhead * 60);

    return {
      id: idx,
      distance: route.distance,
      duration: durationSec,
      geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      steps: route.legs.flatMap(leg =>
        leg.steps.map(step => ({
          instruction: getInstruction(step),
          name: step.name || 'Vía sin nombre',
          distance: step.distance,
          duration: Math.round(step.distance / 1000 / speed * 3600 * tfactor),
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
        }))
      ).filter(s => s.distance > 5 || s.type === 'arrive'),
      isAlternative: idx > 0,
      mode,
      congestionApplied: congestion,
    };
  });
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function estimateCost(distance, mode) {
  const km = distance / 1000;
  const costs = {
    bus:  () => 3200,
    walk: () => 0,
    bike: () => 0,
    car:  () => Math.round(2500 + km * 1900),
    taxi: () => Math.round(6000 + km * 2400),
  };
  return (costs[mode] || costs.bus)();
}
