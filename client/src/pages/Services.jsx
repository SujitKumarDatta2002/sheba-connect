

// // import { useState, useEffect, useCallback } from 'react';
// // import { Link } from 'react-router-dom';
// // import axios from 'axios';
// // import {
// //   FaSearch, FaFilter, FaPhone, FaTimes, FaChevronDown,
// //   FaExclamationTriangle, FaAmbulance, FaFire, FaShieldAlt,
// //   FaBolt, FaRoad, FaHospital, FaSchool, FaCity, FaGlobe,
// //   FaExternalLinkAlt, FaInfoCircle, FaRegClock, FaDollarSign,
// //   FaEnvelope, FaMapMarkerAlt
// // } from 'react-icons/fa';

// // // ── Constants ───────────────────────────────────────────────────────────────

// // const DEPARTMENTS = [
// //   'Passport Office','Electricity','Road Maintenance','Waste Management',
// //   'Health Services','Education','Revenue','Municipal Services',
// //   'Police','Fire Service','Ambulance'
// // ];
// // const URGENCY_LEVELS = ['low','medium','high','emergency'];
// // const DOCUMENT_OPTIONS = [
// //   { value:'nid',                    label:'NID' },
// //   { value:'birthCertificate',       label:'Birth Certificate' },
// //   { value:'passport',               label:'Passport' },
// //   { value:'drivingLicense',         label:'Driving License' },
// //   { value:'tin',                    label:'TIN' },
// //   { value:'citizenship',            label:'Citizenship' },
// //   { value:'educationalCertificate', label:'Educational Certificate' },
// // ];
// // const HELPLINE_CATEGORIES = [
// //   'Emergency','Police','Fire','Ambulance','Health','Education',
// //   'Electricity','Road','Waste','Municipal','Passport','Revenue',
// //   'Women & Children','Disaster Management'
// // ];
// // const HELPLINE_CATEGORY_LABELS = {
// //   Fire:'Fire Service', Road:'Road & Transport',
// //   Waste:'Waste Management', Municipal:'Municipal Services',
// // };
// // const EMPTY_FILTERS = {
// //   department:'', urgency:'', minCost:'', maxCost:'',
// //   processingTime:'', requiredDocuments:[], search:''
// // };
// // const costFormatter = new Intl.NumberFormat('bn-BD', { style:'currency', currency:'BDT' });

// // // Per-department color palette
// // const DEPT_COLOR = {
// //   'Passport Office':    { bg:'#EEEDFE', stroke:'#534AB7', text:'#534AB7' },
// //   'Electricity':        { bg:'#FAEEDA', stroke:'#BA7517', text:'#854F0B' },
// //   'Road Maintenance':   { bg:'#F1EFE8', stroke:'#5F5E5A', text:'#444441' },
// //   'Waste Management':   { bg:'#EAF3DE', stroke:'#3B6D11', text:'#27500A' },
// //   'Health Services':    { bg:'#FCEBEB', stroke:'#A32D2D', text:'#791F1F' },
// //   'Education':          { bg:'#EEEDFE', stroke:'#534AB7', text:'#3C3489' },
// //   'Revenue':            { bg:'#E1F5EE', stroke:'#0F6E56', text:'#085041' },
// //   'Municipal Services': { bg:'#E6F1FB', stroke:'#185FA5', text:'#0C447C' },
// //   'Police':             { bg:'#E6F1FB', stroke:'#185FA5', text:'#0C447C' },
// //   'Fire Service':       { bg:'#FAECE7', stroke:'#993C1D', text:'#712B13' },
// //   'Ambulance':          { bg:'#FCEBEB', stroke:'#A32D2D', text:'#791F1F' },
// //   default:              { bg:'#F1EFE8', stroke:'#5F5E5A', text:'#444441' },
// // };
// // const URGENCY_PILL = {
// //   low:       { bg:'#EAF3DE', text:'#27500A', label:'Low' },
// //   medium:    { bg:'#FAEEDA', text:'#633806', label:'Medium' },
// //   high:      { bg:'#FAECE7', text:'#712B13', label:'High' },
// //   emergency: { bg:'#FCEBEB', text:'#791F1F', label:'Emergency' },
// // };
// // // Rotating palette for document tags
// // const DOC_TAG_COLORS = [
// //   { bg:'#EEEDFE', text:'#3C3489' },
// //   { bg:'#E1F5EE', text:'#085041' },
// //   { bg:'#FAEEDA', text:'#412402' },
// //   { bg:'#E6F1FB', text:'#0C447C' },
// //   { bg:'#FAECE7', text:'#712B13' },
// //   { bg:'#EAF3DE', text:'#27500A' },
// //   { bg:'#FBEAF0', text:'#72243E' },
// // ];
// // // Per-category helpline styles
// // const CATEGORY_STYLES = {
// //   Emergency:   { icon:FaExclamationTriangle, hdrBg:'#FCEBEB', iconBg:'#A32D2D', catText:'#791F1F', numBg:'#FCEBEB', numText:'#791F1F', numStroke:'#A32D2D' },
// //   Police:      { icon:FaShieldAlt,           hdrBg:'#E6F1FB', iconBg:'#185FA5', catText:'#0C447C', numBg:'#E6F1FB', numText:'#0C447C', numStroke:'#185FA5' },
// //   Fire:        { icon:FaFire,                hdrBg:'#FAECE7', iconBg:'#993C1D', catText:'#712B13', numBg:'#FAECE7', numText:'#712B13', numStroke:'#993C1D' },
// //   Ambulance:   { icon:FaAmbulance,           hdrBg:'#EAF3DE', iconBg:'#3B6D11', catText:'#27500A', numBg:'#EAF3DE', numText:'#27500A', numStroke:'#3B6D11' },
// //   Electricity: { icon:FaBolt,                hdrBg:'#FAEEDA', iconBg:'#BA7517', catText:'#854F0B', numBg:'#FAEEDA', numText:'#633806', numStroke:'#BA7517' },
// //   Road:        { icon:FaRoad,                hdrBg:'#F1EFE8', iconBg:'#5F5E5A', catText:'#444441', numBg:'#F1EFE8', numText:'#444441', numStroke:'#5F5E5A' },
// //   Health:      { icon:FaHospital,            hdrBg:'#FCEBEB', iconBg:'#A32D2D', catText:'#791F1F', numBg:'#FCEBEB', numText:'#791F1F', numStroke:'#A32D2D' },
// //   Education:   { icon:FaSchool,              hdrBg:'#EEEDFE', iconBg:'#534AB7', catText:'#3C3489', numBg:'#EEEDFE', numText:'#26215C', numStroke:'#534AB7' },
// //   Municipal:   { icon:FaCity,                hdrBg:'#E6F1FB', iconBg:'#185FA5', catText:'#0C447C', numBg:'#E6F1FB', numText:'#0C447C', numStroke:'#185FA5' },
// //   Passport:    { icon:FaGlobe,               hdrBg:'#EEEDFE', iconBg:'#534AB7', catText:'#3C3489', numBg:'#EEEDFE', numText:'#26215C', numStroke:'#534AB7' },
// //   Revenue:     { icon:FaDollarSign,           hdrBg:'#E1F5EE', iconBg:'#0F6E56', catText:'#085041', numBg:'#E1F5EE', numText:'#085041', numStroke:'#0F6E56' },
// //   default:     { icon:FaPhone,               hdrBg:'#F1EFE8', iconBg:'#5F5E5A', catText:'#444441', numBg:'#F1EFE8', numText:'#444441', numStroke:'#5F5E5A' },
// // };

// // // ── Inline SVG icons (removes react-icons dependency for card body) ──────────

// // const IconClock    = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5v2.8l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
// // const IconPerson   = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
// // const IconPin      = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><path d="M7 1.5a3.5 3.5 0 00-3.5 3.5c0 3 3.5 7.5 3.5 7.5s3.5-4.5 3.5-7.5A3.5 3.5 0 007 1.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>;
// // const IconDoc      = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><rect x="2.5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5h4M5 7.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
// // const IconCheck    = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
// // const IconWeb      = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 2.5c-1.5 1.5-2.5 3.5-2.5 5.5s1 4 2.5 5.5M8 2.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
// // const IconPhone    = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 3h3.5l1.2 3.5-1.7 1.2a8 8 0 003.3 3.3l1.2-1.7L14 10.5V13c0 .8-.8 1.5-1.5 1.5C5.5 14.5 1.5 10.5 1.5 4.5 1.5 3.8 2.2 3 3 3z" stroke="currentColor" strokeWidth="1.3"/></svg>;
// // const IconMail     = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
// // const IconMap      = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 1.5a4 4 0 00-4 4c0 3.5 4 9 4 9s4-5.5 4-9a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
// // const IconArrow    = () => <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;

// // // ── MetaRow — one info row inside a service card ────────────────────────────

// // function MetaRow({ iconBg, icon: IconComp, label, children }) {
// //   return (
// //     <div className="flex items-start gap-2">
// //       <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: iconBg, color: 'inherit' }}>
// //         <IconComp />
// //       </span>
// //       <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{label}</span>
// //       <div className="flex-1 min-w-0 pt-0.5">{children}</div>
// //     </div>
// //   );
// // }

// // // ── ActionBtn — footer button for service card ──────────────────────────────

// // function ActionBtn({ href, to, bg, color, IconComp, label, disabled }) {
// //   const cls = "flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all";
// //   const style = disabled
// //     ? { background:'var(--color-background-secondary)', color:'var(--color-text-tertiary)', opacity:0.38, cursor:'not-allowed' }
// //     : { background: bg, color };

// //   if (disabled) return <span className={cls} style={style}><IconComp />{label}</span>;
// //   if (to) return <Link to={to} className={`${cls} hover:-translate-y-0.5`} style={style}><IconComp />{label}</Link>;
// //   return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`${cls} hover:-translate-y-0.5`} style={style}><IconComp />{label}</a>;
// // }

// // // ── Main component ──────────────────────────────────────────────────────────

// // export default function Services() {
// //   const [activeTab, setActiveTab]   = useState('services');
// //   const [services, setServices]     = useState([]);
// //   const [helplines, setHelplines]   = useState([]);
// //   const [loading, setLoading]       = useState(false);
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [filters, setFilters]       = useState(EMPTY_FILTERS);
// //   const [helplineSearch, setHelplineSearch]     = useState('');
// //   const [helplineCategory, setHelplineCategory] = useState('');

// //   const fetchServices = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const params = new URLSearchParams();
// //       Object.entries(filters).forEach(([k, v]) => {
// //         if (Array.isArray(v) ? v.length : v)
// //           params.append(k, Array.isArray(v) ? v.join(',') : v);
// //       });
// //       const res = await axios.get(`http://localhost:5000/api/services?${params}`);
// //       setServices(res.data);
// //     } catch (err) { console.error('Error fetching services:', err); }
// //     finally { setLoading(false); }
// //   }, [filters]);

// //   const fetchHelplines = useCallback(async () => {
// //     try {
// //       const params = new URLSearchParams();
// //       if (helplineCategory) params.append('category', helplineCategory);
// //       if (helplineSearch)   params.append('search',   helplineSearch);
// //       const res = await axios.get(`http://localhost:5000/api/helplines?${params}`);
// //       setHelplines(res.data);
// //     } catch (err) { console.error('Error fetching helplines:', err); }
// //   }, [helplineCategory, helplineSearch]);

// //   useEffect(() => {
// //     activeTab === 'services' ? fetchServices() : fetchHelplines();
// //   }, [activeTab, fetchServices, fetchHelplines]);

// //   const toggleDocument = (doc) =>
// //     setFilters(prev => ({
// //       ...prev,
// //       requiredDocuments: prev.requiredDocuments.includes(doc)
// //         ? prev.requiredDocuments.filter(d => d !== doc)
// //         : [...prev.requiredDocuments, doc]
// //     }));

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8">
// //       <div className="container mx-auto px-4 sm:px-6 lg:px-8">

// //         {/* Header */}
// //         <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
// //           <h1 className="text-4xl font-bold mb-2">Service & Helpline Directory</h1>
// //           <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
// //         </div>

// //         {/* Tabs */}
// //         <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
// //           {[['services','Government Services'],['helplines','Emergency & Departmental Helplines']].map(([tab, lbl]) => (
// //             <button key={tab} onClick={() => setActiveTab(tab)}
// //               className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
// //                 activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
// //               }`}>
// //               {lbl}
// //             </button>
// //           ))}
// //         </div>

// //         {/* ════════════════ SERVICES TAB ════════════════ */}
// //         {activeTab === 'services' && (
// //           <>
// //             {/* Search + filter bar */}
// //             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
// //               <div className="flex flex-col lg:flex-row gap-4">
// //                 <div className="flex-1 relative">
// //                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
// //                   <input type="text" placeholder="Search services by name or description..."
// //                     value={filters.search}
// //                     onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
// //                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button onClick={() => setShowFilters(s => !s)}
// //                     className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition ${
// //                       showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
// //                     }`}>
// //                     <FaFilter /><span>Filters</span>
// //                     <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
// //                   </button>
// //                   <button onClick={() => setFilters(EMPTY_FILTERS)}
// //                     className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2">
// //                     <FaTimes /><span>Clear</span>
// //                   </button>
// //                 </div>
// //               </div>

// //               {showFilters && (
// //                 <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
// //                     <select value={filters.department}
// //                       onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
// //                       <option value="">All Departments</option>
// //                       {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
// //                     </select>
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
// //                     <select value={filters.urgency}
// //                       onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
// //                       <option value="">All</option>
// //                       {URGENCY_LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
// //                     </select>
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
// //                     <div className="flex gap-2">
// //                       {['minCost','maxCost'].map(k => (
// //                         <input key={k} type="number" placeholder={k==='minCost'?'Min':'Max'}
// //                           value={filters[k]}
// //                           onChange={e => setFilters(f => ({ ...f, [k]: e.target.value }))}
// //                           className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       ))}
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
// //                     <input type="text" placeholder="e.g., 3-5 days" value={filters.processingTime}
// //                       onChange={e => setFilters(f => ({ ...f, processingTime: e.target.value }))}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   </div>
// //                   <div className="md:col-span-2 lg:col-span-3">
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
// //                     <div className="flex flex-wrap gap-2">
// //                       {DOCUMENT_OPTIONS.map(doc => (
// //                         <button key={doc.value} onClick={() => toggleDocument(doc.value)}
// //                           className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
// //                             filters.requiredDocuments.includes(doc.value)
// //                               ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                           }`}>
// //                           {doc.label}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* ── Service cards ── */}
// //             {loading ? (
// //               <div className="flex justify-center py-12">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
// //               </div>
// //             ) : services.length === 0 ? (
// //               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
// //                 <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
// //                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
// //                 <p className="text-gray-500">Try adjusting your filters or search term</p>
// //               </div>
// //             ) : (
// //               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
// //                 {services.map(service => {
// //                   const dept = DEPT_COLOR[service.department] || DEPT_COLOR.default;
// //                   const urg  = URGENCY_PILL[service.urgency]  || URGENCY_PILL.medium;

// //                   return (
// //                     <div key={service._id}
// //                       className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md"
// //                       style={{ height: '420px' }}        // ← fixed height — all cards same size
// //                     >
// //                       {/* Header */}
// //                       <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
// //                         <div className="flex items-center gap-2 mb-2.5">
// //                           <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
// //                             style={{ background: dept.bg }}>
// //                             {/* Department icon */}
// //                             <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
// //                               <rect x="1.5" y="2" width="11" height="10" rx="1.2" stroke={dept.stroke} strokeWidth="1.2"/>
// //                               <path d="M4.5 6.5h5M4.5 9h3" stroke={dept.stroke} strokeWidth="1.1" strokeLinecap="round"/>
// //                             </svg>
// //                           </span>
// //                           <span className="text-xs font-medium truncate" style={{ color: dept.text }}>{service.department}</span>
// //                           <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0"
// //                             style={{ background: urg.bg, color: urg.text }}>{urg.label}</span>
// //                         </div>
// //                         <h3 className="text-sm font-semibold text-gray-800 leading-snug truncate">{service.name}</h3>
// //                         <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{service.description}</p>
// //                       </div>

// //                       {/* Body — fixed rows, overflow hidden so layout never breaks */}
// //                       <div className="px-4 py-3 flex flex-col gap-2.5 flex-1 overflow-hidden">
// //                         <MetaRow iconBg="#EAF3DE" icon={IconClock} label="Processing">
// //                           <span className="text-xs font-medium text-gray-700">{service.processingTime}</span>
// //                         </MetaRow>
// //                         <MetaRow iconBg="#E1F5EE" icon={IconPerson} label="Eligibility">
// //                           <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.eligibilityCriteria}</span>
// //                         </MetaRow>
// //                         {service.location && (
// //                           <MetaRow iconBg="#FBEAF0" icon={IconPin} label="Location">
// //                             <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.location}</span>
// //                           </MetaRow>
// //                         )}
// //                         <div className="h-px bg-gray-100 my-0.5 flex-shrink-0" />
// //                         <MetaRow iconBg="#EEEDFE" icon={IconDoc} label="Documents">
// //                           <div className="flex flex-wrap gap-1">
// //                             {service.requiredDocuments.length > 0
// //                               ? service.requiredDocuments.map((doc, i) => {
// //                                   const c = DOC_TAG_COLORS[i % DOC_TAG_COLORS.length];
// //                                   return (
// //                                     <span key={doc} className="px-1.5 py-px rounded text-xs font-medium"
// //                                       style={{ background: c.bg, color: c.text }}>
// //                                       {DOCUMENT_OPTIONS.find(d => d.value === doc)?.label || doc}
// //                                     </span>
// //                                   );
// //                                 })
// //                               : <span className="text-xs text-gray-400">None required</span>
// //                             }
// //                           </div>
// //                         </MetaRow>
// //                         <MetaRow iconBg="#E1F5EE" icon={IconCheck} label="Cost">
// //                           <span className="text-sm font-semibold" style={{ color:'#0F6E56' }}>
// //                             {costFormatter.format(service.cost)}
// //                           </span>
// //                         </MetaRow>
// //                       </div>

// //                       {/* Footer actions */}
// //                       <div className="grid grid-cols-4 gap-1.5 px-3 pb-3 flex-shrink-0">
// //                         <ActionBtn href={service.website} bg="#E6F1FB" color="#0C447C" IconComp={IconWeb}   label="Website" disabled={!service.website} />
// //                         <ActionBtn href={service.helpline ? `tel:${service.helpline}` : null} bg="#EAF3DE" color="#27500A" IconComp={IconPhone} label="Call" disabled={!service.helpline} />
// //                         <ActionBtn href={service.email ? `mailto:${service.email}` : null} bg="#EEEDFE" color="#26215C" IconComp={IconMail} label="Email" disabled={!service.email} />
// //                         <ActionBtn to={`/nearby?serviceId=${service._id}`} bg="#FCEBEB" color="#791F1F" IconComp={IconMap} label="Map" />
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             )}
// //           </>
// //         )}

// //         {/* ════════════════ HELPLINES TAB ════════════════ */}
// //         {activeTab === 'helplines' && (
// //           <>
// //             {/* Search + category */}
// //             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
// //               <div className="flex flex-col md:flex-row gap-4">
// //                 <div className="flex-1 relative">
// //                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
// //                   <input type="text" placeholder="Search helplines by name or description..."
// //                     value={helplineSearch} onChange={e => setHelplineSearch(e.target.value)}
// //                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //                 <select value={helplineCategory} onChange={e => setHelplineCategory(e.target.value)}
// //                   className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
// //                   <option value="">All Categories</option>
// //                   {HELPLINE_CATEGORIES.map(c => (
// //                     <option key={c} value={c}>{HELPLINE_CATEGORY_LABELS[c] || c}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             {/* ── Helpline cards ── */}
// //             {helplines.length === 0 ? (
// //               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
// //                 <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
// //                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No helplines found</h3>
// //                 <p className="text-gray-500">Try a different category or search term</p>
// //               </div>
// //             ) : (
// //               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
// //                 {helplines.map(helpline => {
// //                   const s = CATEGORY_STYLES[helpline.category] || CATEGORY_STYLES.default;
// //                   const Icon = s.icon;
// //                   return (
// //                     <div key={helpline._id}
// //                       className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md"
// //                     >
// //                       {/* Colored header */}
// //                       <div className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
// //                         style={{ background: s.hdrBg }}>
// //                         <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
// //                           style={{ background: s.iconBg }}>
// //                           <Icon className="w-5 h-5 text-white" />
// //                         </div>
// //                         <div className="flex-1 min-w-0">
// //                           <h3 className="text-sm font-semibold text-gray-800 truncate">{helpline.name}</h3>
// //                           <p className="text-xs font-medium mt-0.5" style={{ color: s.catText }}>{helpline.category}</p>
// //                         </div>
// //                         {/* Emergency / 24x7 badges in header */}
// //                         <div className="flex flex-col gap-1 flex-shrink-0">
// //                           {helpline.isEmergency && (
// //                             <span className="px-2 py-0.5 rounded-full text-xs font-medium"
// //                               style={{ background:'#FCEBEB', color:'#791F1F' }}>Emergency</span>
// //                           )}
// //                           {helpline.available24x7 && (
// //                             <span className="px-2 py-0.5 rounded-full text-xs font-medium"
// //                               style={{ background:'#EAF3DE', color:'#27500A' }}>24/7</span>
// //                           )}
// //                         </div>
// //                       </div>

// //                       {/* Numbers */}
// //                       <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
// //                         <p className="text-xs font-medium tracking-widest text-gray-400">CONTACT</p>
// //                         {helpline.numbers.map((num, i) => (
// //                           <a key={i} href={`tel:${num}`}
// //                             className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80 group"
// //                             style={{ background: s.numBg }}>
// //                             <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink:0 }}>
// //                               <path d="M2.5 2.5h3l1 3-1.5 1A7 7 0 008.5 10l1-1.5 3 1V12c0 .6-.5 1-1 1C4 13 1 10 1 5.5c0-.5.5-1 1-1l.5-2z"
// //                                 stroke={s.numStroke} strokeWidth="1.2"/>
// //                             </svg>
// //                             <span className="text-sm font-semibold flex-1" style={{ color: s.numText }}>{num}</span>
// //                             <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: s.numText }}/>
// //                           </a>
// //                         ))}
// //                       </div>

// //                       {/* Website */}
// //                       {helpline.website && (
// //                         <div className="px-4 pb-2">
// //                           <a href={helpline.website} target="_blank" rel="noopener noreferrer"
// //                             className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition group">
// //                             <FaGlobe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
// //                             <span className="text-xs font-medium text-gray-600 flex-1 truncate">Visit official website</span>
// //                             <FaExternalLinkAlt className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
// //                           </a>
// //                         </div>
// //                       )}

// //                       {/* Description */}
// //                       {helpline.description && (
// //                         <div className="px-4 pb-3">
// //                           <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg leading-relaxed line-clamp-2">
// //                             <FaInfoCircle className="inline mr-1 text-gray-400" />{helpline.description}
// //                           </p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             )}
// //           </>
// //         )}

// //       </div>
// //     </div>
// //   );
// // }










import API from "../config/api";
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch, FaFilter, FaPhone, FaTimes, FaChevronDown,
  FaExclamationTriangle, FaAmbulance, FaFire, FaShieldAlt,
  FaBolt, FaRoad, FaHospital, FaSchool, FaCity, FaGlobe,
  FaExternalLinkAlt, FaInfoCircle, FaDollarSign, FaPaperPlane
} from 'react-icons/fa';

// ── Constants ────────────────────────────────────────────────────────────────

var ADMIN_CC_EMAIL = 'anrikanrik728@gmail.com';

var DEPARTMENTS = [
  'Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management',
  'Health Services', 'Education', 'Revenue', 'Municipal Services',
  'Police', 'Fire Service', 'Ambulance'
];
var URGENCY_LEVELS = ['low', 'medium', 'high', 'emergency'];
var DOCUMENT_OPTIONS = [
  { value: 'nid',                    label: 'NID' },
  { value: 'birthCertificate',       label: 'Birth Certificate' },
  { value: 'passport',               label: 'Passport' },
  { value: 'drivingLicense',         label: 'Driving License' },
  { value: 'tin',                    label: 'TIN' },
  { value: 'citizenship',            label: 'Citizenship' },
  { value: 'educationalCertificate', label: 'Educational Certificate' },
];
var HELPLINE_CATEGORIES = [
  'Emergency', 'Police', 'Fire', 'Ambulance', 'Health', 'Education',
  'Electricity', 'Road', 'Waste', 'Municipal', 'Passport', 'Revenue',
  'Women & Children', 'Disaster Management'
];
var HELPLINE_CATEGORY_LABELS = {
  Fire: 'Fire Service',
  Road: 'Road & Transport',
  Waste: 'Waste Management',
  Municipal: 'Municipal Services',
};
var EMPTY_FILTERS = {
  department: '', urgency: '', minCost: '', maxCost: '',
  processingTime: '', requiredDocuments: [], search: ''
};
var costFormatter = new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' });

var DEPT_COLOR = {
  'Passport Office':    { bg: '#EEEDFE', stroke: '#534AB7', text: '#534AB7' },
  'Electricity':        { bg: '#FAEEDA', stroke: '#BA7517', text: '#854F0B' },
  'Road Maintenance':   { bg: '#F1EFE8', stroke: '#5F5E5A', text: '#444441' },
  'Waste Management':   { bg: '#EAF3DE', stroke: '#3B6D11', text: '#27500A' },
  'Health Services':    { bg: '#FCEBEB', stroke: '#A32D2D', text: '#791F1F' },
  'Education':          { bg: '#EEEDFE', stroke: '#534AB7', text: '#3C3489' },
  'Revenue':            { bg: '#E1F5EE', stroke: '#0F6E56', text: '#085041' },
  'Municipal Services': { bg: '#E6F1FB', stroke: '#185FA5', text: '#0C447C' },
  'Police':             { bg: '#E6F1FB', stroke: '#185FA5', text: '#0C447C' },
  'Fire Service':       { bg: '#FAECE7', stroke: '#993C1D', text: '#712B13' },
  'Ambulance':          { bg: '#FCEBEB', stroke: '#A32D2D', text: '#791F1F' },
  default:              { bg: '#F1EFE8', stroke: '#5F5E5A', text: '#444441' },
};
var URGENCY_PILL = {
  low:       { bg: '#EAF3DE', text: '#27500A', label: 'Low' },
  medium:    { bg: '#FAEEDA', text: '#633806', label: 'Medium' },
  high:      { bg: '#FAECE7', text: '#712B13', label: 'High' },
  emergency: { bg: '#FCEBEB', text: '#791F1F', label: 'Emergency' },
};
var DOC_TAG_COLORS = [
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#FAEEDA', text: '#412402' },
  { bg: '#E6F1FB', text: '#0C447C' },
  { bg: '#FAECE7', text: '#712B13' },
  { bg: '#EAF3DE', text: '#27500A' },
  { bg: '#FBEAF0', text: '#72243E' },
];
var CATEGORY_STYLES = {
  Emergency:   { icon: FaExclamationTriangle, hdrBg: '#FCEBEB', iconBg: '#A32D2D', catText: '#791F1F', numBg: '#FCEBEB', numText: '#791F1F', numStroke: '#A32D2D' },
  Police:      { icon: FaShieldAlt,           hdrBg: '#E6F1FB', iconBg: '#185FA5', catText: '#0C447C', numBg: '#E6F1FB', numText: '#0C447C', numStroke: '#185FA5' },
  Fire:        { icon: FaFire,                hdrBg: '#FAECE7', iconBg: '#993C1D', catText: '#712B13', numBg: '#FAECE7', numText: '#712B13', numStroke: '#993C1D' },
  Ambulance:   { icon: FaAmbulance,           hdrBg: '#EAF3DE', iconBg: '#3B6D11', catText: '#27500A', numBg: '#EAF3DE', numText: '#27500A', numStroke: '#3B6D11' },
  Electricity: { icon: FaBolt,                hdrBg: '#FAEEDA', iconBg: '#BA7517', catText: '#854F0B', numBg: '#FAEEDA', numText: '#633806', numStroke: '#BA7517' },
  Road:        { icon: FaRoad,                hdrBg: '#F1EFE8', iconBg: '#5F5E5A', catText: '#444441', numBg: '#F1EFE8', numText: '#444441', numStroke: '#5F5E5A' },
  Health:      { icon: FaHospital,            hdrBg: '#FCEBEB', iconBg: '#A32D2D', catText: '#791F1F', numBg: '#FCEBEB', numText: '#791F1F', numStroke: '#A32D2D' },
  Education:   { icon: FaSchool,              hdrBg: '#EEEDFE', iconBg: '#534AB7', catText: '#3C3489', numBg: '#EEEDFE', numText: '#26215C', numStroke: '#534AB7' },
  Municipal:   { icon: FaCity,                hdrBg: '#E6F1FB', iconBg: '#185FA5', catText: '#0C447C', numBg: '#E6F1FB', numText: '#0C447C', numStroke: '#185FA5' },
  Passport:    { icon: FaGlobe,               hdrBg: '#EEEDFE', iconBg: '#534AB7', catText: '#3C3489', numBg: '#EEEDFE', numText: '#26215C', numStroke: '#534AB7' },
  Revenue:     { icon: FaDollarSign,          hdrBg: '#E1F5EE', iconBg: '#0F6E56', catText: '#085041', numBg: '#E1F5EE', numText: '#085041', numStroke: '#0F6E56' },
  default:     { icon: FaPhone,               hdrBg: '#F1EFE8', iconBg: '#5F5E5A', catText: '#444441', numBg: '#F1EFE8', numText: '#444441', numStroke: '#5F5E5A' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getUserEmail() {
  try {
    var user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.email || '';
  } catch (e) {
    return '';
  }
}

function getUserName() {
  try {
    var user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.name || user.fullName || user.username || '';
  } catch (e) {
    return '';
  }
}

function buildMailtoLink(serviceEmail, serviceName, userEmail, userName) {
  if (!serviceEmail) return null;
  var to      = encodeURIComponent(serviceEmail);
  var cc      = encodeURIComponent(ADMIN_CC_EMAIL);
  var subject = encodeURIComponent('Inquiry regarding: ' + serviceName);
  var sender  = userName || userEmail || 'A citizen';
  var body    = encodeURIComponent(
    'Dear ' + serviceName + ' Team,\n\n' +
    'I am writing to inquire about your services.\n\n' +
    '[Please write your message here]\n\n' +
    'Regards,\n' + sender
  );
  return 'mailto:' + to + '?cc=' + cc + '&subject=' + subject + '&body=' + body;
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function IconClock() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7 4.5v2.8l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconPerson() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <path d="M7 1.5a3.5 3.5 0 00-3.5 3.5c0 3 3.5 7.5 3.5 7.5s3.5-4.5 3.5-7.5A3.5 3.5 0 007 1.5z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <rect x="2.5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 5h4M5 7.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconWeb() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 2.5c-1.5 1.5-2.5 3.5-2.5 5.5s1 4 2.5 5.5M8 2.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconPhone() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <path d="M3 3h3.5l1.2 3.5-1.7 1.2a8 8 0 003.3 3.3l1.2-1.7L14 10.5V13c0 .8-.8 1.5-1.5 1.5C5.5 14.5 1.5 10.5 1.5 4.5 1.5 3.8 2.2 3 3 3z" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <path d="M8 1.5a4 4 0 00-4 4c0 3.5 4 9 4 9s4-5.5 4-9a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

// ── MetaRow ───────────────────────────────────────────────────────────────────

function MetaRow(props) {
  var iconBg = props.iconBg;
  var IconComp = props.icon;
  var label = props.label;
  var children = props.children;
  return (
    <div className="flex items-start gap-2">
      <span
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: iconBg, color: 'inherit' }}
      >
        <IconComp />
      </span>
      <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 min-w-0 pt-0.5">{children}</div>
    </div>
  );
}

// ── ActionBtn ─────────────────────────────────────────────────────────────────
// All conditional logic is computed BEFORE the return to avoid JSX attr issues

function ActionBtn(props) {
  var href = props.href;
  var to = props.to;
  var bg = props.bg;
  var color = props.color;
  var IconComp = props.IconComp;
  var label = props.label;
  var disabled = props.disabled;

  var baseCls = 'flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all';
  var disabledStyle = { background: '#f3f4f6', color: '#9ca3af', opacity: '0.5', cursor: 'not-allowed' };
  var activeStyle = { background: bg, color: color };
  var activeStyle2 = { background: bg, color: color };

  if (disabled) {
    return (
      <span className={baseCls} style={disabledStyle}>
        <IconComp />
        {label}
      </span>
    );
  }

  if (to) {
    return (
      <Link to={to} className={baseCls} style={activeStyle}>
        <IconComp />
        {label}
      </Link>
    );
  }

  // Pre-compute target to avoid ternary inside JSX attr
  var linkTarget = '_self';
  if (href && href.indexOf('http') === 0) {
    linkTarget = '_blank';
  }

  return (
    <a href={href} target={linkTarget} rel="noopener noreferrer" className={baseCls} style={activeStyle2}>
      <IconComp />
      {label}
    </a>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Services() {
  var navigate = useNavigate();
  var location = useLocation();
  var activeTabState = useState('services');
  var activeTab = activeTabState[0];
  var setActiveTab = activeTabState[1];

  var servicesState = useState([]);
  var services = servicesState[0];
  var setServices = servicesState[1];

  var helplinesState = useState([]);
  var helplines = helplinesState[0];
  var setHelplines = helplinesState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var showFiltersState = useState(false);
  var showFilters = showFiltersState[0];
  var setShowFilters = showFiltersState[1];

  var filtersState = useState(EMPTY_FILTERS);
  var filters = filtersState[0];
  var setFilters = filtersState[1];

  var helplineSearchState = useState('');
  var helplineSearch = helplineSearchState[0];
  var setHelplineSearch = helplineSearchState[1];

  var helplineCategoryState = useState('');
  var helplineCategory = helplineCategoryState[0];
  var setHelplineCategory = helplineCategoryState[1];
{/* IFTI */}
  var toastState = useState({ show: false, message: '', type: 'success' });
  var toast = toastState[0];
  var setToast = toastState[1];

  function showToast(message, type) {
    setToast({ show: true, message: message, type: type || 'success' });
    setTimeout(function() {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  }

  useEffect(function() {
    var toastState = location.state && location.state.toast;
    if (!toastState || !toastState.message) {
      return;
    }

    showToast(toastState.message, toastState.type || 'success');
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  function handleApply(serviceId) {
    var token = localStorage.getItem('token');
    if (!token) {
      showToast('Please login first', 'error');
      return;
    }
    navigate('/apply-service/' + serviceId);
  }
{/* IFTI END*/ }
  var fetchServices = useCallback(function() {
    setLoading(true);
    var params = new URLSearchParams();
    Object.keys(filters).forEach(function(k) {
      var v = filters[k];
      if (Array.isArray(v)) {
        if (v.length) params.append(k, v.join(','));
      } else if (v) {
        params.append(k, v);
      }
    });
    axios.get(`${API}/api/services?` + params.toString())
      .then(function(res) { setServices(res.data); })
      .catch(function(err) { console.error('Error fetching services:', err); })
      .finally(function() { setLoading(false); });
  }, [filters]);

  var fetchHelplines = useCallback(function() {
    var params = new URLSearchParams();
    if (helplineCategory) params.append('category', helplineCategory);
    if (helplineSearch)   params.append('search',   helplineSearch);
    axios.get(`${API}/api/helplines?` + params.toString())
      .then(function(res) { setHelplines(res.data); })
      .catch(function(err) { console.error('Error fetching helplines:', err); });
  }, [helplineCategory, helplineSearch]);

  useEffect(function() {
    if (activeTab === 'services') {
      fetchServices();
    } else {
      fetchHelplines();
    }
  }, [activeTab, fetchServices, fetchHelplines]);

  function toggleDocument(doc) {
    setFilters(function(prev) {
      var already = prev.requiredDocuments.indexOf(doc) !== -1;
      return {
        department: prev.department,
        urgency: prev.urgency,
        minCost: prev.minCost,
        maxCost: prev.maxCost,
        processingTime: prev.processingTime,
        search: prev.search,
        requiredDocuments: already
          ? prev.requiredDocuments.filter(function(d) { return d !== doc; })
          : prev.requiredDocuments.concat([doc])
      };
    });
  }

  // Pre-compute tab button classes outside JSX
  var tabClsServices  = 'flex-1 py-3 px-4 rounded-lg font-medium transition-all ' + (activeTab === 'services'  ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100');
  var tabClsHelplines = 'flex-1 py-3 px-4 rounded-lg font-medium transition-all ' + (activeTab === 'helplines' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100');
  var filterBtnCls    = 'px-5 py-3 border rounded-xl flex items-center gap-2 transition ' + (showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100');
  var chevronCls      = 'transition-transform ' + (showFilters ? 'rotate-180' : '');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast Notification IFTI*/}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}
      {/*IFTI_END */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Service &amp; Helpline Directory</h1>
          <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
          <button className={tabClsServices}  onClick={function() { setActiveTab('services');  }}>Government Services</button>
          <button className={tabClsHelplines} onClick={function() { setActiveTab('helplines'); }}>Emergency &amp; Departmental Helplines</button>
        </div>

        {/* ════ SERVICES TAB ════ */}
        {activeTab === 'services' && (
          <div>
            {/* Search + filter bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services by name or description..."
                    value={filters.search}
                    onChange={function(e) {
                      var val = e.target.value;
                      setFilters(function(f) {
                        return { department: f.department, urgency: f.urgency, minCost: f.minCost, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: val };
                      });
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={function() { setShowFilters(function(s) { return !s; }); }}
                    className={filterBtnCls}
                  >
                    <FaFilter />
                    <span>Filters</span>
                    <FaChevronDown className={chevronCls} />
                  </button>
                  <button
                    onClick={function() { setFilters(EMPTY_FILTERS); }}
                    className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2"
                  >
                    <FaTimes /><span>Clear</span>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={filters.department}
                      onChange={function(e) {
                        var val = e.target.value;
                        setFilters(function(f) { return { department: val, urgency: f.urgency, minCost: f.minCost, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map(function(d) { return <option key={d} value={d}>{d}</option>; })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                    <select
                      value={filters.urgency}
                      onChange={function(e) {
                        var val = e.target.value;
                        setFilters(function(f) { return { department: f.department, urgency: val, minCost: f.minCost, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      {URGENCY_LEVELS.map(function(l) {
                        var label = l.charAt(0).toUpperCase() + l.slice(1);
                        return <option key={l} value={l}>{label}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
                    <div className="flex gap-2">
                      <input
                        type="number" placeholder="Min"
                        value={filters.minCost}
                        onChange={function(e) {
                          var val = e.target.value;
                          setFilters(function(f) { return { department: f.department, urgency: f.urgency, minCost: val, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
                        }}
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number" placeholder="Max"
                        value={filters.maxCost}
                        onChange={function(e) {
                          var val = e.target.value;
                          setFilters(function(f) { return { department: f.department, urgency: f.urgency, minCost: f.minCost, maxCost: val, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
                        }}
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                    <input
                      type="text" placeholder="e.g., 3-5 days"
                      value={filters.processingTime}
                      onChange={function(e) {
                        var val = e.target.value;
                        setFilters(function(f) { return { department: f.department, urgency: f.urgency, minCost: f.minCost, maxCost: f.maxCost, processingTime: val, requiredDocuments: f.requiredDocuments, search: f.search }; });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                    <div className="flex flex-wrap gap-2">
                      {DOCUMENT_OPTIONS.map(function(doc) {
                        var isActive = filters.requiredDocuments.indexOf(doc.value) !== -1;
                        var btnCls = 'px-4 py-2 rounded-full text-sm font-medium transition-all ' + (isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200');
                        return (
                          <button key={doc.value} onClick={function() { toggleDocument(doc.value); }} className={btnCls}>
                            {doc.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Service cards */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(function(service) {
                  var dept = DEPT_COLOR[service.department] || DEPT_COLOR.default;
                  var urg  = URGENCY_PILL[service.urgency]  || URGENCY_PILL.medium;
                  var userEmail  = getUserEmail();
                  var userName   = getUserName();
                  var mailtoHref = buildMailtoLink(service.email, service.name, userEmail, userName);
                  var callHref   = service.helpline ? 'tel:' + service.helpline : null;
                  var mapTo      = '/nearby?serviceId=' + service._id;
                  {/*IFTI START*/ }
                  var processStepsList = Array.isArray(service.processSteps)
                    ? service.processSteps.filter(function(step) { return step && step.trim(); })
                    : String(service.processSteps || '')
                        .split('\n')
                        .map(function(step) { return step.trim(); })
                        .filter(Boolean);
                  {/*IFTI END*/}
                  return (
                    <div
                      key={service._id}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md min-h-[420px]"
                    >
                      {/* Card header */}
                      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: dept.bg }}>
                            <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
                              <rect x="1.5" y="2" width="11" height="10" rx="1.2" stroke={dept.stroke} strokeWidth="1.2"/>
                              <path d="M4.5 6.5h5M4.5 9h3" stroke={dept.stroke} strokeWidth="1.1" strokeLinecap="round"/>
                            </svg>
                          </span>
                          <span className="text-xs font-medium truncate" style={{ color: dept.text }}>{service.department}</span>
                          <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: urg.bg, color: urg.text }}>{urg.label}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug truncate">{service.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{service.description}</p>
                      </div>
                      {/*IFTI START*/}
                      {/* Card body */}
                      <div className="px-4 py-3 flex flex-col gap-2.5 flex-1 overflow-visible">
                      {/*IFTI END*/}
                        <MetaRow iconBg="#EAF3DE" icon={IconClock} label="Processing">
                          <span className="text-xs font-medium text-gray-700">{service.processingTime}</span>
                        </MetaRow>
                        {/*IFTI START*/ }
                        <MetaRow iconBg="#EEEDFE" icon={IconDoc} label="Process Steps">
                          {processStepsList.length ? (
                            <ol className="list-decimal list-inside text-xs font-medium text-gray-700 max-h-20 overflow-y-auto pr-1 space-y-1">
                              {processStepsList.map(function(step, idx) {
                                return <li key={service._id + '-step-' + idx}>{step}</li>;
                              })}
                            </ol>
                          ) : (
                            <span className="text-xs font-medium text-gray-700">N/A</span>
                          )}
                        </MetaRow>
                        {/*IFTI END*/ }
                        <MetaRow iconBg="#E1F5EE" icon={IconPerson} label="Eligibility">
                          <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.eligibilityCriteria}</span>
                        </MetaRow>
                        {service.location && (
                          <MetaRow iconBg="#FBEAF0" icon={IconPin} label="Location">
                            <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.location}</span>
                          </MetaRow>
                        )}
                        <div className="h-px bg-gray-100 my-0.5 flex-shrink-0" />
                        <MetaRow iconBg="#EEEDFE" icon={IconDoc} label="Documents">
                          <div className="flex flex-wrap gap-1">
                            {service.requiredDocuments.length > 0
                              ? service.requiredDocuments.map(function(doc, i) {
                                  var c = DOC_TAG_COLORS[i % DOC_TAG_COLORS.length];
                                  var found = DOCUMENT_OPTIONS.filter(function(d) { return d.value === doc; })[0];
                                  var docLabel = found ? found.label : doc;
                                  return (
                                    <span key={doc} className="px-1.5 py-px rounded text-xs font-medium" style={{ background: c.bg, color: c.text }}>
                                      {docLabel}
                                    </span>
                                  );
                                })
                              : <span className="text-xs text-gray-400">None required</span>
                            }
                          </div>
                        </MetaRow>
                        <MetaRow iconBg="#E1F5EE" icon={IconCheck} label="Cost">
                          <span className="text-sm font-semibold" style={{ color: '#0F6E56' }}>
                            {costFormatter.format(service.cost)}
                          </span>
                        </MetaRow>
                      </div>

                      {/* Footer actions */}
                      {/*IFTI Start*/}
                      <div className="grid grid-cols-4 gap-1.5 px-3 pb-2 flex-shrink-0">
                      {/*IFTI END*/}
                        <ActionBtn href={service.website} bg="#E6F1FB" color="#0C447C" IconComp={IconWeb}   label="Website" disabled={!service.website} />
                        <ActionBtn href={callHref}        bg="#EAF3DE" color="#27500A" IconComp={IconPhone} label="Call"    disabled={!service.helpline} />
                        <ActionBtn href={mailtoHref}      bg="#EEEDFE" color="#26215C" IconComp={IconMail}  label="Email"  disabled={!service.email} />
                        <ActionBtn to={mapTo}             bg="#FCEBEB" color="#791F1F" IconComp={IconMap}   label="Map" />
                      </div>
                      {/*IFTI START*/}
                      <div className="px-3 pb-3">
                        <button
                          type="button"
                          onClick={function() { handleApply(service._id); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          <FaPaperPlane />
                          Apply
                        </button>
                      </div>
                      {/*IFTI END*/}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ HELPLINES TAB ════ */}
        {activeTab === 'helplines' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search helplines by name or description..."
                    value={helplineSearch}
                    onChange={function(e) { setHelplineSearch(e.target.value); }}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={helplineCategory}
                  onChange={function(e) { setHelplineCategory(e.target.value); }}
                  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {HELPLINE_CATEGORIES.map(function(c) {
                    var lbl = HELPLINE_CATEGORY_LABELS[c] || c;
                    return <option key={c} value={c}>{lbl}</option>;
                  })}
                </select>
              </div>
            </div>

            {helplines.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No helplines found</h3>
                <p className="text-gray-500">Try a different category or search term</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {helplines.map(function(helpline) {
                  var s = CATEGORY_STYLES[helpline.category] || CATEGORY_STYLES.default;
                  var Icon = s.icon;
                  return (
                    <div key={helpline._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md">

                      {/* Colored header */}
                      <div className="flex items-center gap-3 px-4 py-4 flex-shrink-0" style={{ background: s.hdrBg }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">{helpline.name}</h3>
                          <p className="text-xs font-medium mt-0.5" style={{ color: s.catText }}>{helpline.category}</p>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          {helpline.isEmergency && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#FCEBEB', color: '#791F1F' }}>Emergency</span>
                          )}
                          {helpline.available24x7 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#EAF3DE', color: '#27500A' }}>24/7</span>
                          )}
                        </div>
                      </div>

                      {/* Numbers */}
                      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
                        <p className="text-xs font-medium tracking-widest text-gray-400">CONTACT</p>
                        {helpline.numbers.map(function(num, i) {
                          var telHref = 'tel:' + num;
                          return (
                            <a key={i} href={telHref} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80 group" style={{ background: s.numBg }}>
                              <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
                                <path d="M2.5 2.5h3l1 3-1.5 1A7 7 0 008.5 10l1-1.5 3 1V12c0 .6-.5 1-1 1C4 13 1 10 1 5.5c0-.5.5-1 1-1l.5-2z" stroke={s.numStroke} strokeWidth="1.2"/>
                              </svg>
                              <span className="text-sm font-semibold flex-1" style={{ color: s.numText }}>{num}</span>
                              <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: s.numText }} />
                            </a>
                          );
                        })}
                      </div>

                      {/* Website */}
                      {helpline.website && (
                        <div className="px-4 pb-2">
                          <a href={helpline.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition group">
                            <FaGlobe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-gray-600 flex-1 truncate">Visit official website</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                          </a>
                        </div>
                      )}

                      {/* Description */}
                      {helpline.description && (
                        <div className="px-4 pb-3">
                          <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg leading-relaxed line-clamp-2">
                            <FaInfoCircle className="inline mr-1 text-gray-400" />
                            {helpline.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}