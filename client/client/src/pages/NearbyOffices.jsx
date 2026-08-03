

// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   FaMapMarkerAlt, FaPhone, FaSpinner, FaLocationArrow,
//   FaChevronLeft, FaChevronDown, FaChevronUp
// } from 'react-icons/fa';

// // ─── Pulse Ring (green dot) ──────────────────────────────────────────────────
// function PulsePin() {
//   return (
//     <span className="relative flex h-3 w-3">
//       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//       <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
//     </span>
//   );
// }

// // ─── Distance Badge ──────────────────────────────────────────────────────────
// function DistanceBadge({ distance }) {
//   const isClose = distance < 2;
//   const fmt = distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase
//         ${isClose
//           ? 'bg-green-100 text-green-800 border border-green-200'
//           : 'bg-gray-100 text-gray-700 border border-gray-200'
//         }`}
//     >
//       <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
//         <circle cx="4" cy="4" r="4" fill={isClose ? '#10b981' : '#6b7280'} />
//       </svg>
//       {fmt}
//     </span>
//   );
// }

// // ─── Office Card ─────────────────────────────────────────────────────────────
// function OfficeCard({ office, index, userLocation }) {
//   const getDirectionsUrl = () => {
//     if (!userLocation) return '#';
//     return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${office.latitude},${office.longitude}&travelmode=driving`;
//   };

//   return (
//     <div
//       className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
//       style={{ animationDelay: `${index * 80}ms` }}
//     >
//       <div className="absolute top-4 right-4 text-gray-200 font-black text-4xl select-none pointer-events-none leading-none">
//         {String(index + 1).padStart(2, '0')}
//       </div>

//       <div className="p-6">
//         <div className="flex items-start gap-3 mb-4">
//           <div className="mt-1 flex-shrink-0 w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
//             <FaMapMarkerAlt className="text-blue-600 text-sm" />
//           </div>
//           <div className="flex-1 min-w-0 pr-8">
//             <h3 className="text-gray-900 font-bold text-lg leading-tight">{office.name}</h3>
//             <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{office.address}</p>
//           </div>
//         </div>

//         <div className="mb-5">
//           <DistanceBadge distance={office.distance} />
//         </div>

//         {office.phone && (
//           <div className="flex items-center gap-2 mb-5 text-sm text-gray-500 hover:text-gray-700 transition-colors group/phone">
//             <FaPhone className="text-gray-400 group-hover/phone:text-blue-500 transition-colors flex-shrink-0" />
//             <a href={`tel:${office.phone}`} className="hover:underline underline-offset-2">{office.phone}</a>
//           </div>
//         )}

//         <div className="flex gap-2.5 mt-auto pt-2 border-t border-gray-100">
//           <a
//             href={getDirectionsUrl()}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
//           >
//             <FaLocationArrow className="text-xs" />
//             Directions
//           </a>
//           {office.phone && (
//             <a
//               href={`tel:${office.phone}`}
//               className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 border border-gray-200"
//             >
//               <FaPhone className="text-xs" />
//               Call
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton Card ───────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse shadow-sm">
//       <div className="flex gap-3 mb-4">
//         <div className="w-9 h-9 rounded-xl bg-gray-200" />
//         <div className="flex-1 space-y-2">
//           <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
//           <div className="h-3 bg-gray-200 rounded-lg w-full" />
//           <div className="h-3 bg-gray-200 rounded-lg w-2/3" />
//         </div>
//       </div>
//       <div className="h-6 bg-gray-200 rounded-full w-20 mb-4" />
//       <div className="h-10 bg-gray-200 rounded-xl mt-6" />
//     </div>
//   );
// }

// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function NearbyOffices() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const searchParams = new URLSearchParams(location.search);
//   const serviceId = searchParams.get('serviceId');

//   const [offices, setOffices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [serviceName, setServiceName] = useState('');
//   const [sortBy, setSortBy] = useState('distance');
//   const [showManual, setShowManual] = useState(false);
//   const [manualLat, setManualLat] = useState('');
//   const [manualLng, setManualLng] = useState('');

//   // 1. Request location (clear error on success)
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser.');
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//         setLocationError(null); // ✅ clear error on success
//       },
//       (err) => {
//         console.warn('Geolocation error:', err);
//         setLocationError('Unable to retrieve your location. Please enable location access or enter coordinates manually.');
//       }
//     );
//   }, []);

//   // 2. Fetch offices when location is available
//   useEffect(() => {
//     if (!serviceId) {
//       setError('No service selected.');
//       return;
//     }
//     if (!userLocation) return;

//     const fetchOffices = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await axios.get('http://localhost:5000/api/offices/nearby', {
//           params: {
//             serviceId,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng
//           }
//         });
//         setOffices(res.data);
//         if (res.data.length > 0 && res.data[0].service) {
//           setServiceName(res.data[0].service.name);
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError('Failed to load nearby offices. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOffices();
//   }, [serviceId, userLocation]);

//   // 3. Manual location submission
//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     const lat = parseFloat(manualLat);
//     const lng = parseFloat(manualLng);
//     if (isNaN(lat) || isNaN(lng)) {
//       setLocationError('Please enter valid latitude and longitude numbers.');
//       return;
//     }
//     setUserLocation({ lat, lng });
//     setLocationError(null);
//     setShowManual(false);
//   };

//   const sortedOffices = [...offices].sort((a, b) =>
//     sortBy === 'distance' ? a.distance - b.distance : a.name.localeCompare(b.name)
//   );
//   const closestKm = offices.length
//     ? offices.reduce((min, o) => (o.distance < min ? o.distance : min), Infinity)
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors group"
//         >
//           <FaChevronLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
//           Back to Services
//         </button>

//         {/* Header */}
//         <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
//           <div className="flex items-center gap-2 mb-2">
//             <PulsePin />
//             <span className="text-emerald-200 text-xs font-bold tracking-widest uppercase">
//               {userLocation ? 'Location Active' : 'Detecting Location…'}
//             </span>
//           </div>
//           <h1 className="text-4xl font-bold mb-2">
//             {serviceName ? `${serviceName} Offices Near You` : 'Nearby Government Offices'}
//           </h1>
//           {offices.length > 0 && closestKm && (
//             <p className="text-blue-100 text-base">
//               {offices.length} office{offices.length > 1 ? 's' : ''} found — closest is{' '}
//               <span className="font-semibold text-white">
//                 {closestKm < 1 ? `${Math.round(closestKm * 1000)} m` : `${closestKm.toFixed(1)} km`}
//               </span> away
//             </p>
//           )}
//         </div>

//         {/* Stats */}
//         {offices.length > 0 && (
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
//               <p className="text-2xl font-bold text-blue-600">{offices.length}</p>
//               <p className="text-gray-500 text-xs uppercase tracking-widest">Total Found</p>
//             </div>
//             <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
//               <p className="text-2xl font-bold text-blue-600">
//                 {closestKm < 1 ? `${Math.round(closestKm * 1000)}m` : `${closestKm.toFixed(1)}km`}
//               </p>
//               <p className="text-gray-500 text-xs uppercase tracking-widest">Closest</p>
//             </div>
//             <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
//               <p className="text-2xl font-bold text-blue-600">{offices.filter(o => o.phone).length}</p>
//               <p className="text-gray-500 text-xs uppercase tracking-widest">With Phone</p>
//             </div>
//           </div>
//         )}

//         {/* Location error & manual fallback */}
//         {locationError && (
//           <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
//             <div className="flex items-start gap-3">
//               <div className="text-yellow-500 mt-1">⚠️</div>
//               <div className="flex-1">
//                 <p className="text-yellow-800 text-sm">{locationError}</p>
//                 <button
//                   onClick={() => setShowManual(!showManual)}
//                   className="text-sm text-yellow-700 underline mt-2 inline-flex items-center gap-1"
//                 >
//                   {showManual ? <FaChevronUp /> : <FaChevronDown />}
//                   {showManual ? 'Hide manual entry' : 'Enter coordinates manually'}
//                 </button>
//                 {showManual && (
//                   <form onSubmit={handleManualSubmit} className="mt-3 flex flex-wrap gap-2">
//                     <input
//                       type="text"
//                       placeholder="Latitude (e.g., 23.7779)"
//                       value={manualLat}
//                       onChange={(e) => setManualLat(e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Longitude (e.g., 90.3784)"
//                       value={manualLng}
//                       onChange={(e) => setManualLng(e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                     />
//                     <button
//                       type="submit"
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
//                     >
//                       Use This Location
//                     </button>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Sort controls */}
//         {offices.length > 1 && (
//           <div className="flex items-center gap-2 mb-6">
//             <span className="text-gray-500 text-xs uppercase tracking-widest">Sort:</span>
//             {['distance', 'name'].map(opt => (
//               <button
//                 key={opt}
//                 onClick={() => setSortBy(opt)}
//                 className={`text-xs font-semibold px-3 py-1.5 rounded-lg border capitalize transition-all
//                   ${sortBy === opt
//                     ? 'bg-blue-600 border-blue-500 text-white'
//                     : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
//                   }`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Loading skeletons */}
//         {(loading || (!userLocation && !locationError)) && (
//           <div className="grid md:grid-cols-2 gap-4">
//             {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
//             <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h3>
//             <p className="text-gray-500">{error}</p>
//             <button
//               onClick={() => navigate(-1)}
//               className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Go Back
//             </button>
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && !error && offices.length === 0 && userLocation && (
//           <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
//             <FaLocationArrow className="text-5xl text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">No offices found</h3>
//             <p className="text-gray-500">No offices are registered for this service yet.</p>
//           </div>
//         )}

//         {/* Office cards */}
//         {!loading && sortedOffices.length > 0 && (
//           <div className="grid md:grid-cols-2 gap-4">
//             {sortedOffices.map((office, i) => (
//               <OfficeCard
//                 key={office._id}
//                 office={office}
//                 index={i}
//                 userLocation={userLocation}
//               />
//             ))}
//           </div>
//         )}

//         {/* Footer note */}
//         {offices.length > 0 && (
//           <p className="text-center text-gray-400 text-xs mt-10">
//             Distances are calculated from your current GPS position
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }















import API from "../config/api";
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

    axios.get(`${API}/api/offices/nearby`, {
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