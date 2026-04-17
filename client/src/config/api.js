const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Accept either "http://host:port" or "http://host:port/api" in env. when env is not configured in development.
const normalizedApiUrl = rawApiUrl && rawApiUrl.trim()
	? rawApiUrl.trim().replace(/\/+$/, "").replace(/\/api$/i, "")
	: "";

const API = normalizedApiUrl || "http://localhost:5000";

export default API;