
/**
 * seedOffices.js
 * ──────────────────────────────────────────────────────────────────────────
 * Automatically seeds realistic Bangladeshi government offices into MongoDB.
 *
 * HOW TO RUN:
 *   1. Make sure your .env has MONGO_URI set (same as your server uses)
 *   2. From your server folder run:
 *        node seedOffices.js
 *
 * WHAT IT DOES:
 *   - Reads all services from your services collection
 *   - Matches each service to its department
 *   - Inserts 5-10 real offices per service (Dhaka + other cities)
 *   - Skips any office that already exists (safe to re-run)
 * ──────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Service  = require('./models/Service');   // adjust path if needed
const Office   = require('./models/Office');    // adjust path if needed

// ── Office data grouped by department ─────────────────────────────────────────
// Each entry has real coordinates (lat/lng) for Bangladesh
const OFFICES_BY_DEPARTMENT = {

  'Passport Office': [
    { name: 'Department of Immigration & Passports – Agargaon', address: 'Agargaon, Sher-e-Bangla Nagar, Dhaka-1207', latitude: 23.7806, longitude: 90.3672, phone: '01700000001', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Uttara',         address: 'House 5, Road 7, Sector 4, Uttara, Dhaka-1230',        latitude: 23.8735, longitude: 90.3885, phone: '01700000002', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Motijheel',      address: '67/A Dilkusha C/A, Motijheel, Dhaka-1000',            latitude: 23.7295, longitude: 90.4179, phone: '01700000003', openingHours: 'Sun–Thu 9:00 AM – 4:30 PM' },
    { name: 'Passport Office – Mirpur',         address: 'Section 2, Mirpur, Dhaka-1216',                       latitude: 23.8040, longitude: 90.3549, phone: '01700000004', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Narayanganj',    address: '2 BB Road, Narayanganj-1400',                         latitude: 23.6238, longitude: 90.4996, phone: '01700000005', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Chittagong',     address: 'Agrabad, Chittagong-4100',                            latitude: 22.3303, longitude: 91.8165, phone: '01700000006', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Sylhet',         address: 'Zindabazar, Sylhet-3100',                             latitude: 24.8955, longitude: 91.8687, phone: '01700000007', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Rajshahi',       address: 'Shaheb Bazar, Rajshahi-6000',                         latitude: 24.3745, longitude: 88.6042, phone: '01700000008', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Khulna',         address: 'KDA Avenue, Khulna-9100',                             latitude: 22.8456, longitude: 89.5403, phone: '01700000009', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Passport Office – Gazipur',        address: 'Chandona Chowrasta, Gazipur-1700',                    latitude: 23.9999, longitude: 90.4153, phone: '01700000010', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],

  'Electricity': [
    { name: 'DPDC Customer Care – Motijheel',   address: 'Motijheel, Dhaka-1000',                               latitude: 23.7338, longitude: 90.4149, phone: '16116', openingHours: 'Sun–Thu 8:00 AM – 4:00 PM' },
    { name: 'DPDC Office – Gulshan',            address: 'Plot 1, Road 90, Gulshan-2, Dhaka-1212',              latitude: 23.7944, longitude: 90.4144, phone: '16116', openingHours: 'Sun–Thu 8:00 AM – 4:00 PM' },
    { name: 'DESCO Office – Mirpur',            address: 'DESCO Bhaban, 2 Kamal Ataturk Ave, Mirpur-1216',      latitude: 23.8088, longitude: 90.3536, phone: '16116', openingHours: 'Sun–Thu 8:00 AM – 4:00 PM' },
    { name: 'DESCO Office – Uttara',            address: 'Road 3, Sector 3, Uttara, Dhaka-1230',                latitude: 23.8694, longitude: 90.3965, phone: '16116', openingHours: 'Sun–Thu 8:00 AM – 4:00 PM' },
    { name: 'REB Office – Gazipur',             address: 'Chandona, Gazipur-1700',                              latitude: 24.0084, longitude: 90.4228, phone: '01700000020', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BPDB Office – Narayanganj',        address: 'Tanbazar, Narayanganj-1400',                          latitude: 23.6100, longitude: 90.5002, phone: '01700000021', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'CPGCBL Office – Chittagong',       address: 'Pahartali, Chittagong-4202',                          latitude: 22.3945, longitude: 91.7994, phone: '01700000022', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BPDB Office – Sylhet',             address: 'Taltala, Sylhet-3100',                                latitude: 24.8870, longitude: 91.8758, phone: '01700000023', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],

  'Road Maintenance': [
    { name: 'Roads & Highways – Dhaka Division HQ',   address: 'Tejgaon, Dhaka-1208',                         latitude: 23.7645, longitude: 90.4014, phone: '16456', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'RHD Office – Mirpur',                    address: 'Mirpur-1, Dhaka-1216',                         latitude: 23.8021, longitude: 90.3614, phone: '01700000031', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'RHD Office – Mohakhali',                 address: 'Mohakhali, Dhaka-1212',                        latitude: 23.7779, longitude: 90.4006, phone: '01700000032', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'RHD Sub-division – Demra',               address: 'Demra, Dhaka-1360',                            latitude: 23.7124, longitude: 90.4682, phone: '01700000033', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'RHD Office – Narayanganj',               address: 'Fatullah, Narayanganj-1400',                   latitude: 23.5991, longitude: 90.4888, phone: '01700000034', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'RHD Office – Chittagong',                address: 'Muradpur, Chittagong-4202',                    latitude: 22.3777, longitude: 91.8072, phone: '01700000035', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'RHD Office – Gazipur',                   address: 'Joydebpur, Gazipur-1700',                      latitude: 23.9905, longitude: 90.4132, phone: '01700000036', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'RHD Office – Sylhet',                    address: 'Ambarkhana, Sylhet-3100',                      latitude: 24.8847, longitude: 91.8829, phone: '01700000037', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],

  'Waste Management': [
    { name: 'DSCC Waste Mgmt – Motijheel',     address: 'Nagar Bhaban, Fulbaria, Dhaka-1000',                 latitude: 23.7279, longitude: 90.4104, phone: '01700000041', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DSCC Office – Demra',             address: 'Demra, Dhaka-1360',                                  latitude: 23.7200, longitude: 90.4600, phone: '01700000042', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DSCC Office – Lalbagh',           address: 'Lalbagh, Dhaka-1211',                                latitude: 23.7205, longitude: 90.3920, phone: '01700000043', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DNCC Office – Mirpur',            address: 'Mirpur-10, Dhaka-1216',                              latitude: 23.8074, longitude: 90.3651, phone: '01700000044', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DNCC Office – Uttara',            address: 'Sector 7, Uttara, Dhaka-1230',                       latitude: 23.8721, longitude: 90.3972, phone: '01700000045', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'CCC Waste Office – Chittagong',   address: 'Tiger Pass, Chittagong-4000',                        latitude: 22.3384, longitude: 91.8342, phone: '01700000046', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'SCC Waste Office – Sylhet',       address: 'Chowhatta, Sylhet-3100',                             latitude: 24.8941, longitude: 91.8791, phone: '01700000047', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],

  'Health Services': [
    { name: 'DGHS Headquarters',               address: 'Mohakhali, Dhaka-1212',                              latitude: 23.7803, longitude: 90.4038, phone: '16321', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Dhaka Medical College Hospital',  address: 'Bakshibazar, Dhaka-1000',                            latitude: 23.7229, longitude: 90.3974, phone: '01700000051', openingHours: 'Open 24 hours' },
    { name: 'Sir Salimullah Medical College',  address: 'Mitford, Dhaka-1100',                                latitude: 23.7113, longitude: 90.4048, phone: '01700000052', openingHours: 'Open 24 hours' },
    { name: 'Shaheed Suhrawardy Hospital',     address: 'Sher-e-Bangla Nagar, Dhaka-1207',                   latitude: 23.7752, longitude: 90.3714, phone: '01700000053', openingHours: 'Open 24 hours' },
    { name: 'National Heart Foundation',       address: 'Mirpur-2, Dhaka-1216',                               latitude: 23.8018, longitude: 90.3665, phone: '01700000054', openingHours: 'Open 24 hours' },
    { name: 'Chittagong Medical College',      address: 'K.B. Fazlul Kader Road, Chittagong-4203',            latitude: 22.3512, longitude: 91.8274, phone: '01700000055', openingHours: 'Open 24 hours' },
    { name: 'Sylhet MAG Osmani Hospital',      address: 'Osmani Medical College Road, Sylhet-3100',           latitude: 24.9072, longitude: 91.8579, phone: '01700000056', openingHours: 'Open 24 hours' },
    { name: 'Rajshahi Medical College',        address: 'Rajpara, Rajshahi-6000',                             latitude: 24.3797, longitude: 88.5918, phone: '01700000057', openingHours: 'Open 24 hours' },
    { name: 'Khulna Medical College',          address: 'Khan-A-Sabur Road, Khulna-9000',                     latitude: 22.8325, longitude: 89.5508, phone: '01700000058', openingHours: 'Open 24 hours' },
  ],

  'Education': [
    { name: 'DSHE Headquarters',               address: 'Bakshibazar, Dhaka-1000',                            latitude: 23.7295, longitude: 90.4072, phone: '01700000061', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DPE Head Office',                 address: 'Motijheel, Dhaka-1000',                              latitude: 23.7306, longitude: 90.4201, phone: '01700000062', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'University Grants Commission',    address: 'Agargaon, Dhaka-1207',                               latitude: 23.7801, longitude: 90.3741, phone: '01700000063', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Bangladesh Board of Education',   address: 'Bakshibazar, Dhaka-1000',                            latitude: 23.7234, longitude: 90.4003, phone: '01700000064', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Chittagong Education Board',      address: 'Dewan Hat, Chittagong-4000',                         latitude: 22.3414, longitude: 91.8363, phone: '01700000065', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Sylhet Education Board',          address: 'Tilagarh, Sylhet-3100',                              latitude: 24.9079, longitude: 91.8559, phone: '01700000066', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Rajshahi Education Board',        address: 'Rajpara, Rajshahi-6000',                             latitude: 24.3812, longitude: 88.5971, phone: '01700000067', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],

  'Revenue': [
    { name: 'NBR Headquarters',                address: 'Segunbagicha, Dhaka-1000',                           latitude: 23.7378, longitude: 90.4117, phone: '16555', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Circle – Motijheel',          address: 'Dilkusha, Motijheel, Dhaka-1000',                   latitude: 23.7310, longitude: 90.4188, phone: '01700000071', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Circle – Uttara',             address: 'Sector 7, Uttara, Dhaka-1230',                       latitude: 23.8699, longitude: 90.3941, phone: '01700000072', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Circle – Mirpur',             address: 'Mirpur-1, Dhaka-1216',                               latitude: 23.8028, longitude: 90.3620, phone: '01700000073', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Circle – Gulshan',            address: 'Gulshan-1, Dhaka-1212',                              latitude: 23.7893, longitude: 90.4085, phone: '01700000074', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NBR Office – Chittagong',         address: 'CDA Avenue, Chittagong-4100',                        latitude: 22.3473, longitude: 91.8258, phone: '01700000075', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NBR Office – Sylhet',             address: 'Zindabazar, Sylhet-3100',                            latitude: 24.8963, longitude: 91.8657, phone: '01700000076', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NBR Office – Rajshahi',           address: 'Ghoramara, Rajshahi-6100',                           latitude: 24.3688, longitude: 88.6149, phone: '01700000077', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],

  'Municipal Services': [
    { name: 'DSCC HQ – Nagar Bhaban',         address: 'Fulbaria, Dhaka-1000',                               latitude: 23.7231, longitude: 90.4088, phone: '16516', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DNCC HQ',                         address: 'Gulshan-2, Dhaka-1212',                              latitude: 23.7926, longitude: 90.4149, phone: '16516', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DSCC Regional – Dhanmondi',       address: 'Dhanmondi-15, Dhaka-1209',                           latitude: 23.7471, longitude: 90.3720, phone: '01700000081', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DNCC Regional – Mirpur',          address: 'Mirpur-12, Dhaka-1216',                              latitude: 23.8220, longitude: 90.3580, phone: '01700000082', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'DNCC Regional – Uttara',          address: 'Sector 6, Uttara, Dhaka-1230',                       latitude: 23.8745, longitude: 90.3994, phone: '01700000083', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'CCC – Chittagong',                address: 'Anderkilla, Chittagong-4000',                        latitude: 22.3316, longitude: 91.8346, phone: '01700000084', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'SCC – Sylhet',                    address: 'Chowhatta, Sylhet-3100',                             latitude: 24.8958, longitude: 91.8769, phone: '01700000085', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'KCC – Khulna',                    address: 'Khan Jahan Ali Road, Khulna-9100',                   latitude: 22.8380, longitude: 89.5481, phone: '01700000086', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],

  'Police': [
    { name: 'Bangladesh Police Headquarters',  address: 'Rajarbagh, Dhaka-1217',                              latitude: 23.7394, longitude: 90.4260, phone: '999', openingHours: 'Open 24 hours' },
    { name: 'Dhanmondi Police Station',        address: 'Dhanmondi, Dhaka-1209',                              latitude: 23.7533, longitude: 90.3752, phone: '01730000001', openingHours: 'Open 24 hours' },
    { name: 'Gulshan Police Station',          address: 'Gulshan-2, Dhaka-1212',                              latitude: 23.7957, longitude: 90.4134, phone: '01730000002', openingHours: 'Open 24 hours' },
    { name: 'Uttara Police Station',           address: 'Sector 4, Uttara, Dhaka-1230',                       latitude: 23.8742, longitude: 90.3897, phone: '01730000003', openingHours: 'Open 24 hours' },
    { name: 'Mirpur Police Station',           address: 'Mirpur-1, Dhaka-1216',                               latitude: 23.8062, longitude: 90.3553, phone: '01730000004', openingHours: 'Open 24 hours' },
    { name: 'Motijheel Police Station',        address: 'Motijheel, Dhaka-1000',                              latitude: 23.7340, longitude: 90.4196, phone: '01730000005', openingHours: 'Open 24 hours' },
    { name: 'Chittagong Metropolitan Police',  address: 'Dampara, Chittagong-4000',                           latitude: 22.3350, longitude: 91.8274, phone: '01730000006', openingHours: 'Open 24 hours' },
    { name: 'Sylhet Metropolitan Police',      address: 'Zindabazar, Sylhet-3100',                            latitude: 24.8960, longitude: 91.8726, phone: '01730000007', openingHours: 'Open 24 hours' },
  ],

  'Fire Service': [
    { name: 'Fire Service HQ – Mirpur',        address: 'Mirpur-14, Dhaka-1206',                              latitude: 23.8282, longitude: 90.3636, phone: '16163', openingHours: 'Open 24 hours' },
    { name: 'Siddhirganj Fire Station',        address: 'Siddhirganj, Narayanganj-1430',                      latitude: 23.6661, longitude: 90.4886, phone: '16163', openingHours: 'Open 24 hours' },
    { name: 'Fire Station – Motijheel',        address: 'Motijheel, Dhaka-1000',                              latitude: 23.7312, longitude: 90.4175, phone: '16163', openingHours: 'Open 24 hours' },
    { name: 'Fire Station – Mohammadpur',      address: 'Mohammadpur, Dhaka-1207',                            latitude: 23.7673, longitude: 90.3553, phone: '16163', openingHours: 'Open 24 hours' },
    { name: 'Fire Station – Uttara',           address: 'Uttara, Dhaka-1230',                                 latitude: 23.8726, longitude: 90.3953, phone: '16163', openingHours: 'Open 24 hours' },
    { name: 'Fire Station – Chittagong',       address: 'Muradpur, Chittagong-4202',                          latitude: 22.3811, longitude: 91.8085, phone: '16163', openingHours: 'Open 24 hours' },
    { name: 'Fire Station – Sylhet',           address: 'Taltala, Sylhet-3100',                               latitude: 24.8870, longitude: 91.8758, phone: '16163', openingHours: 'Open 24 hours' },
  ],

  'Ambulance': [
    { name: 'DGHS Ambulance Control – Dhaka', address: 'Mohakhali, Dhaka-1212',                               latitude: 23.7803, longitude: 90.4038, phone: '199', openingHours: 'Open 24 hours' },
    { name: 'Dhaka Medical Ambulance Depot',  address: 'Bakshibazar, Dhaka-1000',                             latitude: 23.7229, longitude: 90.3974, phone: '199', openingHours: 'Open 24 hours' },
    { name: 'Suhrawardy Hospital Ambulance',  address: 'Sher-e-Bangla Nagar, Dhaka-1207',                    latitude: 23.7752, longitude: 90.3714, phone: '199', openingHours: 'Open 24 hours' },
    { name: 'Chittagong Medical Ambulance',   address: 'K.B. Fazlul Kader Road, Chittagong-4203',             latitude: 22.3512, longitude: 91.8274, phone: '199', openingHours: 'Open 24 hours' },
    { name: 'Sylhet Osmani Ambulance Depot',  address: 'Osmani Medical College, Sylhet-3100',                 latitude: 24.9072, longitude: 91.8579, phone: '199', openingHours: 'Open 24 hours' },
    { name: 'Rajshahi Medical Ambulance',     address: 'Rajpara, Rajshahi-6000',                              latitude: 24.3797, longitude: 88.5918, phone: '199', openingHours: 'Open 24 hours' },
  ],
};

// ── Also seed by common service keywords (for services not matched by dept) ───
const OFFICES_BY_KEYWORD = {
  'driving': [
    { name: 'BRTA Head Office – Mirpur',       address: 'Mirpur-11, Dhaka-1216',                              latitude: 23.8254, longitude: 90.3680, phone: '01700000091', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BRTA Circle – Dhaka Metro West',  address: 'Mohammadpur, Dhaka-1207',                            latitude: 23.7650, longitude: 90.3562, phone: '01700000092', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BRTA Circle – Dhaka Metro East',  address: 'Demra, Dhaka-1360',                                  latitude: 23.7238, longitude: 90.4671, phone: '01700000093', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BRTA Circle – Gazipur',           address: 'Chandona, Gazipur-1700',                             latitude: 23.9956, longitude: 90.4175, phone: '01700000094', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BRTA Circle – Narayanganj',       address: 'Fatullah, Narayanganj-1400',                         latitude: 23.5926, longitude: 90.5031, phone: '01700000095', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BRTA Circle – Chittagong',        address: 'Pahartali, Chittagong-4202',                         latitude: 22.3940, longitude: 91.8120, phone: '01700000096', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BRTA Circle – Sylhet',            address: 'Airport Road, Sylhet-3100',                          latitude: 24.9028, longitude: 91.8832, phone: '01700000097', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'BRTA Circle – Rajshahi',          address: 'Uposhahar, Rajshahi-6200',                           latitude: 24.3965, longitude: 88.6303, phone: '01700000098', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],
  'nid': [
    { name: 'NID Registration – EC Headquarters',  address: 'Agargaon, Dhaka-1207',                           latitude: 23.7811, longitude: 90.3720, phone: '105', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NID Office – Dhaka District',          address: 'Khilgaon, Dhaka-1219',                          latitude: 23.7538, longitude: 90.4342, phone: '01700000101', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Upazila NID Office – Savar',           address: 'Savar Upazila, Dhaka-1340',                     latitude: 23.8450, longitude: 90.2707, phone: '01700000102', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Upazila NID Office – Keraniganj',      address: 'Keraniganj, Dhaka-1310',                        latitude: 23.6879, longitude: 90.3749, phone: '01700000103', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NID Office – Chittagong District',     address: 'Circuit House Road, Chittagong-4000',            latitude: 22.3393, longitude: 91.8321, phone: '01700000104', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NID Office – Sylhet District',         address: 'DC Office Road, Sylhet-3100',                   latitude: 24.8949, longitude: 91.8614, phone: '01700000105', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NID Office – Rajshahi District',       address: 'Rajshahi Collectorate, Rajshahi-6000',           latitude: 24.3711, longitude: 88.5988, phone: '01700000106', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'NID Office – Khulna District',         address: 'Khulna Collectorate, Khulna-9100',               latitude: 22.8414, longitude: 89.5522, phone: '01700000107', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],
  'tin': [
    { name: 'NBR TIN Registration – Segunbagicha', address: 'Segunbagicha, Dhaka-1000',                        latitude: 23.7378, longitude: 90.4117, phone: '16555', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Zone – 1, Dhaka',                 address: 'Segunbagicha, Dhaka-1000',                        latitude: 23.7382, longitude: 90.4121, phone: '01700000111', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Zone – 3, Dhaka',                 address: 'Kakrail, Dhaka-1000',                             latitude: 23.7353, longitude: 90.4131, phone: '01700000112', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Zone – 7, Dhaka',                 address: 'Uttara, Dhaka-1230',                              latitude: 23.8705, longitude: 90.3954, phone: '01700000113', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Zone – 10, Dhaka',                address: 'Mirpur, Dhaka-1216',                              latitude: 23.8031, longitude: 90.3629, phone: '01700000114', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Zone – Chittagong',               address: 'Agrabad, Chittagong-4100',                        latitude: 22.3303, longitude: 91.8165, phone: '01700000115', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Tax Zone – Sylhet',                   address: 'Zindabazar, Sylhet-3100',                         latitude: 24.8963, longitude: 91.8657, phone: '01700000116', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],
  'birth': [
    { name: 'Birth & Death Reg – DSCC HQ',     address: 'Fulbaria, Dhaka-1000',                               latitude: 23.7231, longitude: 90.4088, phone: '01700000121', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Birth Reg – Dhanmondi Ward',       address: 'Dhanmondi, Dhaka-1209',                              latitude: 23.7469, longitude: 90.3760, phone: '01700000122', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Birth Reg – Mirpur Ward',          address: 'Mirpur-10, Dhaka-1216',                              latitude: 23.8074, longitude: 90.3651, phone: '01700000123', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Birth Reg – Uttara Ward',          address: 'Sector 1, Uttara, Dhaka-1230',                       latitude: 23.8721, longitude: 90.3972, phone: '01700000124', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Birth Reg – Gulshan Ward',         address: 'Gulshan-1, Dhaka-1212',                              latitude: 23.7893, longitude: 90.4085, phone: '01700000125', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Birth Reg – Chittagong CCC',       address: 'Tiger Pass, Chittagong-4000',                        latitude: 22.3384, longitude: 91.8342, phone: '01700000126', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Birth Reg – Sylhet SCC',           address: 'Chowhatta, Sylhet-3100',                             latitude: 24.8941, longitude: 91.8791, phone: '01700000127', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],
  'citizenship': [
    { name: 'Citizenship – DC Office Dhaka',    address: 'Shahbagh, Dhaka-1000',                               latitude: 23.7383, longitude: 90.3975, phone: '01700000131', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Citizenship – Savar Upazila',      address: 'Savar, Dhaka-1340',                                  latitude: 23.8450, longitude: 90.2707, phone: '01700000132', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Citizenship – Narayanganj DC',     address: 'Narayanganj Collectorate',                            latitude: 23.6196, longitude: 90.4996, phone: '01700000133', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Citizenship – Chittagong DC',      address: 'Circuit House, Chittagong-4000',                     latitude: 22.3376, longitude: 91.8318, phone: '01700000134', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Citizenship – Sylhet DC',          address: 'Sylhet Collectorate, Sylhet-3100',                   latitude: 24.8949, longitude: 91.8614, phone: '01700000135', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Citizenship – Rajshahi DC',        address: 'Rajshahi Collectorate',                               latitude: 24.3711, longitude: 88.5988, phone: '01700000136', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],
  'educational': [
    { name: 'Dhaka Education Board',            address: 'Bakshibazar, Dhaka-1000',                            latitude: 23.7234, longitude: 90.4003, phone: '01700000141', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Chittagong Education Board',       address: 'Dewan Hat, Chittagong-4000',                         latitude: 22.3414, longitude: 91.8363, phone: '01700000142', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Sylhet Education Board',           address: 'Tilagarh, Sylhet-3100',                              latitude: 24.9079, longitude: 91.8559, phone: '01700000143', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Rajshahi Education Board',         address: 'Rajpara, Rajshahi-6000',                             latitude: 24.3812, longitude: 88.5971, phone: '01700000144', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Comilla Education Board',          address: 'Comilla Sadar, Comilla-3500',                        latitude: 23.4607, longitude: 91.1809, phone: '01700000145', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Jessore Education Board',          address: 'Jessore Sadar, Jessore-7400',                        latitude: 23.1635, longitude: 89.2080, phone: '01700000146', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
    { name: 'Barisal Education Board',          address: 'Barisal Sadar, Barisal-8200',                        latitude: 22.7010, longitude: 90.3535, phone: '01700000147', openingHours: 'Sun–Thu 9:00 AM – 5:00 PM' },
  ],
};

// ── Main seed function ────────────────────────────────────────────────────────
async function seed() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌  MONGO_URI not found in .env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅  Connected to MongoDB\n');

    // Fetch all services
    const services = await Service.find({});
    console.log('📋  Found', services.length, 'services in DB\n');

    if (services.length === 0) {
      console.log('⚠️   No services found. Make sure your services collection is populated first.');
      process.exit(0);
    }

    let totalInserted = 0;
    let totalSkipped  = 0;

    for (const service of services) {
      const dept    = service.department || '';
      const name    = (service.name || '').toLowerCase();
      let officeList = [];

      // 1. Match by exact department name
      if (OFFICES_BY_DEPARTMENT[dept]) {
        officeList = OFFICES_BY_DEPARTMENT[dept];
      }
      // 2. Match by keyword in service name
      else {
        for (const keyword of Object.keys(OFFICES_BY_KEYWORD)) {
          if (name.indexOf(keyword) !== -1) {
            officeList = OFFICES_BY_KEYWORD[keyword];
            break;
          }
        }
      }
      // 3. Try department keywords too
      if (officeList.length === 0) {
        const deptLower = dept.toLowerCase();
        for (const keyword of Object.keys(OFFICES_BY_KEYWORD)) {
          if (deptLower.indexOf(keyword) !== -1) {
            officeList = OFFICES_BY_KEYWORD[keyword];
            break;
          }
        }
      }

      if (officeList.length === 0) {
        console.log('  ⚪  No office data for service:', service.name, '(' + dept + ') — skipping');
        continue;
      }

      console.log('📍  Service:', service.name, '→', officeList.length, 'offices to check');

      for (const o of officeList) {
        // Skip if already exists (idempotent)
        const exists = await Office.findOne({
          service: service._id,
          name: o.name,
        });
        if (exists) {
          totalSkipped++;
          continue;
        }

        await Office.create({
          service:      service._id,
          name:         o.name,
          address:      o.address,
          latitude:     o.latitude,
          longitude:    o.longitude,
          phone:        o.phone,
          openingHours: o.openingHours,
          isActive:     true,
        });
        totalInserted++;
        console.log('    ✅  Inserted:', o.name);
      }
    }

    console.log('\n══════════════════════════════════════');
    console.log('  Seeding complete!');
    console.log('  Inserted:', totalInserted, 'offices');
    console.log('  Skipped (already existed):', totalSkipped);
    console.log('══════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seed();