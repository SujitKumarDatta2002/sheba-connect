

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaMapMarkerAlt, FaPhone, FaSpinner, FaLocationArrow,
  FaChevronLeft, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

// ─── Pulse Ring (green dot) ──────────────────────────────────────────────────
function PulsePin() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
    </span>
  );
}

// ─── Distance Badge ──────────────────────────────────────────────────────────
function DistanceBadge({ distance }) {
  const isClose = distance < 2;
  const fmt = distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase
        ${isClose
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <circle cx="4" cy="4" r="4" fill={isClose ? '#10b981' : '#6b7280'} />
      </svg>
      {fmt}
    </span>
  );
}

// ─── Office Card ─────────────────────────────────────────────────────────────
function OfficeCard({ office, index, userLocation }) {
  const getDirectionsUrl = () => {
    if (!userLocation) return '#';
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${office.latitude},${office.longitude}&travelmode=driving`;
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute top-4 right-4 text-gray-200 font-black text-4xl select-none pointer-events-none leading-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-1 flex-shrink-0 w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
            <FaMapMarkerAlt className="text-blue-600 text-sm" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="text-gray-900 font-bold text-lg leading-tight">{office.name}</h3>
            <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{office.address}</p>
          </div>
        </div>

        <div className="mb-5">
          <DistanceBadge distance={office.distance} />
        </div>

        {office.phone && (
          <div className="flex items-center gap-2 mb-5 text-sm text-gray-500 hover:text-gray-700 transition-colors group/phone">
            <FaPhone className="text-gray-400 group-hover/phone:text-blue-500 transition-colors flex-shrink-0" />
            <a href={`tel:${office.phone}`} className="hover:underline underline-offset-2">{office.phone}</a>
          </div>
        )}

        <div className="flex gap-2.5 mt-auto pt-2 border-t border-gray-100">
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
          >
            <FaLocationArrow className="text-xs" />
            Directions
          </a>
          {office.phone && (
            <a
              href={`tel:${office.phone}`}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 border border-gray-200"
            >
              <FaPhone className="text-xs" />
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse shadow-sm">
      <div className="flex gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-3 bg-gray-200 rounded-lg w-full" />
          <div className="h-3 bg-gray-200 rounded-lg w-2/3" />
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20 mb-4" />
      <div className="h-10 bg-gray-200 rounded-xl mt-6" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function NearbyOffices() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const serviceId = searchParams.get('serviceId');

  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showManual, setShowManual] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // 1. Request location (clear error on success)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError(null); // ✅ clear error on success
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError('Unable to retrieve your location. Please enable location access or enter coordinates manually.');
      }
    );
  }, []);

  // 2. Fetch offices when location is available
  useEffect(() => {
    if (!serviceId) {
      setError('No service selected.');
      return;
    }
    if (!userLocation) return;

    const fetchOffices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/offices/nearby', {
          params: {
            serviceId,
            userLat: userLocation.lat,
            userLng: userLocation.lng
          }
        });
        setOffices(res.data);
        if (res.data.length > 0 && res.data[0].service) {
          setServiceName(res.data[0].service.name);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load nearby offices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffices();
  }, [serviceId, userLocation]);

  // 3. Manual location submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      setLocationError('Please enter valid latitude and longitude numbers.');
      return;
    }
    setUserLocation({ lat, lng });
    setLocationError(null);
    setShowManual(false);
  };

  const sortedOffices = [...offices].sort((a, b) =>
    sortBy === 'distance' ? a.distance - b.distance : a.name.localeCompare(b.name)
  );
  const closestKm = offices.length
    ? offices.reduce((min, o) => (o.distance < min ? o.distance : min), Infinity)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors group"
        >
          <FaChevronLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
          Back to Services
        </button>

        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <PulsePin />
            <span className="text-emerald-200 text-xs font-bold tracking-widest uppercase">
              {userLocation ? 'Location Active' : 'Detecting Location…'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {serviceName ? `${serviceName} Offices Near You` : 'Nearby Government Offices'}
          </h1>
          {offices.length > 0 && closestKm && (
            <p className="text-blue-100 text-base">
              {offices.length} office{offices.length > 1 ? 's' : ''} found — closest is{' '}
              <span className="font-semibold text-white">
                {closestKm < 1 ? `${Math.round(closestKm * 1000)} m` : `${closestKm.toFixed(1)} km`}
              </span> away
            </p>
          )}
        </div>

        {/* Stats */}
        {offices.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <p className="text-2xl font-bold text-blue-600">{offices.length}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Total Found</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <p className="text-2xl font-bold text-blue-600">
                {closestKm < 1 ? `${Math.round(closestKm * 1000)}m` : `${closestKm.toFixed(1)}km`}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Closest</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <p className="text-2xl font-bold text-blue-600">{offices.filter(o => o.phone).length}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">With Phone</p>
            </div>
          </div>
        )}

        {/* Location error & manual fallback */}
        {locationError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-yellow-500 mt-1">⚠️</div>
              <div className="flex-1">
                <p className="text-yellow-800 text-sm">{locationError}</p>
                <button
                  onClick={() => setShowManual(!showManual)}
                  className="text-sm text-yellow-700 underline mt-2 inline-flex items-center gap-1"
                >
                  {showManual ? <FaChevronUp /> : <FaChevronDown />}
                  {showManual ? 'Hide manual entry' : 'Enter coordinates manually'}
                </button>
                {showManual && (
                  <form onSubmit={handleManualSubmit} className="mt-3 flex flex-wrap gap-2">
                    <input
                      type="text"
                      placeholder="Latitude (e.g., 23.7779)"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Longitude (e.g., 90.3784)"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      Use This Location
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sort controls */}
        {offices.length > 1 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Sort:</span>
            {['distance', 'name'].map(opt => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border capitalize transition-all
                  ${sortBy === opt
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Loading skeletons */}
        {(loading || (!userLocation && !locationError)) && (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h3>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && offices.length === 0 && userLocation && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaLocationArrow className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No offices found</h3>
            <p className="text-gray-500">No offices are registered for this service yet.</p>
          </div>
        )}

        {/* Office cards */}
        {!loading && sortedOffices.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {sortedOffices.map((office, i) => (
              <OfficeCard
                key={office._id}
                office={office}
                index={i}
                userLocation={userLocation}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        {offices.length > 0 && (
          <p className="text-center text-gray-400 text-xs mt-10">
            Distances are calculated from your current GPS position
          </p>
        )}
      </div>
    </div>
  );
}

