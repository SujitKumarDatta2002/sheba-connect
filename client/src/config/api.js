const configuredApiUrl = import.meta.env.VITE_API_URL;
const inferredApiUrl = `${window.location.protocol}//${window.location.hostname}:5000`;

const rawApiUrl = (configuredApiUrl || inferredApiUrl).trim();
const API = rawApiUrl.replace(/\/$/, "");

export default API;