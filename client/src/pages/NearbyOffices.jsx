

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaMapMarkerAlt, FaPhone, FaLocationArrow, FaChevronLeft,
  FaChevronDown, FaChevronUp, FaExclamationTriangle, FaRedo,
  FaRoute, FaBuilding, FaSortAmountDown, FaSearch
} from 'react-icons/fa';

// ── Build a free Google Maps directions URL (no API key needed) ───────────────
function buildDirectionsUrl(userLat, userLng, destLat, destLng, officeName) {
  var base = 'https://www.google.com/maps/dir/?api=1';
  var origin = '&origin=' + userLat + ',' + userLng;
  var dest   = '&destination=' + destLat + ',' + destLng;
  var mode   = '&travelmode=driving';
  return base + origin + dest + mode;
}

// Fallback: open office pin on Google Maps (when user location not available)
function buildMapPinUrl(lat, lng, name) {
  return 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(name) + '&query_place=' + lat + ',' + lng;
}

// ── Pulse dot ─────────────────────────────────────────────────────────────────
function PulseDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  );
}

// ── Distance badge ────────────────────────────────────────────────────────────
function DistanceBadge({ distance }) {
  var isClose  = distance < 3;
  var isMedium = distance >= 3 && distance < 10;
  var label    = distance < 1
    ? Math.round(distance * 1000) + ' m'
    : distance.toFixed(1) + ' km';

  var colorClass = isClose
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isMedium
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-gray-50 text-gray-600 border-gray-200';

  var dotColor = isClose ? '#10b981' : isMedium ? '#f59e0b' : '#9ca3af';

  return (
    <span className={'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ' + colorClass}>
      <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
        <circle cx="3" cy="3" r="3" fill={dotColor} />
      </svg>
      {label}
    </span>
  );
}

// ── Office Card ───────────────────────────────────────────────────────────────
function OfficeCard({ office, index, userLocation }) {
  var directionsUrl = userLocation
    ? buildDirectionsUrl(userLocation.lat, userLocation.lng, office.latitude, office.longitude, office.name)
    : buildMapPinUrl(office.latitude, office.longitude, office.name);

  var isNearest = index === 0;

  return (
    <div className={'relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-lg ' +
      (isNearest ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-gray-100 shadow-sm hover:border-gray-200')}>

      {/* Nearest badge */}
      {isNearest && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl tracking-wide">
            NEAREST
          </div>
        </div>
      )}

      {/* Rank watermark */}
      <div className="absolute bottom-4 right-4 text-gray-100 font-black text-5xl select-none pointer-events-none leading-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="p-5">
        {/* Icon + name + address */}
        <div className="flex items-start gap-3 mb-3 pr-14">
          <div className={'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ' +
            (isNearest ? 'bg-blue-600' : 'bg-gray-100 border border-gray-200')}>
            <FaBuilding className={'text-sm ' + (isNearest ? 'text-white' : 'text-gray-500')} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-semibold text-base leading-tight mb-0.5">{office.name}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{office.address}</p>
          </div>
        </div>

        {/* Distance + phone row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <DistanceBadge distance={office.distance} />
          {office.phone && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <FaPhone className="text-gray-300" style={{ fontSize: '9px' }} />
              {office.phone}
            </span>
          )}
        </div>

        {/* Opening hours */}
        {office.openingHours && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg mb-4">
            <span>🕐</span>
            <span>{office.openingHours}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Directions — opens Google Maps, completely free */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={'flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 ' +
              (userLocation
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                : 'bg-gray-500 hover:bg-gray-600 active:scale-95')}
          >
            {userLocation ? <FaRoute className="text-xs" /> : <FaMapMarkerAlt className="text-xs" />}
            {userLocation ? 'Get Directions' : 'View on Map'}
          </a>

          {/* Call */}
          {office.phone && (
            <a
              href={'tel:' + office.phone}
              className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium px-3 py-2.5 rounded-xl transition-all border border-gray-200 active:scale-95"
            >
              <FaPhone style={{ fontSize: '11px' }} />
              Call
            </a>
          )}
        </div>

        {/* Directions helper text */}
        {userLocation && (
          <p className="text-center text-gray-300 text-xs mt-2">
            Opens Google Maps from your location
          </p>
        )}
      </div>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse shadow-sm">
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded-full w-16 mb-4" />
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, color }) {
  var colorMap = {
    blue:    { val: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
    emerald: { val: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    amber:   { val: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
  };
  var c = colorMap[color] || colorMap.blue;
  return (
    <div className={'rounded-2xl p-4 text-center border ' + c.bg + ' ' + c.border}>
      <p className={'text-2xl font-bold ' + c.val}>{value}</p>
      <p className="text-gray-500 text-xs uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NearbyOffices() {
  var routerLocation = useLocation();
  var navigate       = useNavigate();
  var params         = new URLSearchParams(routerLocation.search);
  var serviceId      = params.get('serviceId');

  var officesState         = useState([]);
  var offices              = officesState[0];
  var setOffices           = officesState[1];

  var loadingState         = useState(false);
  var loading              = loadingState[0];
  var setLoading           = loadingState[1];

  var errorState           = useState(null);
  var error                = errorState[0];
  var setError             = errorState[1];

  var userLocState         = useState(null);
  var userLocation         = userLocState[0];
  var setUserLocation      = userLocState[1];

  var locLoadingState      = useState(true);
  var locLoading           = locLoadingState[0];
  var setLocLoading        = locLoadingState[1];

  var locErrorState        = useState(null);
  var locationError        = locErrorState[0];
  var setLocationError     = locErrorState[1];

  var serviceNameState     = useState('');
  var serviceName          = serviceNameState[0];
  var setServiceName       = serviceNameState[1];

  var sortByState          = useState('distance');
  var sortBy               = sortByState[0];
  var setSortBy            = sortByState[1];

  var searchState          = useState('');
  var searchTerm           = searchState[0];
  var setSearchTerm        = searchState[1];

  var showManualState      = useState(false);
  var showManual           = showManualState[0];
  var setShowManual        = showManualState[1];

  var manualLatState       = useState('');
  var manualLat            = manualLatState[0];
  var setManualLat         = manualLatState[1];

  var manualLngState       = useState('');
  var manualLng            = manualLngState[0];
  var setManualLng         = manualLngState[1];

  // ── Request GPS ─────────────────────────────────────────────────────────────
  function requestGPS() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocLoading(false);
      return;
    }
    setLocLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError(null);
        setLocLoading(false);
      },
      function(err) {
        console.warn('GPS error:', err);
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Please allow location access or enter coordinates manually.'
            : 'Unable to get your location. Try manual entry below.'
        );
        setLocLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  useEffect(function() { requestGPS(); }, []);

  // ── Fetch offices once GPS is ready ─────────────────────────────────────────
  useEffect(function() {
    if (!serviceId) { setError('No service selected.'); return; }
    if (!userLocation) return;

    setLoading(true);
    setError(null);

    axios.get('http://localhost:5000/api/offices/nearby', {
      params: { serviceId: serviceId, userLat: userLocation.lat, userLng: userLocation.lng }
    })
    .then(function(res) {
      setOffices(res.data);
      if (res.data.length > 0 && res.data[0].service) {
        setServiceName(res.data[0].service.name);
      }
    })
    .catch(function(err) {
      console.error('Fetch offices error:', err);
      setError('Failed to load offices. Please try again.');
    })
    .finally(function() {
      setLoading(false);
    });
  }, [serviceId, userLocation]);

  // ── Manual location submit ───────────────────────────────────────────────────
  function handleManualSubmit(e) {
    e.preventDefault();
    var lat = parseFloat(manualLat);
    var lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationError('Please enter valid coordinates. Latitude: -90 to 90, Longitude: -180 to 180.');
      return;
    }
    setUserLocation({ lat: lat, lng: lng });
    setLocationError(null);
    setShowManual(false);
  }

  // ── Derived values ───────────────────────────────────────────────────────────
  var filtered = offices.filter(function(o) {
    if (!searchTerm) return true;
    var q = searchTerm.toLowerCase();
    return (
      (o.name    && o.name.toLowerCase().indexOf(q)    !== -1) ||
      (o.address && o.address.toLowerCase().indexOf(q) !== -1)
    );
  });

  var sorted = filtered.slice().sort(function(a, b) {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.distance - b.distance;
  });

  var closestKm = offices.length
    ? offices.reduce(function(m, o) { return o.distance < m ? o.distance : m; }, Infinity)
    : null;

  function fmtDist(km) {
    if (km === null) return '—';
    return km < 1 ? Math.round(km * 1000) + 'm' : km.toFixed(1) + 'km';
  }

  var isIdle = !locLoading && !loading;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back button */}
          <button
            onClick={function() { navigate(-1); }}
            className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors group"
          >
            <FaChevronLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            Back to Services
          </button>

          {/* Location status */}
          <div className="flex items-center gap-2 mb-3">
            {userLocation ? <PulseDot /> : (
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
            )}
            <span className="text-xs font-semibold tracking-widest uppercase text-blue-200">
              {locLoading ? 'Detecting your location…'
                : userLocation ? 'Location active — Google Maps ready'
                : 'Location unavailable'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-1">
            {serviceName ? serviceName + ' Offices' : 'Nearby Government Offices'}
          </h1>
          <p className="text-blue-200 text-sm">
            {offices.length > 0
              ? offices.length + ' office' + (offices.length !== 1 ? 's' : '') + ' found near you' +
                (closestKm !== null ? ' · closest ' + fmtDist(closestKm) + ' away' : '')
              : 'Showing offices nearest to your location'}
          </p>

          {/* Your coordinates */}
          {userLocation && (
            <p className="text-blue-300 text-xs mt-1">
              📍 Your position: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Stats ── */}
        {offices.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <StatCard value={offices.length}    label="Total Found" color="blue" />
            <StatCard value={fmtDist(closestKm)} label="Closest"    color="emerald" />
            <StatCard
              value={offices.filter(function(o) { return o.phone; }).length}
              label="With Phone"
              color="amber"
            />
          </div>
        )}

        {/* ── Location error ── */}
        {locationError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-800 text-sm font-medium">{locationError}</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <button
                    onClick={requestGPS}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline"
                  >
                    <FaRedo className="text-xs" /> Retry GPS
                  </button>
                  <button
                    onClick={function() { setShowManual(!showManual); }}
                    className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:underline"
                  >
                    {showManual ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                    {showManual ? 'Hide' : 'Enter coordinates manually'}
                  </button>
                </div>

                {showManual && (
                  <form onSubmit={handleManualSubmit} className="mt-4 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text" placeholder="Latitude  (e.g. 23.8041)"
                        value={manualLat}
                        onChange={function(e) { setManualLat(e.target.value); }}
                        className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text" placeholder="Longitude (e.g. 90.4152)"
                        value={manualLng}
                        onChange={function(e) { setManualLng(e.target.value); }}
                        className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Use Location
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Tip for Dhaka: Latitude ≈ 23.8, Longitude ≈ 90.4
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── GPS detecting spinner ── */}
        {locLoading && !userLocation && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent flex-shrink-0" />
            <div>
              <p className="text-blue-700 text-sm font-medium">Getting your GPS location…</p>
              <p className="text-blue-400 text-xs mt-0.5">Please allow location access when prompted</p>
            </div>
          </div>
        )}

        {/* ── Search + sort bar ── */}
        {offices.length > 1 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input
                type="text"
                placeholder="Search offices by name or address…"
                value={searchTerm}
                onChange={function(e) { setSearchTerm(e.target.value); }}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="text-gray-400 text-sm flex-shrink-0" />
              {['distance', 'name'].map(function(opt) {
                var cls = 'text-xs font-semibold px-4 py-2.5 rounded-xl border capitalize transition-all ' +
                  (sortBy === opt
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50');
                return (
                  <button key={opt} onClick={function() { setSortBy(opt); }} className={cls}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {(loading || locLoading) && !error && (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(function(i) { return <SkeletonCard key={i} />; })}
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-red-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-400 text-sm mb-5">{error}</p>
            <button
              onClick={function() { navigate(-1); }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium"
            >
              Go Back
            </button>
          </div>
        )}

        {/* ── Empty: location known but no offices ── */}
        {isIdle && !error && offices.length === 0 && userLocation && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBuilding className="text-blue-300 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No offices found</h3>
            <p className="text-gray-400 text-sm">No offices are registered for this service yet.</p>
            <p className="text-gray-300 text-xs mt-1">Add offices in MongoDB Compass with the correct serviceId.</p>
          </div>
        )}

        {/* ── Search: no matches ── */}
        {isIdle && !error && offices.length > 0 && sorted.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <FaSearch className="text-gray-300 text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No offices match your search.</p>
            <button
              onClick={function() { setSearchTerm(''); }}
              className="text-blue-500 text-sm mt-2 hover:underline"
            >Clear search</button>
          </div>
        )}

        {/* ── Office cards ── */}
        {!loading && !locLoading && sorted.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {sorted.map(function(office, i) {
              return (
                <OfficeCard
                  key={office._id}
                  office={office}
                  index={i}
                  userLocation={userLocation}
                />
              );
            })}
          </div>
        )}

        {/* ── Footer note ── */}
        {offices.length > 0 && userLocation && (
          <p className="text-center text-gray-300 text-xs mt-10 pb-4">
            Distances calculated from your GPS · Directions open Google Maps (free, no API key)
          </p>
        )}

      </div>
    </div>
  );
}