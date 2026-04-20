import axios from "axios";
import API from "../config/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPublicData(refresh = false) {
  const { data } = await axios.get(`${API}/api/analytics/public-data`, {
    params: { refresh },
    headers: authHeaders(),
  });
  return data;
}

export async function getGeoData(refresh = false) {
  const { data } = await axios.get(`${API}/api/analytics/geo`, {
    params: { refresh },
    headers: authHeaders(),
  });
  return data;
}

export async function getInsights(refresh = false) {
  const { data } = await axios.get(`${API}/api/analytics/insights`, {
    params: { refresh },
    headers: authHeaders(),
  });
  return data;
}

export async function getAnalyticsByDate(start, end) {
  const { data } = await axios.get(`${API}/api/analytics/by-date`, {
    params: { start, end },
    headers: authHeaders(),
  });
  return data;
}
