const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

function distanceKm(lat1, lng1, lat2, lng2) {
  const r = (value) => value * Math.PI / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function serviceTerms(service) {
  const value = `${service.name} ${service.department}`.toLowerCase();
  if (value.includes('passport')) return 'passport|immigration';
  if (value.includes('birth') || value.includes('certificate')) return 'birth|registration|registrar';
  if (value.includes('police')) return 'police';
  if (value.includes('fire')) return 'fire';
  if (value.includes('health') || value.includes('ambulance')) return 'hospital|health|clinic';
  if (value.includes('electric')) return 'electric|power|palli bidyut';
  if (value.includes('road')) return 'road|transport|highway';
  if (value.includes('education')) return 'education|school|college|university';
  if (value.includes('revenue')) return 'revenue|tax|land';
  if (value.includes('waste')) return 'waste|sanitation';
  return '';
}

async function findNearbyOffices({ lat, lng, service, radius = 25000 }) {
  const meters = Math.min(Math.max(Number(radius) || 25000, 1000), 25000);
  const key = `${service._id}:${lat.toFixed(3)}:${lng.toFixed(3)}:${meters}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.offices;

  // OSM name-regex searches over a large city often time out on public
  // Overpass instances. The structured government and civic tags are fast
  // and dependable; the selected service is retained for feedback matching.
  const query = `[out:json][timeout:25];(nwr(around:${meters},${lat},${lng})["office"="government"];nwr(around:${meters},${lat},${lng})["amenity"~"townhall|police|fire_station|hospital|clinic",i];);out center 100;`;
  const endpoints = [...new Set([
    process.env.OVERPASS_URL,
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass-api.de/api/interpreter'
  ].filter(Boolean))];
  let lastError;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': process.env.OSM_USER_AGENT || 'ShebaConnect/1.0 (contact: admin@example.com)' },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(45000)
      });
      if (!response.ok) throw new Error(`Overpass request failed (${response.status})`);
      const data = await response.json();
      const offices = (data.elements || []).map((element) => {
    const tags = element.tags || {};
    const latitude = Number(element.lat ?? element.center?.lat);
    const longitude = Number(element.lon ?? element.center?.lon);
    if (!tags.name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'], tags['addr:city'], tags['addr:district']].filter(Boolean).join(', ') || tags['addr:full'] || tags['is_in'] || 'Address not available';
    return { osmType: element.type, osmId: String(element.id), name: tags.name, address, latitude, longitude, phone: tags.phone || tags['contact:phone'] || '', openingHours: tags.opening_hours || '', website: tags.website || '', distance: Math.round(distanceKm(lat, lng, latitude, longitude) * 10) / 10 };
      }).filter(Boolean).sort((a, b) => a.distance - b.distance);
      if (offices.length > 0) {
        cache.set(key, { offices, expiresAt: Date.now() + CACHE_TTL_MS });
        return offices;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  cache.set(key, { offices: [], expiresAt: Date.now() + 60000 });
  return [];
}

module.exports = { findNearbyOffices };
