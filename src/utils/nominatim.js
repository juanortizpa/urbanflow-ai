const BASE = 'https://nominatim.openstreetmap.org';
// Cali bounding box: viewbox=lon_min,lat_max,lon_max,lat_min (W,N,E,S)
const VIEWBOX = '-76.62,3.58,-76.43,3.32';

export async function searchAddress(query) {
  if (!query || query.length < 3) return [];
  const url = `${BASE}/search?q=${encodeURIComponent(query + ', Cali Colombia')}&format=json&countrycodes=co&bounded=1&viewbox=${VIEWBOX}&limit=6&addressdetails=1&accept-language=es`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'UrbanFlowAI/1.0' } });
    const data = await res.json();
    return data.map(item => ({
      id: item.place_id,
      name: formatAddress(item),
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      category: item.class,
    }));
  } catch { return []; }
}

function formatAddress(item) {
  const addr = item.address || {};
  const parts = [
    item.namedetails?.name || addr.road || addr.pedestrian,
    addr.neighbourhood || addr.suburb,
    addr.city || 'Cali',
  ].filter(Boolean);
  return parts.join(', ') || item.display_name.split(',').slice(0, 2).join(', ');
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`${BASE}/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`, {
      headers: { 'User-Agent': 'UrbanFlowAI/1.0' }
    });
    const data = await res.json();
    const addr = data.address || {};
    return [addr.road || addr.pedestrian || 'Calle desconocida', addr.neighbourhood || addr.suburb || 'Cali']
      .filter(Boolean).join(', ');
  } catch { return 'Mi ubicacion'; }
}
