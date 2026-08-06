const axios = require('axios');

const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const OVERPASS_FALLBACK_URL = process.env.OVERPASS_FALLBACK_URL || 'https://overpass.kumi.systems/api/interpreter';
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_RADIUS_METERS = 25000;
const cache = new Map();

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRadians = (value) => value * Math.PI / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function classifyServiceForOfficeSearch(service) {
  const configuredKeywords = Array.isArray(service?.officeSearchKeywords)
    ? service.officeSearchKeywords.map((keyword) => String(keyword).trim()).filter(Boolean)
    : [];

  // Database-defined keywords take precedence, so an admin can tune an
  // individual service without changing application code.
  if (configuredKeywords.length) {
    return {
      category: service.officeSearchCategory?.trim() || 'custom',
      keywords: [...new Set(configuredKeywords.map((keyword) => keyword.toLowerCase()))]
    };
  }

  const value = `${service?.name || ''} ${service?.department || ''}`.toLowerCase();

  if (/(passport|epassport|e-passport)/.test(value)) {
    return { category: 'passport', keywords: ['passport', 'immigration', 'passport office'] };
  }

  if (/(nid|national id|national-id|voter|electoral)/.test(value)) {
    return { category: 'nid', keywords: ['nid', 'election', 'voter', 'national id', 'electoral'] };
  }

  if (/(driving|license|licence|brta|motor vehicle)/.test(value)) {
    return { category: 'driving', keywords: ['driving', 'license', 'licence', 'brta', 'motor vehicle'] };
  }

  // Do not use "certificate" by itself here: it also occurs in services such
  // as driving licence certificates, which belong to BRTA rather than civic
  // registration offices.
  if (/(birth|birth certificate|civil registration)/.test(value)) {
    return { category: 'birth', keywords: ['birth', 'certificate', 'registration', 'municipality', 'city corporation', 'union parishad', 'registrar'] };
  }

  if (value.includes('police')) {
    return { category: 'police', keywords: ['police'] };
  }

  if (value.includes('fire')) {
    return { category: 'fire', keywords: ['fire'] };
  }

  if (/(ambulance|health|hospital|clinic)/.test(value)) {
    return { category: 'health', keywords: ['hospital', 'health', 'clinic', 'ambulance'] };
  }

  if (/(electric|power|bidyut)/.test(value)) {
    return { category: 'utility', keywords: ['electric', 'power', 'palli bidyut', 'dpdc', 'desco', 'breb', 'reb', 'bpdb', 'nestco', 'wzpdcl'] };
  }

  if (/(road|transport|highway)/.test(value)) {
    return { category: 'transport', keywords: ['road', 'transport', 'highway'] };
  }

  if (/(education|school|college|university)/.test(value)) {
    return { category: 'education', keywords: ['education', 'school', 'college', 'university'] };
  }

  if (/(revenue|tax|land)/.test(value)) {
    return { category: 'revenue', keywords: ['revenue', 'tax', 'land'] };
  }

  if (/(waste|sanitation)/.test(value)) {
    return { category: 'waste', keywords: ['waste', 'sanitation'] };
  }

  return { category: 'general', keywords: ['government', 'municipality', 'city corporation', 'union parishad'] };
}

function queryFor(lat, lng, radius, service) {
  const { keywords } = classifyServiceForOfficeSearch(service);
  const regex = keywords.map(escapeRegex).join('|');
  return `[out:json][timeout:25];(nwr(around:${radius},${lat},${lng})["office"="government"]["name"~"${regex}",i];nwr(around:${radius},${lat},${lng})["office"="government"]["official_name"~"${regex}",i];nwr(around:${radius},${lat},${lng})["office"="government"]["operator"~"${regex}",i];nwr(around:${radius},${lat},${lng})["office"="government"]["government"~"${regex}",i];);out center 100;`;
}

function matchesServiceOffice(office, service) {
  if (!service) return true;

  const { keywords } = classifyServiceForOfficeSearch(service);
  const haystack = [
    office.name,
    office.address,
    office.phone,
    office.openingHours,
    office.website,
    office.searchText
  ].filter(Boolean).join(' ').toLowerCase();

  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function valueOf(element, name) {
  return element[name] ?? element.center?.[name];
}

function formatAddress(tags) {
  const parts = [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'], tags['addr:city'], tags['addr:district']].filter(Boolean);
  return parts.join(', ') || tags['addr:full'] || tags['is_in'] || 'Address not available';
}

function normalizeOffice(element, userLat, userLng) {
  const tags = element.tags || {};
  const latitude = Number(valueOf(element, 'lat'));
  const longitude = Number(valueOf(element, 'lon'));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !tags.name) return null;

  return {
    osmType: element.type,
    osmId: String(element.id),
    name: tags.name,
    address: formatAddress(tags),
    latitude,
    longitude,
    phone: tags.phone || tags['contact:phone'] || '',
    openingHours: tags.opening_hours || '',
    website: tags.website || tags['contact:website'] || '',
    searchText: [tags.alt_name, tags.official_name, tags.operator, tags.government, tags.brand].filter(Boolean).join(' '),
    distance: Math.round(haversineKm(userLat, userLng, latitude, longitude) * 10) / 10
  };
}

async function findNearbyOffices({ lat, lng, radius, service }) {
  const safeRadius = Math.min(Math.max(Number(radius) || 25000, 1000), MAX_RADIUS_METERS);
  const cacheKey = `${service._id}:${lat.toFixed(3)}:${lng.toFixed(3)}:${safeRadius}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.offices;

  const query = queryFor(lat, lng, safeRadius, service);
  // Public Overpass instances accept the query as a GET `data` parameter. The
  // previous POST target times out in many environments, which made a valid
  // service selection look like an empty result set.
  let response;
  let lastError;
  for (const endpoint of [OVERPASS_URL, OVERPASS_FALLBACK_URL]) {
    try {
      response = await axios.get(endpoint, {
        params: { data: query },
        timeout: 45000,
        headers: { 'User-Agent': process.env.OSM_USER_AGENT || 'ShebaConnect/1.0 (nearby government office lookup)' }
      });
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!response) throw lastError;
  const offices = (response.data.elements || [])
    .map((element) => normalizeOffice(element, lat, lng))
    .filter(Boolean)
    .filter((office) => matchesServiceOffice(office, service))
    .map(({ searchText, ...office }) => office)
    .sort((a, b) => a.distance - b.distance);

  cache.set(cacheKey, { offices, expiresAt: Date.now() + (offices.length ? CACHE_TTL_MS : 60000) });
  return offices;
}

module.exports = { findNearbyOffices, classifyServiceForOfficeSearch };
