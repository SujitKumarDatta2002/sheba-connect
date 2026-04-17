const rawApiUrl = import.meta.env.VITE_API_URL;

// Accept either "http://host:port" or "http://host:port/api" in env.
const normalizedApiUrl = rawApiUrl && rawApiUrl.trim()
	? rawApiUrl.trim().replace(/\/+$/, "").replace(/\/api$/i, "")
	: "";

// Fallback to local backend when env is not configured in development.
const API = normalizedApiUrl || "http://localhost:5000";

export default API;