

// import { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import axiosAuth from '../config/axiosInstance';
// import {
//   FaSearch, FaFilter, FaPhone, FaTimes, FaChevronDown,
//   FaExclamationTriangle, FaAmbulance, FaFire, FaShieldAlt,
//   FaBolt, FaRoad, FaHospital, FaSchool, FaCity, FaGlobe,
//   FaExternalLinkAlt, FaInfoCircle, FaDollarSign, FaPaperPlane, FaCommentAlt,
//   FaStar, FaRegStar, FaVideo
// } from 'react-icons/fa';

// // ── Constants ────────────────────────────────────────────────────────────────

// var ADMIN_CC_EMAIL = 'anrikanrik728@gmail.com';

// var DEPARTMENTS = [
//   'Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management',
//   'Health Services', 'Education', 'Revenue', 'Municipal Services',
//   'Police', 'Fire Service', 'Ambulance'
// ];
// var URGENCY_LEVELS = ['low', 'medium', 'high', 'emergency'];
// var DOCUMENT_OPTIONS = [
//   { value: 'nid',                    label: 'NID' },
//   { value: 'birthCertificate',       label: 'Birth Certificate' },
//   { value: 'passport',               label: 'Passport' },
//   { value: 'drivingLicense',         label: 'Driving License' },
//   { value: 'tin',                    label: 'TIN' },
//   { value: 'citizenship',            label: 'Citizenship' },
//   { value: 'educationalCertificate', label: 'Educational Certificate' },
// ];
// var HELPLINE_CATEGORIES = [
//   'Emergency', 'Police', 'Fire', 'Ambulance', 'Health', 'Education',
//   'Electricity', 'Road', 'Waste', 'Municipal', 'Passport', 'Revenue',
//   'Women & Children', 'Disaster Management'
// ];
// var HELPLINE_CATEGORY_LABELS = {
//   Fire: 'Fire Service',
//   Road: 'Road & Transport',
//   Waste: 'Waste Management',
//   Municipal: 'Municipal Services',
// };
// var EMPTY_FILTERS = {
//   department: '', urgency: '', minCost: '', maxCost: '',
//   processingTime: '', requiredDocuments: [], search: ''
// };
// var costFormatter = new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' });

// // Complaint records are kept in the database for the Complaints module but do
// // not belong in this citizen-services directory. This client-side guard keeps
// // the page clean even when it is connected to an older backend deployment.
// var COMPLAINT_ENTRY_PATTERN = /\b(complaint|garbage|waste collection|road maintenance|road repair|pothole|drainage|streetlight|sewerage|sanitation|water supply issue|encroachment)\b/i;

// function isComplaintEntry(service) {
//   return COMPLAINT_ENTRY_PATTERN.test([
//     service.name || '',
//     service.description || '',
//     service.department || ''
//   ].join(' '));
// }

// var DEPT_COLOR = {
//   'Passport Office':    { bg: '#EEEDFE', stroke: '#534AB7', text: '#534AB7' },
//   'Electricity':        { bg: '#FAEEDA', stroke: '#BA7517', text: '#854F0B' },
//   'Road Maintenance':   { bg: '#F1EFE8', stroke: '#5F5E5A', text: '#444441' },
//   'Waste Management':   { bg: '#EAF3DE', stroke: '#3B6D11', text: '#27500A' },
//   'Health Services':    { bg: '#FCEBEB', stroke: '#A32D2D', text: '#791F1F' },
//   'Education':          { bg: '#EEEDFE', stroke: '#534AB7', text: '#3C3489' },
//   'Revenue':            { bg: '#E1F5EE', stroke: '#0F6E56', text: '#085041' },
//   'Municipal Services': { bg: '#E6F1FB', stroke: '#185FA5', text: '#0C447C' },
//   'Police':             { bg: '#E6F1FB', stroke: '#185FA5', text: '#0C447C' },
//   'Fire Service':       { bg: '#FAECE7', stroke: '#993C1D', text: '#712B13' },
//   'Ambulance':          { bg: '#FCEBEB', stroke: '#A32D2D', text: '#791F1F' },
//   default:              { bg: '#F1EFE8', stroke: '#5F5E5A', text: '#444441' },
// };
// var URGENCY_PILL = {
//   low:       { bg: '#EAF3DE', text: '#27500A', label: 'Low' },
//   medium:    { bg: '#FAEEDA', text: '#633806', label: 'Medium' },
//   high:      { bg: '#FAECE7', text: '#712B13', label: 'High' },
//   emergency: { bg: '#FCEBEB', text: '#791F1F', label: 'Emergency' },
// };
// var DOC_TAG_COLORS = [
//   { bg: '#EEEDFE', text: '#3C3489' },
//   { bg: '#E1F5EE', text: '#085041' },
//   { bg: '#FAEEDA', text: '#412402' },
//   { bg: '#E6F1FB', text: '#0C447C' },
//   { bg: '#FAECE7', text: '#712B13' },
//   { bg: '#EAF3DE', text: '#27500A' },
//   { bg: '#FBEAF0', text: '#72243E' },
// ];
// var CATEGORY_STYLES = {
//   Emergency:   { icon: FaExclamationTriangle, hdrBg: '#FCEBEB', iconBg: '#A32D2D', catText: '#791F1F', numBg: '#FCEBEB', numText: '#791F1F', numStroke: '#A32D2D' },
//   Police:      { icon: FaShieldAlt,           hdrBg: '#E6F1FB', iconBg: '#185FA5', catText: '#0C447C', numBg: '#E6F1FB', numText: '#0C447C', numStroke: '#185FA5' },
//   Fire:        { icon: FaFire,                hdrBg: '#FAECE7', iconBg: '#993C1D', catText: '#712B13', numBg: '#FAECE7', numText: '#712B13', numStroke: '#993C1D' },
//   Ambulance:   { icon: FaAmbulance,           hdrBg: '#EAF3DE', iconBg: '#3B6D11', catText: '#27500A', numBg: '#EAF3DE', numText: '#27500A', numStroke: '#3B6D11' },
//   Electricity: { icon: FaBolt,                hdrBg: '#FAEEDA', iconBg: '#BA7517', catText: '#854F0B', numBg: '#FAEEDA', numText: '#633806', numStroke: '#BA7517' },
//   Road:        { icon: FaRoad,                hdrBg: '#F1EFE8', iconBg: '#5F5E5A', catText: '#444441', numBg: '#F1EFE8', numText: '#444441', numStroke: '#5F5E5A' },
//   Health:      { icon: FaHospital,            hdrBg: '#FCEBEB', iconBg: '#A32D2D', catText: '#791F1F', numBg: '#FCEBEB', numText: '#791F1F', numStroke: '#A32D2D' },
//   Education:   { icon: FaSchool,              hdrBg: '#EEEDFE', iconBg: '#534AB7', catText: '#3C3489', numBg: '#EEEDFE', numText: '#26215C', numStroke: '#534AB7' },
//   Municipal:   { icon: FaCity,                hdrBg: '#E6F1FB', iconBg: '#185FA5', catText: '#0C447C', numBg: '#E6F1FB', numText: '#0C447C', numStroke: '#185FA5' },
//   Passport:    { icon: FaGlobe,               hdrBg: '#EEEDFE', iconBg: '#534AB7', catText: '#3C3489', numBg: '#EEEDFE', numText: '#26215C', numStroke: '#534AB7' },
//   Revenue:     { icon: FaDollarSign,          hdrBg: '#E1F5EE', iconBg: '#0F6E56', catText: '#085041', numBg: '#E1F5EE', numText: '#085041', numStroke: '#0F6E56' },
//   default:     { icon: FaPhone,               hdrBg: '#F1EFE8', iconBg: '#5F5E5A', catText: '#444441', numBg: '#F1EFE8', numText: '#444441', numStroke: '#5F5E5A' },
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function getUserEmail() {
//   try {
//     var user = JSON.parse(localStorage.getItem('user') || '{}');
//     return user.email || '';
//   } catch (e) {
//     return '';
//   }
// }

// function getUserName() {
//   try {
//     var user = JSON.parse(localStorage.getItem('user') || '{}');
//     return user.name || user.fullName || user.username || '';
//   } catch (e) {
//     return '';
//   }
// }

// function buildMailtoLink(serviceEmail, serviceName, userEmail, userName) {
//   if (!serviceEmail) return null;
//   var to      = encodeURIComponent(serviceEmail);
//   var cc      = encodeURIComponent(ADMIN_CC_EMAIL);
//   var subject = encodeURIComponent('Inquiry regarding: ' + serviceName);
//   var sender  = userName || userEmail || 'A citizen';
//   var body    = encodeURIComponent(
//     'Dear ' + serviceName + ' Team,\n\n' +
//     'I am writing to inquire about your services.\n\n' +
//     '[Please write your message here]\n\n' +
//     'Regards,\n' + sender
//   );
//   return 'mailto:' + to + '?cc=' + cc + '&subject=' + subject + '&body=' + body;
// }

// // ── Inline SVG icons ──────────────────────────────────────────────────────────

// function IconClock() {
//   return (
//     <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
//       <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/>
//       <path d="M7 4.5v2.8l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
//     </svg>
//   );
// }
// function IconPerson() {
//   return (
//     <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
//       <circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/>
//       <path d="M2.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
//     </svg>
//   );
// }
// function IconPin() {
//   return (
//     <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
//       <path d="M7 1.5a3.5 3.5 0 00-3.5 3.5c0 3 3.5 7.5 3.5 7.5s3.5-4.5 3.5-7.5A3.5 3.5 0 007 1.5z" stroke="currentColor" strokeWidth="1.2"/>
//       <circle cx="7" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
//     </svg>
//   );
// }
// function IconDoc() {
//   return (
//     <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
//       <rect x="2.5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
//       <path d="M5 5h4M5 7.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
//     </svg>
//   );
// }
// function IconCheck() {
//   return (
//     <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
//       <path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   );
// }
// function IconWeb() {
//   return (
//     <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
//       <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
//       <path d="M8 2.5c-1.5 1.5-2.5 3.5-2.5 5.5s1 4 2.5 5.5M8 2.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
//     </svg>
//   );
// }
// function IconPhone() {
//   return (
//     <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
//       <path d="M3 3h3.5l1.2 3.5-1.7 1.2a8 8 0 003.3 3.3l1.2-1.7L14 10.5V13c0 .8-.8 1.5-1.5 1.5C5.5 14.5 1.5 10.5 1.5 4.5 1.5 3.8 2.2 3 3 3z" stroke="currentColor" strokeWidth="1.3"/>
//     </svg>
//   );
// }
// function IconMail() {
//   return (
//     <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
//       <rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
//       <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
//     </svg>
//   );
// }
// function IconMap() {
//   return (
//     <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
//       <path d="M8 1.5a4 4 0 00-4 4c0 3.5 4 9 4 9s4-5.5 4-9a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.3"/>
//       <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
//     </svg>
//   );
// }

// // ── MetaRow ───────────────────────────────────────────────────────────────────

// function MetaRow(props) {
//   var iconBg = props.iconBg;
//   var IconComp = props.icon;
//   var label = props.label;
//   var children = props.children;
//   return (
//     <div className="flex items-start gap-2">
//       <span
//         className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
//         style={{ background: iconBg, color: 'inherit' }}
//       >
//         <IconComp />
//       </span>
//       <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{label}</span>
//       <div className="flex-1 min-w-0 pt-0.5">{children}</div>
//     </div>
//   );
// }

// // ── ActionBtn ─────────────────────────────────────────────────────────────────
// // All conditional logic is computed BEFORE the return to avoid JSX attr issues

// function ActionBtn(props) {
//   var href = props.href;
//   var to = props.to;
//   var bg = props.bg;
//   var color = props.color;
//   var IconComp = props.IconComp;
//   var label = props.label;
//   var disabled = props.disabled;

//   var baseCls = 'flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all';
//   var disabledStyle = { background: '#f3f4f6', color: '#9ca3af', opacity: '0.5', cursor: 'not-allowed' };
//   var activeStyle = { background: bg, color: color };
//   var activeStyle2 = { background: bg, color: color };

//   if (disabled) {
//     return (
//       <span className={baseCls} style={disabledStyle}>
//         <IconComp />
//         {label}
//       </span>
//     );
//   }

//   if (to) {
//     return (
//       <Link to={to} className={baseCls} style={activeStyle}>
//         <IconComp />
//         {label}
//       </Link>
//     );
//   }

//   // Pre-compute target to avoid ternary inside JSX attr
//   var linkTarget = '_self';
//   if (href && href.indexOf('http') === 0) {
//     linkTarget = '_blank';
//   }

//   return (
//     <a href={href} target={linkTarget} rel="noopener noreferrer" className={baseCls} style={activeStyle2}>
//       <IconComp />
//       {label}
//     </a>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────────

// function ConsultationModal(props) {
//   var service = props.service;
//   var onClose = props.onClose;
//   var onSubmitted = props.onSubmitted;
//   var initialEmail = getUserEmail();
//   var initialName = getUserName();
//   var formState = useState({
//     preferredDate: '',
//     preferredTime: '',
//     reason: '',
//     alternateEmail: initialEmail,
//     location: 'Online video consultation'
//   });
//   var formData = formState[0];
//   var setFormData = formState[1];
//   var submittingState = useState(false);
//   var submitting = submittingState[0];
//   var setSubmitting = submittingState[1];
//   var errorState = useState('');
//   var error = errorState[0];
//   var setError = errorState[1];
//   var successState = useState(false);
//   var success = successState[0];
//   var setSuccess = successState[1];

//   function updateField(event) {
//     var name = event.target.name;
//     var value = event.target.value;
//     setFormData(function(prev) { return Object.assign({}, prev, { [name]: value }); });
//     setError('');
//   }

//   function submitConsultation(event) {
//     event.preventDefault();
//     setError('');
//     setSubmitting(true);
//     axiosAuth.post('/api/appointments/consultation-request', {
//       serviceId: service?._id,
//       serviceName: service?.name,
//       preferredDate: formData.preferredDate,
//       preferredTime: formData.preferredTime,
//       reason: formData.reason,
//       alternateEmail: formData.alternateEmail,
//       location: formData.location
//     })
//       .then(function() {
//         setSuccess(true);
//         onSubmitted();
//       })
//       .catch(function(requestError) {
//         setError(requestError.response?.data?.message || 'Could not submit consultation request. Please try again.');
//       })
//       .finally(function() { setSubmitting(false); });
//   }

//   function closeAndReset() {
//     setSuccess(false);
//     setError('');
//     setFormData({
//       preferredDate: '',
//       preferredTime: '',
//       reason: '',
//       alternateEmail: initialEmail,
//       location: 'Online video consultation'
//     });
//     onClose();
//   }

//   if (!service) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
//       <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
//           <div>
//             <p className="text-sm font-semibold text-blue-600">Video consultation</p>
//             <h2 id="consultation-title" className="mt-1 text-xl font-bold text-gray-900">Request a consultation for {service.name}</h2>
//             <p className="mt-1 text-sm text-gray-500">Choose a future time and share the reason so our team can confirm the meeting.</p>
//           </div>
//           <button type="button" onClick={closeAndReset} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 rounded-lg" aria-label="Close consultation form"><FaTimes /></button>
//         </div>
//         {success ? (
//           <div className="px-6 py-8 text-center">
//             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><FaVideo /></div>
//             <h3 className="mt-4 text-lg font-semibold text-gray-900">Consultation request received</h3>
//             <p className="mt-2 text-sm text-gray-600">Your request has been submitted. An admin will review it and confirm a suitable time shortly.</p>
//             <button type="button" onClick={closeAndReset} className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Close</button>
//           </div>
//         ) : (
//           <form onSubmit={submitConsultation} className="px-6 py-5 space-y-5">
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Preferred date</label>
//                 <input type="date" name="preferredDate" value={formData.preferredDate} onChange={updateField} min={new Date().toISOString().split('T')[0]} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Preferred time</label>
//                 <input type="time" name="preferredTime" value={formData.preferredTime} onChange={updateField} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">Reason for consultation</label>
//               <textarea name="reason" value={formData.reason} onChange={updateField} rows="4" placeholder="Tell us what you need help with..." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
//             </div>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Alternate email</label>
//                 <input type="email" name="alternateEmail" value={formData.alternateEmail} onChange={updateField} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="optional" />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Preferred meeting mode</label>
//                 <input type="text" name="location" value={formData.location} onChange={updateField} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//               </div>
//             </div>
//             {error && <p className="text-sm text-red-600">{error}</p>}
//             <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
//               <button type="button" onClick={closeAndReset} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
//               <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit request'}</button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// function FeedbackModal(props) {
//   var service = props.service;
//   var onClose = props.onClose;
//   var onSubmitted = props.onSubmitted;
//   var ratingState = useState(null);
//   var rating = ratingState[0];
//   var setRating = ratingState[1];
//   var tagsState = useState([]);
//   var tags = tagsState[0];
//   var setTags = tagsState[1];
//   var commentState = useState('');
//   var comment = commentState[0];
//   var setComment = commentState[1];
//   var submittingState = useState(false);
//   var submitting = submittingState[0];
//   var setSubmitting = submittingState[1];
//   var errorState = useState('');
//   var error = errorState[0];
//   var setError = errorState[1];
//   var feedbackTags = ['Good', 'Average', 'Bad', 'Helpful staff', 'Slow process'];

//   function toggleTag(tag) {
//     setTags(function(previousTags) {
//       var selected = previousTags.indexOf(tag) !== -1;
//       setComment(function(previousComment) {
//         if (selected || previousComment.indexOf(tag) !== -1) return previousComment;
//         return previousComment ? previousComment + ', ' + tag : tag + ', ';
//       });
//       return selected ? previousTags.filter(function(item) { return item !== tag; }) : previousTags.concat(tag);
//     });
//   }

//   function submitFeedback(event) {
//     event.preventDefault();
//     setError('');
//     setSubmitting(true);
//     axiosAuth.post('/api/service-feedback', { serviceId: service._id, rating: rating, tags: tags, comment: comment })
//       .then(function() { onSubmitted(); onClose(); })
//       .catch(function(requestError) { setError(requestError.response?.data?.message || 'Could not submit feedback. Please try again.'); })
//       .finally(function() { setSubmitting(false); });
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
//       <form onSubmit={submitFeedback} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
//           <div><p className="text-sm font-semibold text-blue-600">Service feedback</p><h2 id="feedback-title" className="mt-1 text-xl font-bold text-gray-900">{service.name}</h2><p className="mt-1 text-sm text-gray-500">Share your experience — every field is optional.</p></div>
//           <button type="button" onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 rounded-lg" aria-label="Close feedback form"><FaTimes /></button>
//         </div>
//         <div className="px-6 py-5 space-y-5">
//           <div><p className="mb-2 text-sm font-medium text-gray-700">Rating <span className="font-normal text-gray-400">(optional)</span></p><div className="flex gap-1" aria-label="Choose a rating from 1 to 5">{[1, 2, 3, 4, 5].map(function(star) { var selected = rating !== null && star <= rating; return <button key={star} type="button" onClick={function() { setRating(rating === star ? null : star); }} className="p-1 text-2xl text-amber-400 hover:scale-110 transition-transform" aria-label={star + ' star' + (star > 1 ? 's' : '')}>{selected ? <FaStar /> : <FaRegStar />}</button>; })}</div></div>
//           <div><p className="mb-2 text-sm font-medium text-gray-700">Quick feedback</p><div className="flex flex-wrap gap-2">{feedbackTags.map(function(tag) { var selected = tags.indexOf(tag) !== -1; return <button key={tag} type="button" onClick={function() { toggleTag(tag); }} className={'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ' + (selected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100')}>{tag}</button>; })}</div></div>
//           <div><label htmlFor="service-feedback-comment" className="text-sm font-medium text-gray-700">Your experience <span className="font-normal text-gray-400">(optional)</span></label><textarea id="service-feedback-comment" value={comment} onChange={function(event) { setComment(event.target.value); }} maxLength="2000" rows="4" placeholder="Tell us about your experience..." className="w-full px-3 py-2.5 mt-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
//           {error && <p className="text-sm text-red-600">{error}</p>}
//         </div>
//         <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit feedback'}</button></div>
//       </form>
//     </div>
//   );
// }

// export default function Services() {
//   var activeTabState = useState('services');
//   var activeTab = activeTabState[0];
//   var setActiveTab = activeTabState[1];

//   var servicesState = useState([]);
//   var services = servicesState[0];
//   var setServices = servicesState[1];

//   var helplinesState = useState([]);
//   var helplines = helplinesState[0];
//   var setHelplines = helplinesState[1];

//   var loadingState = useState(false);
//   var loading = loadingState[0];
//   var setLoading = loadingState[1];

//   var showFiltersState = useState(false);
//   var showFilters = showFiltersState[0];
//   var setShowFilters = showFiltersState[1];

//   var filtersState = useState(EMPTY_FILTERS);
//   var filters = filtersState[0];
//   var setFilters = filtersState[1];

//   var helplineSearchState = useState('');
//   var helplineSearch = helplineSearchState[0];
//   var setHelplineSearch = helplineSearchState[1];

//   var helplineCategoryState = useState('');
//   var helplineCategory = helplineCategoryState[0];
//   var setHelplineCategory = helplineCategoryState[1];

//   var feedbackServiceState = useState(null);
//   var feedbackService = feedbackServiceState[0];
//   var setFeedbackService = feedbackServiceState[1];

//   var consultationServiceState = useState(null);
//   var consultationService = consultationServiceState[0];
//   var setConsultationService = consultationServiceState[1];

//   var feedbackSuccessState = useState(false);
//   var feedbackSuccess = feedbackSuccessState[0];
//   var setFeedbackSuccess = feedbackSuccessState[1];

//   function showFeedbackSuccess() {
//     setFeedbackSuccess(true);
//     window.setTimeout(function() { setFeedbackSuccess(false); }, 3500);
//   }

//   var fetchServices = useCallback(function() {
//     setLoading(true);
//     var params = new URLSearchParams();
//     Object.keys(filters).forEach(function(k) {
//       var v = filters[k];
//       if (Array.isArray(v)) {
//         if (v.length) params.append(k, v.join(','));
//       } else if (v) {
//         params.append(k, v);
//       }
//     });
//     params.set('excludeComplaints', 'true');
//     axiosAuth.get('/api/services?' + params.toString())
//       .then(function(res) { setServices((res.data || []).filter(function(service) { return !isComplaintEntry(service); })); })
//       .catch(function(err) { console.error('Error fetching services:', err); })
//       .finally(function() { setLoading(false); });
//   }, [filters]);

//   var fetchHelplines = useCallback(function() {
//     var params = new URLSearchParams();
//     if (helplineCategory) params.append('category', helplineCategory);
//     if (helplineSearch)   params.append('search',   helplineSearch);
//     axiosAuth.get('/api/helplines?' + params.toString())
//       .then(function(res) { setHelplines(res.data); })
//       .catch(function(err) { console.error('Error fetching helplines:', err); });
//   }, [helplineCategory, helplineSearch]);

//   useEffect(function() {
//     if (activeTab === 'services') {
//       fetchServices();
//     } else {
//       fetchHelplines();
//     }
//   }, [activeTab, fetchServices, fetchHelplines]);

//   function toggleDocument(doc) {
//     setFilters(function(prev) {
//       var already = prev.requiredDocuments.indexOf(doc) !== -1;
//       return {
//         department: prev.department,
//         urgency: prev.urgency,
//         minCost: prev.minCost,
//         maxCost: prev.maxCost,
//         processingTime: prev.processingTime,
//         search: prev.search,
//         requiredDocuments: already
//           ? prev.requiredDocuments.filter(function(d) { return d !== doc; })
//           : prev.requiredDocuments.concat([doc])
//       };
//     });
//   }

//   // Pre-compute tab button classes outside JSX
//   var tabClsServices  = 'flex-1 py-3 px-4 rounded-lg font-medium transition-all ' + (activeTab === 'services'  ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100');
//   var tabClsHelplines = 'flex-1 py-3 px-4 rounded-lg font-medium transition-all ' + (activeTab === 'helplines' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100');
//   var filterBtnCls    = 'px-5 py-3 border rounded-xl flex items-center gap-2 transition ' + (showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100');
//   var chevronCls      = 'transition-transform ' + (showFilters ? 'rotate-180' : '');

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
//           <h1 className="text-4xl font-bold mb-2">Service &amp; Helpline Directory</h1>
//           <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
//         </div>

//         {/* Tabs */}
//         <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
//           <button className={tabClsServices}  onClick={function() { setActiveTab('services');  }}>Government Services</button>
//           <button className={tabClsHelplines} onClick={function() { setActiveTab('helplines'); }}>Emergency &amp; Departmental Helplines</button>
//         </div>

//         {/* ════ SERVICES TAB ════ */}
//         {activeTab === 'services' && (
//           <div>
//             {/* Search + filter bar */}
//             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search services by name or description..."
//                     value={filters.search}
//                     onChange={function(e) {
//                       var val = e.target.value;
//                       setFilters(function(f) {
//                         return { department: f.department, urgency: f.urgency, minCost: f.minCost, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: val };
//                       });
//                     }}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={function() { setShowFilters(function(s) { return !s; }); }}
//                     className={filterBtnCls}
//                   >
//                     <FaFilter />
//                     <span>Filters</span>
//                     <FaChevronDown className={chevronCls} />
//                   </button>
//                   <button
//                     onClick={function() { setFilters(EMPTY_FILTERS); }}
//                     className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2"
//                   >
//                     <FaTimes /><span>Clear</span>
//                   </button>
//                 </div>
//               </div>

//               {showFilters && (
//                 <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                     <select
//                       value={filters.department}
//                       onChange={function(e) {
//                         var val = e.target.value;
//                         setFilters(function(f) { return { department: val, urgency: f.urgency, minCost: f.minCost, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">All Departments</option>
//                       {DEPARTMENTS.map(function(d) { return <option key={d} value={d}>{d}</option>; })}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
//                     <select
//                       value={filters.urgency}
//                       onChange={function(e) {
//                         var val = e.target.value;
//                         setFilters(function(f) { return { department: f.department, urgency: val, minCost: f.minCost, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">All</option>
//                       {URGENCY_LEVELS.map(function(l) {
//                         var label = l.charAt(0).toUpperCase() + l.slice(1);
//                         return <option key={l} value={l}>{label}</option>;
//                       })}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
//                     <div className="flex gap-2">
//                       <input
//                         type="number" placeholder="Min"
//                         value={filters.minCost}
//                         onChange={function(e) {
//                           var val = e.target.value;
//                           setFilters(function(f) { return { department: f.department, urgency: f.urgency, minCost: val, maxCost: f.maxCost, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
//                         }}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       />
//                       <input
//                         type="number" placeholder="Max"
//                         value={filters.maxCost}
//                         onChange={function(e) {
//                           var val = e.target.value;
//                           setFilters(function(f) { return { department: f.department, urgency: f.urgency, minCost: f.minCost, maxCost: val, processingTime: f.processingTime, requiredDocuments: f.requiredDocuments, search: f.search }; });
//                         }}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
//                     <input
//                       type="text" placeholder="e.g., 3-5 days"
//                       value={filters.processingTime}
//                       onChange={function(e) {
//                         var val = e.target.value;
//                         setFilters(function(f) { return { department: f.department, urgency: f.urgency, minCost: f.minCost, maxCost: f.maxCost, processingTime: val, requiredDocuments: f.requiredDocuments, search: f.search }; });
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div className="md:col-span-2 lg:col-span-3">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
//                     <div className="flex flex-wrap gap-2">
//                       {DOCUMENT_OPTIONS.map(function(doc) {
//                         var isActive = filters.requiredDocuments.indexOf(doc.value) !== -1;
//                         var btnCls = 'px-4 py-2 rounded-full text-sm font-medium transition-all ' + (isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200');
//                         return (
//                           <button key={doc.value} onClick={function() { toggleDocument(doc.value); }} className={btnCls}>
//                             {doc.label}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Service cards */}
//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
//               </div>
//             ) : services.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//                 <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
//                 <p className="text-gray-500">Try adjusting your filters or search term</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {services.map(function(service) {
//                   var dept = DEPT_COLOR[service.department] || DEPT_COLOR.default;
//                   var urg  = URGENCY_PILL[service.urgency]  || URGENCY_PILL.medium;
//                   var userEmail  = getUserEmail();
//                   var userName   = getUserName();
//                   var mailtoHref = buildMailtoLink(service.email, service.name, userEmail, userName);
//                   var callHref   = service.helpline ? 'tel:' + service.helpline : null;
//                   var mapTo      = '/nearby?serviceId=' + service._id;

//                   return (
//                     <div
//                       key={service._id}
//                       className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md"
//                       style={{ minHeight: '470px' }}
//                     >
//                       {/* Card header */}
//                       <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
//                         <div className="flex items-center gap-2 mb-2.5">
//                           <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: dept.bg }}>
//                             <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
//                               <rect x="1.5" y="2" width="11" height="10" rx="1.2" stroke={dept.stroke} strokeWidth="1.2"/>
//                               <path d="M4.5 6.5h5M4.5 9h3" stroke={dept.stroke} strokeWidth="1.1" strokeLinecap="round"/>
//                             </svg>
//                           </span>
//                           <span className="text-xs font-medium truncate" style={{ color: dept.text }}>{service.department}</span>
//                           <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: urg.bg, color: urg.text }}>{urg.label}</span>
//                         </div>
//                         <h3 className="text-sm font-semibold text-gray-800 leading-snug truncate">{service.name}</h3>
//                         <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{service.description}</p>
//                       </div>

//                       {/* Card body */}
//                       <div className="px-4 py-3 flex flex-col gap-2.5 flex-1 overflow-hidden">
//                         <MetaRow iconBg="#EAF3DE" icon={IconClock} label="Processing">
//                           <span className="text-xs font-medium text-gray-700">{service.processingTime}</span>
//                         </MetaRow>
//                         <MetaRow iconBg="#E1F5EE" icon={IconPerson} label="Eligibility">
//                           <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.eligibilityCriteria}</span>
//                         </MetaRow>
//                         {service.location && (
//                           <MetaRow iconBg="#FBEAF0" icon={IconPin} label="Location">
//                             <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.location}</span>
//                           </MetaRow>
//                         )}
//                         <div className="h-px bg-gray-100 my-0.5 flex-shrink-0" />
//                         <MetaRow iconBg="#EEEDFE" icon={IconDoc} label="Documents">
//                           <div className="flex flex-wrap gap-1">
//                             {service.requiredDocuments.length > 0
//                               ? service.requiredDocuments.map(function(doc, i) {
//                                   var c = DOC_TAG_COLORS[i % DOC_TAG_COLORS.length];
//                                   var found = DOCUMENT_OPTIONS.filter(function(d) { return d.value === doc; })[0];
//                                   var docLabel = found ? found.label : doc;
//                                   return (
//                                     <span key={doc} className="px-1.5 py-px rounded text-xs font-medium" style={{ background: c.bg, color: c.text }}>
//                                       {docLabel}
//                                     </span>
//                                   );
//                                 })
//                               : <span className="text-xs text-gray-400">None required</span>
//                             }
//                           </div>
//                         </MetaRow>
//                         <MetaRow iconBg="#E1F5EE" icon={IconCheck} label="Cost">
//                           <span className="text-sm font-semibold" style={{ color: '#0F6E56' }}>
//                             {costFormatter.format(service.cost)}
//                           </span>
//                         </MetaRow>
//                       </div>

//                       {/* Footer actions */}
//                       <div className="grid grid-cols-4 gap-1.5 px-3 pb-3 flex-shrink-0">
//                         <ActionBtn href={service.website} bg="#E6F1FB" color="#0C447C" IconComp={IconWeb}   label="Website" disabled={!service.website} />
//                         <ActionBtn href={callHref}        bg="#EAF3DE" color="#27500A" IconComp={IconPhone} label="Call"    disabled={!service.helpline} />
//                         <ActionBtn href={mailtoHref}      bg="#EEEDFE" color="#26215C" IconComp={IconMail}  label="Email"  disabled={!service.email} />
//                         <ActionBtn to={mapTo}             bg="#FCEBEB" color="#791F1F" IconComp={IconMap}   label="Map" />
//                       </div>

//                       <div className="grid grid-cols-2 gap-2 px-3 pb-3 flex-shrink-0">
//                         <Link
//                           to={'/apply-service/' + service._id}
//                           className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold transition-colors hover:bg-blue-700"
//                         >
//                           <FaPaperPlane className="w-4 h-4" />
//                           Apply
//                         </Link>
//                         <button type="button" onClick={function() { setFeedbackService(service); }} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold transition-colors hover:bg-blue-100">
//                           <FaCommentAlt className="w-4 h-4" />
//                           Feedback
//                         </button>
//                       </div>
//                       <div className="px-3 pb-3 flex-shrink-0">
//                         <button type="button" onClick={function() { setConsultationService(service); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
//                           <FaVideo className="w-4 h-4" />
//                           Request consultation
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ════ HELPLINES TAB ════ */}
//         {activeTab === 'helplines' && (
//           <div>
//             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search helplines by name or description..."
//                     value={helplineSearch}
//                     onChange={function(e) { setHelplineSearch(e.target.value); }}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <select
//                   value={helplineCategory}
//                   onChange={function(e) { setHelplineCategory(e.target.value); }}
//                   className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   {HELPLINE_CATEGORIES.map(function(c) {
//                     var lbl = HELPLINE_CATEGORY_LABELS[c] || c;
//                     return <option key={c} value={c}>{lbl}</option>;
//                   })}
//                 </select>
//               </div>
//             </div>

//             {helplines.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//                 <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No helplines found</h3>
//                 <p className="text-gray-500">Try a different category or search term</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {helplines.map(function(helpline) {
//                   var s = CATEGORY_STYLES[helpline.category] || CATEGORY_STYLES.default;
//                   var Icon = s.icon;
//                   return (
//                     <div key={helpline._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md">

//                       {/* Colored header */}
//                       <div className="flex items-center gap-3 px-4 py-4 flex-shrink-0" style={{ background: s.hdrBg }}>
//                         <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg }}>
//                           <Icon className="w-5 h-5 text-white" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-sm font-semibold text-gray-800 truncate">{helpline.name}</h3>
//                           <p className="text-xs font-medium mt-0.5" style={{ color: s.catText }}>{helpline.category}</p>
//                         </div>
//                         <div className="flex flex-col gap-1 flex-shrink-0">
//                           {helpline.isEmergency && (
//                             <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#FCEBEB', color: '#791F1F' }}>Emergency</span>
//                           )}
//                           {helpline.available24x7 && (
//                             <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#EAF3DE', color: '#27500A' }}>24/7</span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Numbers */}
//                       <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
//                         <p className="text-xs font-medium tracking-widest text-gray-400">CONTACT</p>
//                         {helpline.numbers.map(function(num, i) {
//                           var telHref = 'tel:' + num;
//                           return (
//                             <a key={i} href={telHref} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80 group" style={{ background: s.numBg }}>
//                               <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
//                                 <path d="M2.5 2.5h3l1 3-1.5 1A7 7 0 008.5 10l1-1.5 3 1V12c0 .6-.5 1-1 1C4 13 1 10 1 5.5c0-.5.5-1 1-1l.5-2z" stroke={s.numStroke} strokeWidth="1.2"/>
//                               </svg>
//                               <span className="text-sm font-semibold flex-1" style={{ color: s.numText }}>{num}</span>
//                               <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: s.numText }} />
//                             </a>
//                           );
//                         })}
//                       </div>

//                       {/* Website */}
//                       {helpline.website && (
//                         <div className="px-4 pb-2">
//                           <a href={helpline.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition group">
//                             <FaGlobe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
//                             <span className="text-xs font-medium text-gray-600 flex-1 truncate">Visit official website</span>
//                             <FaExternalLinkAlt className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
//                           </a>
//                         </div>
//                       )}

//                       {/* Description */}
//                       {helpline.description && (
//                         <div className="px-4 pb-3">
//                           <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg leading-relaxed line-clamp-2">
//                             <FaInfoCircle className="inline mr-1 text-gray-400" />
//                             {helpline.description}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//       </div>
//       {consultationService && <ConsultationModal service={consultationService} onSubmitted={showFeedbackSuccess} onClose={function() { setConsultationService(null); }} />}
//       {feedbackService && <FeedbackModal service={feedbackService} onSubmitted={showFeedbackSuccess} onClose={function() { setFeedbackService(null); }} />}
//       {feedbackSuccess && (
//         <div className="fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg" role="status">
//           <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">✓</span>
//           Feedback submitted. Thank you for sharing your experience.
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import axiosAuth from '../config/axiosInstance';
import {
  FaSearch, FaFilter, FaPhone, FaTimes, FaChevronDown,
  FaExclamationTriangle, FaAmbulance, FaFire, FaShieldAlt,
  FaBolt, FaRoad, FaHospital, FaSchool, FaCity, FaGlobe,
  FaExternalLinkAlt, FaInfoCircle, FaDollarSign, FaPaperPlane, FaCommentAlt,
  FaStar, FaRegStar, FaVideo
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

// Complaint records are kept in the database for the Complaints module but do
// not belong in this citizen-services directory. This client-side guard keeps
// the page clean even when it is connected to an older backend deployment.
var COMPLAINT_ENTRY_PATTERN = /\b(complaint|garbage|waste collection|road maintenance|road repair|pothole|drainage|streetlight|sewerage|sanitation|water supply issue|encroachment)\b/i;

function isComplaintEntry(service) {
  return COMPLAINT_ENTRY_PATTERN.test([
    service.name || '',
    service.description || '',
    service.department || ''
  ].join(' '));
}

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

// ── ConsultationModal ─────────────────────────────────────────────────────────

function ConsultationModal(props) {
  var services = props.services || [];
  var onClose = props.onClose;
  var onSubmitted = props.onSubmitted;
  var initialEmail = getUserEmail();
  var initialName = getUserName();

  // State for selected service
  var selectedServiceIdState = useState('');
  var selectedServiceId = selectedServiceIdState[0];
  var setSelectedServiceId = selectedServiceIdState[1];

  var formState = useState({
    preferredDate: '',
    preferredTime: '',
    reason: '',
    alternateEmail: initialEmail,
    location: 'Online video consultation'
  });
  var formData = formState[0];
  var setFormData = formState[1];
  var submittingState = useState(false);
  var submitting = submittingState[0];
  var setSubmitting = submittingState[1];
  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];
  var successState = useState(false);
  var success = successState[0];
  var setSuccess = successState[1];

  function updateField(event) {
    var name = event.target.name;
    var value = event.target.value;
    setFormData(function(prev) { return Object.assign({}, prev, { [name]: value }); });
    setError('');
  }

  function submitConsultation(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    // Find selected service
    var selectedService = services.find(function(s) { return s._id === selectedServiceId; });
    if (!selectedService) {
      setError('Please select a service.');
      setSubmitting(false);
      return;
    }

    axiosAuth.post('/api/appointments/consultation-request', {
      serviceId: selectedService._id,
      serviceName: selectedService.name,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      reason: formData.reason,
      alternateEmail: formData.alternateEmail,
      location: formData.location
    })
      .then(function() {
        setSuccess(true);
        onSubmitted();
      })
      .catch(function(requestError) {
        setError(requestError.response?.data?.message || 'Could not submit consultation request. Please try again.');
      })
      .finally(function() { setSubmitting(false); });
  }

  function closeAndReset() {
    setSuccess(false);
    setError('');
    setSelectedServiceId('');
    setFormData({
      preferredDate: '',
      preferredTime: '',
      reason: '',
      alternateEmail: initialEmail,
      location: 'Online video consultation'
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-blue-600">Video consultation</p>
            <h2 id="consultation-title" className="mt-1 text-xl font-bold text-gray-900">Request a consultation</h2>
            <p className="mt-1 text-sm text-gray-500">Choose a service, pick a future time, and share the reason so our team can confirm the meeting.</p>
          </div>
          <button type="button" onClick={closeAndReset} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 rounded-lg" aria-label="Close consultation form"><FaTimes /></button>
        </div>
        {success ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><FaVideo /></div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Consultation request received</h3>
            <p className="mt-2 text-sm text-gray-600">Your request has been submitted. An admin will review it and confirm a suitable time shortly.</p>
            <button type="button" onClick={closeAndReset} className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Close</button>
          </div>
        ) : (
          <form onSubmit={submitConsultation} className="px-6 py-5 space-y-5">
            {/* Service dropdown */}
            <div>
              <label className="text-sm font-medium text-gray-700">Service *</label>
              <select
                value={selectedServiceId}
                onChange={function(e) { setSelectedServiceId(e.target.value); setError(''); }}
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select a service --</option>
                {services.map(function(s) {
                  return <option key={s._id} value={s._id}>{s.name} ({s.department})</option>;
                })}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Preferred date</label>
                <input type="date" name="preferredDate" value={formData.preferredDate} onChange={updateField} min={new Date().toISOString().split('T')[0]} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Preferred time</label>
                <input type="time" name="preferredTime" value={formData.preferredTime} onChange={updateField} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Reason for consultation</label>
              <textarea name="reason" value={formData.reason} onChange={updateField} rows="4" placeholder="Tell us what you need help with..." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Alternate email</label>
                <input type="email" name="alternateEmail" value={formData.alternateEmail} onChange={updateField} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="optional" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Preferred meeting mode</label>
                <input type="text" name="location" value={formData.location} onChange={updateField} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={closeAndReset} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit request'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── FeedbackModal ────────────────────────────────────────────────────────────

function FeedbackModal(props) {
  var service = props.service;
  var onClose = props.onClose;
  var onSubmitted = props.onSubmitted;
  var ratingState = useState(null);
  var rating = ratingState[0];
  var setRating = ratingState[1];
  var tagsState = useState([]);
  var tags = tagsState[0];
  var setTags = tagsState[1];
  var commentState = useState('');
  var comment = commentState[0];
  var setComment = commentState[1];
  var submittingState = useState(false);
  var submitting = submittingState[0];
  var setSubmitting = submittingState[1];
  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];
  var feedbackTags = [
    '⚡ Quick Service',
    '👨‍💼 Helpful Staff',
    '😐 Average Experience',
    '⏳ Long Waiting Time',
    '👎 Poor Service'
  ];

  function quickFeedbackText(tag) {
    return tag.replace(/^[^A-Za-z]+/, '').trim();
  }

  function toggleTag(tag) {
    var isSelected = tags.indexOf(tag) !== -1;
    var nextTags = isSelected
      ? tags.filter(function(selectedTag) { return selectedTag !== tag; })
      : tags.concat(tag);

    setComment(function(previousComment) {
      var commentWithoutQuickFeedback = feedbackTags.reduce(function(updatedComment, feedbackTag) {
        var feedbackText = quickFeedbackText(feedbackTag);
        return updatedComment.replaceAll(feedbackText + ', ', '').replaceAll(feedbackText, '');
      }, previousComment);
      var quickFeedbackComment = nextTags.map(quickFeedbackText).join(', ');

      return quickFeedbackComment
        ? quickFeedbackComment + ', ' + commentWithoutQuickFeedback
        : commentWithoutQuickFeedback;
    });

    setTags(nextTags);
  }

  function submitFeedback(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    axiosAuth.post('/api/service-feedback', { serviceId: service._id, rating: rating, tags: tags, comment: comment })
      .then(function() { onSubmitted(); onClose(); })
      .catch(function(requestError) { setError(requestError.response?.data?.message || 'Could not submit feedback. Please try again.'); })
      .finally(function() { setSubmitting(false); });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <form onSubmit={submitFeedback} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div><p className="text-sm font-semibold text-blue-600">Service feedback</p><h2 id="feedback-title" className="mt-1 text-xl font-bold text-gray-900">{service.name}</h2><p className="mt-1 text-sm text-gray-500">Share your experience — every field is optional.</p></div>
          <button type="button" onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 rounded-lg" aria-label="Close feedback form"><FaTimes /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div><p className="mb-2 text-sm font-medium text-gray-700">Rating <span className="font-normal text-gray-400">(optional)</span></p><div className="flex gap-1" aria-label="Choose a rating from 1 to 5">{[1, 2, 3, 4, 5].map(function(star) { var selected = rating !== null && star <= rating; return <button key={star} type="button" onClick={function() { setRating(rating === star ? null : star); }} className="p-1 text-2xl text-amber-400 hover:scale-110 transition-transform" aria-label={star + ' star' + (star > 1 ? 's' : '')}>{selected ? <FaStar /> : <FaRegStar />}</button>; })}</div></div>
          <div><p className="mb-2 text-sm font-medium text-gray-700">Quick feedback <span className="font-normal text-gray-400">(select all that apply)</span></p><div className="flex flex-wrap gap-2">{feedbackTags.map(function(tag) { var selected = tags.indexOf(tag) !== -1; return <button key={tag} type="button" onClick={function() { toggleTag(tag); }} aria-pressed={selected} className={'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ' + (selected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100')}>{tag}</button>; })}</div></div>
          <div><label htmlFor="service-feedback-comment" className="text-sm font-medium text-gray-700">Your experience <span className="font-normal text-gray-400">(optional)</span></label><textarea id="service-feedback-comment" value={comment} onChange={function(event) { setComment(event.target.value); }} maxLength="2000" rows="4" placeholder="Tell us about your experience..." className="w-full px-3 py-2.5 mt-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit feedback'}</button></div>
      </form>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Services() {
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

  var feedbackServiceState = useState(null);
  var feedbackService = feedbackServiceState[0];
  var setFeedbackService = feedbackServiceState[1];

  // State for showing the consultation modal (global)
  var showConsultationModalState = useState(false);
  var showConsultationModal = showConsultationModalState[0];
  var setShowConsultationModal = showConsultationModalState[1];

  var feedbackSuccessState = useState(false);
  var feedbackSuccess = feedbackSuccessState[0];
  var setFeedbackSuccess = feedbackSuccessState[1];

  function showFeedbackSuccess() {
    setFeedbackSuccess(true);
    window.setTimeout(function() { setFeedbackSuccess(false); }, 3500);
  }

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
    params.set('excludeComplaints', 'true');
    axiosAuth.get('/api/services?' + params.toString())
      .then(function(res) { setServices((res.data || []).filter(function(service) { return !isComplaintEntry(service); })); })
      .catch(function(err) { console.error('Error fetching services:', err); })
      .finally(function() { setLoading(false); });
  }, [filters]);

  var fetchHelplines = useCallback(function() {
    var params = new URLSearchParams();
    if (helplineCategory) params.append('category', helplineCategory);
    if (helplineSearch)   params.append('search',   helplineSearch);
    axiosAuth.get('/api/helplines?' + params.toString())
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with global consultation button */}
        <div className="mb-7 bg-gradient-to-r from-[#354D39] to-[#213126] rounded-2xl shadow-lg p-6 text-[#FEE8C8] border border-[#769E7C]/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Service &amp; Helpline Directory</h1>
            <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
          </div>
          <button
            onClick={function() { setShowConsultationModal(true); }}
            className="bg-[#9DC8B9] text-[#293B2C] border border-[#9DC8B9] px-6 py-3 rounded-xl font-bold hover:bg-[#B5D8CC] transition-all flex items-center gap-2 shadow-lg text-sm whitespace-nowrap"
          >
            <FaVideo /> Request Consultation
          </button>
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
                    className="px-5 py-3 bg-[#3E5758] text-[#FBF2C0] border border-[#CCE3DE]/40 rounded-xl hover:bg-[#21464B] flex items-center gap-2"
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

                  return (
                    <div
                      key={service._id}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                      style={{ minHeight: '470px' }}
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
                          <span className="text-xs font-semibold truncate text-[#9DC8B9]">{service.department}</span>
                          <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: urg.bg, color: urg.text }}>{urg.label}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug truncate">{service.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{service.description}</p>
                      </div>

                      {/* Card body */}
                      <div className="px-4 py-3 flex flex-col gap-2.5 flex-1 overflow-hidden">
                        <MetaRow iconBg="#EAF3DE" icon={IconClock} label="Processing">
                          <span className="text-sm font-bold text-[#9DC8B9]">{service.processingTime}</span>
                        </MetaRow>
                        <MetaRow iconBg="#E1F5EE" icon={IconPerson} label="Eligibility">
                          <span className="text-xs font-medium text-[#9DC8B9]/70 line-clamp-1">{service.eligibilityCriteria}</span>
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
                          <span className="text-base font-black text-[#EAB29F]">
                            {costFormatter.format(service.cost)}
                          </span>
                        </MetaRow>
                      </div>

                      {/* Footer actions */}
                      <div className="grid grid-cols-4 gap-1.5 px-3 pb-3 flex-shrink-0">
                        <ActionBtn href={service.website} bg="#E6F1FB" color="#0C447C" IconComp={IconWeb}   label="Website" disabled={!service.website} />
                        <ActionBtn href={callHref}        bg="#EAF3DE" color="#27500A" IconComp={IconPhone} label="Call"    disabled={!service.helpline} />
                        <ActionBtn href={mailtoHref}      bg="#EEEDFE" color="#26215C" IconComp={IconMail}  label="Email"  disabled={!service.email} />
                        <ActionBtn to={mapTo}             bg="#FCEBEB" color="#791F1F" IconComp={IconMap}   label="Map" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 px-3 pb-3 flex-shrink-0">
                        <Link
                          to={'/apply-service/' + service._id}
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#EAB29F] to-[#D99A85] text-[#293B2C] font-bold transition-all hover:brightness-110 shadow-md"
                        >
                          <FaPaperPlane className="w-4 h-4" />
                          Apply
                        </Link>
                        <button type="button" onClick={function() { setFeedbackService(service); }} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#3A4A3A] text-[#9DC8B9] border border-[#9DC8B9]/45 font-bold transition-all hover:bg-[#9DC8B9] hover:text-[#293B2C] hover:-translate-y-0.5">
                          <FaCommentAlt className="w-4 h-4" />
                          Feedback
                        </button>
                      </div>
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
                    <div key={helpline._id} className="bg-[#3A4A3A] border border-[#9DC8B9]/25 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-[#769E7C] hover:-translate-y-1 hover:shadow-xl">

                      {/* Colored header */}
                      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0 bg-[#344A38] border-b border-[#9DC8B9]/15">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">{helpline.name}</h3>
                          <p className="text-xs font-semibold mt-1 text-[#9DC8B9]">{helpline.category}</p>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          {helpline.isEmergency && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAB29F]/15 text-[#EAB29F] border border-[#EAB29F]/30">Emergency</span>
                          )}
                          {helpline.available24x7 && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#769E7C]/20 text-[#9DC8B9] border border-[#769E7C]/35">24/7</span>
                          )}
                        </div>
                      </div>

                      {/* Numbers */}
                      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
                        <p className="text-xs font-bold tracking-widest text-[#9DC8B9]/65">CONTACT</p>
                        {helpline.numbers.map(function(num, i) {
                          var telHref = 'tel:' + num;
                          return (
                            <a key={i} href={telHref} className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all group bg-[#405644] border border-[#9DC8B9]/20 hover:border-[#9DC8B9]/55 hover:bg-[#465E4A]">
                              <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
                                <path d="M2.5 2.5h3l1 3-1.5 1A7 7 0 008.5 10l1-1.5 3 1V12c0 .6-.5 1-1 1C4 13 1 10 1 5.5c0-.5.5-1 1-1l.5-2z" stroke="#9DC8B9" strokeWidth="1.2"/>
                              </svg>
                              <span className="text-base font-bold flex-1 text-[#FEE8C8]">{num}</span>
                              <FaExternalLinkAlt className="w-3 h-3 text-[#9DC8B9] opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                          );
                        })}
                      </div>

                      {/* Website */}
                      {helpline.website && (
                        <div className="px-4 pb-2">
                          <a href={helpline.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#344A38] border border-[#9DC8B9]/15 hover:border-[#9DC8B9]/40 transition group">
                            <FaGlobe className="w-3.5 h-3.5 text-[#9DC8B9] flex-shrink-0" />
                            <span className="text-xs font-semibold text-[#9DC8B9] flex-1 truncate">Visit official website</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5 text-[#9DC8B9] opacity-50 group-hover:opacity-100 transition" />
                          </a>
                        </div>
                      )}

                      {/* Description */}
                      {helpline.description && (
                        <div className="px-4 pb-3">
                          <p className="text-xs text-[#9DC8B9]/75 bg-[#344A38] border border-[#9DC8B9]/10 px-3 py-2.5 rounded-lg leading-relaxed line-clamp-2">
                            <FaInfoCircle className="inline mr-1 text-[#EAB29F]" />
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

      {/* Consultation Modal - global */}
      {showConsultationModal && (
        <ConsultationModal
          services={services}
          onSubmitted={showFeedbackSuccess}
          onClose={function() { setShowConsultationModal(false); }}
        />
      )}

      {/* Feedback Modal (per service) */}
      {feedbackService && (
        <FeedbackModal
          service={feedbackService}
          onSubmitted={showFeedbackSuccess}
          onClose={function() { setFeedbackService(null); }}
        />
      )}

      {/* Success toast */}
      {feedbackSuccess && (
        <div className="fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg" role="status">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">✓</span>
          Feedback submitted. Thank you for sharing your experience.
        </div>
      )}
    </div>
  );
}
