const BASE = 'https://router.project-osrm.org/route/v1';

const PROFILE = { bus: 'driving', car: 'driving', taxi: 'driving', bike: 'bike', walk: 'foot' };

const MANEUVER_LABELS = {
  'turn-right': 'Girar a la derecha',
  'turn-left': 'Girar a la izquierda',
  'straight': 'Continuar recto',
  'slight right': 'Ligeramente a la derecha',
  'slight left': 'Ligeramente a la izquierda',
  'sharp right': 'Girar fuerte a la derecha',
  'sharp left': 'Girar fuerte a la izquierda',
  'uturn': 'Dar vuelta en U',
  'roundabout': 'Incorporarse a la rotonda',
  'arrive': 'Has llegado a tu destino',
  'depart': 'Iniciar recorrido',
  'merge': 'Incorporarse',
  'fork': 'Tomar el ramal',
  'end of road': 'Al final de la via',
  'on ramp': 'Incorporarse a la via',
  'off ramp': 'Salir de la via',
  'default': 'Continuar',
};

export async function getRoute(from, to, mode = 'bus') {
  const profile = PROFILE[mode] || 'driving';
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `${BASE}/${profile}/${coords}?overview=full&geometries=geojson&steps=true&alternatives=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo calcular la ruta');
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error(data.message || 'Ruta no encontrada');

  return data.routes.map((route, idx) => ({
    id: idx,
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    steps: route.legs.flatMap(leg =>
      leg.steps.map(step => ({
        instruction: getInstruction(step),
        name: step.name || 'Via sin nombre',
        distance: step.distance,
        duration: step.duration,
        type: step.maneuver.type,
        modifier: step.maneuver.modifier,
      }))
    ).filter(s => s.type !== 'arrive' ? s.distance > 0 : true),
    isAlternative: idx > 0,
  }));
}

function getInstruction(step) {
  const { type, modifier } = step.maneuver;
  if (type === 'arrive') return MANEUVER_LABELS['arrive'];
  if (type === 'depart') return MANEUVER_LABELS['depart'];
  const key = modifier ? `${type}-${modifier}` : type;
  return MANEUVER_LABELS[key] || MANEUVER_LABELS[modifier] || MANEUVER_LABELS['default'];
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
  // COP costs for Cali
  const costs = {
    bus: () => 3200, // flat rate MIO
    walk: () => 0,
    bike: () => 0,
    car: () => Math.round(2500 + (distance / 1000) * 1800),
    taxi: () => Math.round(6000 + (distance / 1000) * 2200),
  };
  return (costs[mode] || costs.bus)();
}
