import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AnalyticsLayout from "../components/analytics/AnalyticsLayout";
import ChartCard from "../components/analytics/ChartCard";
import { getAnalyticsByDate, getInsights, getPublicData } from "../services/analytics.api";
import DateFilterCalendar from "../components/analytics/DateFilterCalendar";

const PIE_COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function formatValue(value, unit) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
  const num = Number(value);

  if (unit === "%") return `${num.toFixed(2)}%`;
  if (unit === "USD") return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(num);
  if (unit === "people") return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(num);

  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num);
}

function findIndicator(indicators, name) {
  return (indicators || []).find((item) => item.name === name) || null;
}

function compactAxisNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [publicData, setPublicData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [filtering, setFiltering] = useState(false);
  const [byDate, setByDate] = useState(null);

  async function loadData(refresh = false) {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      let publicRes;
      let insightsRes;

      if (refresh) {
        // Trigger one external sync/build cycle, then read cached collections.
        insightsRes = await getInsights(true);
        publicRes = await getPublicData(false);
      } else {
        [publicRes, insightsRes] = await Promise.all([
          getPublicData(false),
          getInsights(false),
        ]);
      }

      setPublicData(publicRes.data || []);
      setInsights(insightsRes.data || null);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to load analytics");
    } finally {
      if (refresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadData(false);
  }, []);

  async function applyDateFilter({ start, end }) {
    setFiltering(true);
    try {
      const response = await getAnalyticsByDate(start, end);
      setByDate(response);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to apply date filter");
    } finally {
      setFiltering(false);
    }
  }

  const populationSeries = insights?.series?.population || [];
  const gdpSeries = insights?.series?.gdp || [];
  const inflationSeries = insights?.series?.inflation || [];
  const unemploymentSeries = insights?.series?.unemployment || [];
  const temperatureSeries = insights?.series?.temperature || [];
  const latestIndicators = insights?.latestIndicators || [];

  const categoryData = (insights?.categoryBreakdown || []).map((c) => ({
    name: c._id,
    value: c.totalRecords,
  }));
  const totalRecords = insights?.kpis?.totalRecords || 0;
  const generatedAt = insights?.generatedAt || null;
  const populationLatest = findIndicator(latestIndicators, "Population");
  const gdpLatest = findIndicator(latestIndicators, "GDP");
  const inflationLatest = findIndicator(latestIndicators, "Inflation");
  const unemploymentLatest = findIndicator(latestIndicators, "Unemployment");

  const ratesSeries = inflationSeries
    .map((item) => ({
      year: item.year,
      inflation: item.value,
      unemployment: (unemploymentSeries.find((x) => x.year === item.year) || {}).value,
    }))
    .filter((row) => Number.isFinite(row.inflation) || Number.isFinite(row.unemployment));
  const hasChartData =
    populationSeries.length > 0 ||
    temperatureSeries.length > 0 ||
    latestIndicators.length > 0 ||
    categoryData.length > 0;

  const byDateWeather = (byDate?.data?.weatherData || []).map((row) => ({
    date: row.date,
    temperature: row.temperature,
    rainfall: row.rainfall,
  }));

  const byDateHighFreq = (byDate?.data?.highFrequencyData || []).map((row) => ({
    time: row.timestamp,
    pm10: row.pm10,
    pm25: row.pm25,
  }));

  return (
    <AnalyticsLayout
      title="Analytics Dashboard"
      onRefresh={() => loadData(true)}
      loading={loading}
      refreshing={refreshing}
    >
      {error ? (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>
      ) : null}

      <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Datasets</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{publicData.length}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Total records</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{totalRecords}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Indicators</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{latestIndicators.length}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Last built</p>
          <p className="mt-2 text-sm font-black text-slate-900">{generatedAt ? new Date(generatedAt).toLocaleString() : "N/A"}</p>
        </article>
      </section>

      <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Population</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{formatValue(populationLatest?.value, populationLatest?.unit)}</p>
          <p className="mt-1 text-xs text-slate-500">Year: {populationLatest?.year || "N/A"}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">GDP</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{formatValue(gdpLatest?.value, gdpLatest?.unit)}</p>
          <p className="mt-1 text-xs text-slate-500">Year: {gdpLatest?.year || "N/A"}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Inflation</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{formatValue(inflationLatest?.value, inflationLatest?.unit)}</p>
          <p className="mt-1 text-xs text-slate-500">Year: {inflationLatest?.year || "N/A"}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Unemployment</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{formatValue(unemploymentLatest?.value, unemploymentLatest?.unit)}</p>
          <p className="mt-1 text-xs text-slate-500">Year: {unemploymentLatest?.year || "N/A"}</p>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Population Trend (Bangladesh)" subtitle="World Bank annual series">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={populationSeries} margin={{ top: 8, right: 12, bottom: 8, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} width={88} tickFormatter={compactAxisNumber} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="GDP Trend" subtitle="World Bank annual series (current US$)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gdpSeries} margin={{ top: 8, right: 12, bottom: 8, left: 22 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis width={96} tickFormatter={compactAxisNumber} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Inflation vs Unemployment" subtitle="Comparable % scale">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratesSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inflation" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="unemployment" stroke="#a21caf" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Dhaka Daily Mean Temperature" subtitle="Open-Meteo archive dataset">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Categories" subtitle="Pie chart for category distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {!loading && !refreshing && !error && !publicData.length ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          No data available yet. Click Refresh From External APIs.
        </div>
      ) : null}

      {!loading && !refreshing && !error && publicData.length > 0 && !hasChartData ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
          Datasets exist but chart series are empty. Click refresh to rebuild analytics from the new APIs.
          <button
            type="button"
            onClick={() => loadData(true)}
            className="ml-3 rounded-md bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800"
          >
            Rebuild Now
          </button>
        </div>
      ) : null}

      <section className="mt-5">
        <DateFilterCalendar onApply={applyDateFilter} loading={filtering} />
      </section>

      {byDate ? (
        <section className="mt-5 grid gap-5 xl:grid-cols-2">
          <ChartCard title="Date-filtered Weather" subtitle={`${byDate.dateRange.start} to ${byDate.dateRange.end}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDateWeather}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#dc2626" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="rainfall" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Date-filtered High-Frequency Data" subtitle="Air quality points in selected date range">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDateHighFreq}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pm10" stroke="#ef4444" strokeWidth={2.2} dot={false} />
                <Line type="monotone" dataKey="pm25" stroke="#f97316" strokeWidth={2.2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>
      ) : null}
    </AnalyticsLayout>
  );
}
