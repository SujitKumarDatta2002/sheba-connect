import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import API from "../config/api";

const PALETTE = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316"];
const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "have",
  "been",
  "are",
  "was",
  "were",
  "you",
  "your",
  "our",
  "their",
  "there",
  "about",
  "into",
  "after",
  "before",
  "when",
  "where",
  "what",
  "which",
  "can",
  "cannot",
  "not",
  "but",
  "all",
  "any",
]);

const REQUIRED_DOCS = [
  "nid",
  "birthCertificate",
  "passport",
  "drivingLicense",
  "tin",
  "citizenship",
  "educationalCertificate",
];

function asDate(input) {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d; //Ternary Operator 
}

function monthKey(dateInput) {
  const d = asDate(dateInput);
  if (!d) return "Unknown";
  const y = d.getFullYear(); //2024
  const m = String(d.getMonth() + 1).padStart(2, "0"); //04
  return `${y}-${m}`; //2024-04
}

function weekKey(dateInput) {
  const d = asDate(dateInput);
  if (!d) return "Unknown";
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); //Copy to UTC date for consistent week calculation w05, w025...
  const day = tmp.getUTCDay() || 7; //Sunday : 0, Monday : 1, ... Saturday : 6 => Make Sunday 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1)); //Thursday and January 1st of the year are in the same week
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function dayKey(dateInput) {
  const d = asDate(dateInput);
  if (!d) return "Unknown"; 
  return d.toISOString().slice(0, 10);  //"2024-04-16T15:30:00.000Z" "2024-04-16"
}

function periodKey(dateInput, mode) {
  if (mode === "day") return dayKey(dateInput);
  if (mode === "week") return weekKey(dateInput);
  return monthKey(dateInput);
}

function periodLabel(key, mode) {
  if (mode === "day") return key?.slice(5) || key; 
  if (mode === "week") return key?.replace("-W", " W") || key;
  return shortMonthLabel(key);
} 

function shortMonthLabel(key) {
  if (!key || !/^\d{4}-\d{2}$/.test(key)) return key;
  const [y, m] = key.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
} //Apr 2024 => Apr '24

function parseExpectedDays(processingTime) {
  if (!processingTime) return 0;
  const lower = String(processingTime).toLowerCase();
  if (lower.includes("immediate")) return 0;
  const nums = lower.match(/\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) return 0;
  if (nums.length === 1) return Number(nums[0]);
  const a = Number(nums[0]);
  const b = Number(nums[1]);
  return (a + b) / 2;
}

function daysBetween(a, b) {
  const d1 = asDate(a);
  const d2 = asDate(b);
  if (!d1 || !d2) return 0;
  return Math.max(0, (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function tokeniseKeywords(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function Gauge({ value }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full">
      <div
        className="h-4 w-full rounded-full"
        style={{
          background: `conic-gradient(#10b981 0% ${pct}%, #e5e7eb ${pct}% 100%)`,
        }}
      />
      <p className="mt-2 text-sm text-gray-700 font-semibold">{pct.toFixed(1)}%</p>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {subtitle ? <p className="text-sm text-gray-500 mt-1 mb-4">{subtitle}</p> : <div className="mb-4" />}
      {children}
    </div>
  );
}

export default function IftiAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [windowMode, setWindowMode] = useState("month");
  const [services, setServices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const headers = { Authorization: `Bearer ${token}` };

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [servicesRes, complaintsRes, usersRes, docsRes] = await Promise.all([
          axios.get(`${API}/api/admin/services`, { headers }),
          axios.get(`${API}/api/admin/complaints`, { headers }),
          axios.get(`${API}/api/admin/users`, { headers }),
          axios.get(`${API}/api/admin/documents`, { headers }),
        ]);

        setServices(servicesRes.data || []);
        setComplaints(complaintsRes.data || []);
        setUsers(usersRes.data || []);
        setDocuments(docsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const data = useMemo(() => {
    const now = new Date();

    const filteredComplaints = complaints.filter((c) => {
      const created = asDate(c.createdAt);
      if (!created) return false;
      if (windowMode === "day") return daysBetween(created, now) <= 30;
      if (windowMode === "week") return daysBetween(created, now) <= 120;
      return daysBetween(created, now) <= 365;
    });

    const complaintsByPeriodMap = new Map();
    filteredComplaints.forEach((c) => {
      const key = periodKey(c.createdAt, windowMode);
      complaintsByPeriodMap.set(key, (complaintsByPeriodMap.get(key) || 0) + 1);
    });

    const applicationVolume = Array.from(complaintsByPeriodMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ period: periodLabel(k, windowMode), applications: v }));

    const topServiceMap = new Map();
    filteredComplaints.forEach((c) => {
      const key = c.department || "Other";
      topServiceMap.set(key, (topServiceMap.get(key) || 0) + 1);
    });

    const topRequestedServices = Array.from(topServiceMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const actualByDept = new Map();
    filteredComplaints.forEach((c) => {
      const dept = c.department || "Other";
      const resolvedPoint = (c.timeline || []).find((t) => t.status === "Resolved")?.date;
      const actualDays = resolvedPoint ? daysBetween(c.createdAt, resolvedPoint) : daysBetween(c.createdAt, now);
      if (!actualByDept.has(dept)) actualByDept.set(dept, []);
      actualByDept.get(dept).push(actualDays);
    });

    const processingComparison = services
      .map((s) => {
        const dept = s.department || "Other";
        const actualArr = actualByDept.get(dept) || [];
        const actual = actualArr.length
          ? actualArr.reduce((sum, n) => sum + n, 0) / actualArr.length
          : parseExpectedDays(s.processingTime);
        return {
          service: s.name,
          expected: parseExpectedDays(s.processingTime),
          actual: Number(actual.toFixed(2)),
        };
      })
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 6);

    const uploadsByUser = new Map();
    documents.forEach((d) => {
      const uid = d.userId?._id || d.userId;
      if (!uid) return;
      if (!uploadsByUser.has(uid)) uploadsByUser.set(uid, []);
      uploadsByUser.get(uid).push(d);
    });

    const docMissingMap = new Map();
    REQUIRED_DOCS.forEach((doc) => docMissingMap.set(doc, 0));

    users.forEach((u) => {
      const userDocs = uploadsByUser.get(u._id) || [];
      const uploadedSet = new Set(userDocs.map((d) => d.documentType));
      REQUIRED_DOCS.forEach((doc) => {
        if (!uploadedSet.has(doc)) docMissingMap.set(doc, (docMissingMap.get(doc) || 0) + 1);
      });
    });

    const missingDocsDonut = Array.from(docMissingMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    const topServicesForBlockers = services.slice(0, 5);
    const serviceBlockers = topServicesForBlockers.map((s) => {
      const entry = { service: s.name };
      REQUIRED_DOCS.forEach((doc) => {
        const required = (s.requiredDocuments || []).includes(doc);
        entry[doc] = required ? Math.round((docMissingMap.get(doc) || 0) * 0.35) : 0;
      });
      return entry;
    });

    const successUsers = users.filter((u) => {
      const createdAt = asDate(u.createdAt);
      if (!createdAt) return false;
      const weekLater = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      const userDocs = uploadsByUser.get(u._id) || [];
      const uploadedInWeek = userDocs.filter((d) => {
        const up = asDate(d.uploadedAt || d.createdAt);
        return up && up <= weekLater;
      });
      return uploadedInWeek.length >= 3;
    }).length;

    const uploadSuccessRate = users.length ? (successUsers / users.length) * 100 : 0;

    const complaintsByDepartmentMap = new Map();
    filteredComplaints.forEach((c) => {
      const dept = c.department || "Other";
      complaintsByDepartmentMap.set(dept, (complaintsByDepartmentMap.get(dept) || 0) + 1);
    });

    const complaintsByDepartment = Array.from(complaintsByDepartmentMap.entries()).map(([name, value]) => ({ name, value }));

    const resolutionStatusMap = new Map();
    filteredComplaints.forEach((c) => {
      const k = periodKey(c.createdAt, windowMode);
      if (!resolutionStatusMap.has(k)) {
        resolutionStatusMap.set(k, { period: periodLabel(k, windowMode), Pending: 0, Processing: 0, Resolved: 0 });
      }
      const row = resolutionStatusMap.get(k);
      if (c.status === "Resolved") row.Resolved += 1;
      else if (c.status === "Processing") row.Processing += 1;
      else row.Pending += 1;
    });

    const issueResolutionTrend = Array.from(resolutionStatusMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, v]) => v);

    const keywordMap = new Map();
    filteredComplaints.forEach((c) => {
      tokeniseKeywords(`${c.issueKeyword} ${c.description} ${c.formalTemplate || ""}`).forEach((w) => {
        keywordMap.set(w, (keywordMap.get(w) || 0) + 1);
      });
    });

    const frequentKeywords = Array.from(keywordMap.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 25);

    const readinessBuckets = [
      { range: "0-25%", min: 0, max: 25, count: 0 },
      { range: "26-50%", min: 26, max: 50, count: 0 },
      { range: "51-75%", min: 51, max: 75, count: 0 },
      { range: "76-100%", min: 76, max: 100, count: 0 },
    ];

    users.forEach((u) => {
      const baseFields = [u.name, u.email, u.phone, u.nid, u.address].filter(Boolean).length;
      const docCount = (uploadsByUser.get(u._id) || []).length;
      const readiness = Math.round(((baseFields + Math.min(docCount, REQUIRED_DOCS.length)) / (5 + REQUIRED_DOCS.length)) * 100);
      const bucket = readinessBuckets.find((b) => readiness >= b.min && readiness <= b.max);
      if (bucket) bucket.count += 1;
    });

    const activityByDay = new Map();
    complaints.forEach((c) => {
      const day = asDate(c.createdAt)?.toISOString().slice(0, 10);
      const uid = c.userId?._id || c.userId;
      if (!day || !uid) return;
      if (!activityByDay.has(day)) activityByDay.set(day, new Set());
      activityByDay.get(day).add(uid);
    });

    documents.forEach((d) => {
      const day = asDate(d.uploadedAt || d.createdAt)?.toISOString().slice(0, 10);
      const uid = d.userId?._id || d.userId;
      if (!day || !uid) return;
      if (!activityByDay.has(day)) activityByDay.set(day, new Set());
      activityByDay.get(day).add(uid);
    });

    const dailyKeys = Array.from(activityByDay.keys()).sort();
    const activeUsers = dailyKeys.map((day) => {
      const dau = activityByDay.get(day)?.size || 0;
      const rolling30 = dailyKeys
        .filter((d) => d <= day && daysBetween(d, day) <= 30)
        .reduce((set, d) => {
          (activityByDay.get(d) || new Set()).forEach((id) => set.add(id));
          return set;
        }, new Set()).size;
      return { day: day.slice(5), DAU: dau, MAU: rolling30 };
    });

    const geoMap = new Map();
    users.forEach((u) => {
      const region = String(u.address || "Unknown").split(",")[0].trim() || "Unknown";
      geoMap.set(region, (geoMap.get(region) || 0) + 1);
    });

    const geoDistribution = Array.from(geoMap.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return {
      applicationVolume,
      topRequestedServices,
      processingComparison,
      missingDocsDonut,
      serviceBlockers,
      uploadSuccessRate,
      complaintsByDepartment,
      issueResolutionTrend,
      frequentKeywords,
      readinessDistribution: readinessBuckets.map((b) => ({ range: b.range, users: b.count })),
      activeUsers,
      geoDistribution,
    };
  }, [complaints, documents, services, users, windowMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 font-medium">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Analytics</h1>
              <p className="text-indigo-100">Operational intelligence across services, documents, complaints, and users.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/services" className="px-4 py-2 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition">Manage Services</Link>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-200">{error}</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-2 flex-wrap">
          <button onClick={() => setWindowMode("day")} className={`px-3 py-2 rounded ${windowMode === "day" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Daily View</button>
          <button onClick={() => setWindowMode("week")} className={`px-3 py-2 rounded ${windowMode === "week" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Weekly View</button>
          <button onClick={() => setWindowMode("month")} className={`px-3 py-2 rounded ${windowMode === "month" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Monthly View</button>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">1. Service Trends</h2>
          <div className="grid lg:grid-cols-2 gap-5">
            <SectionCard title="Application Volume Over Time" subtitle="Service application trend over selected period.">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.applicationVolume}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Top 5 Requested Services" subtitle="Most-requested service groups based on complaints/applications.">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topRequestedServices} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={130} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#16a34a" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Average Processing vs Expected" subtitle="Expected time from service config versus actual elapsed complaint resolution time.">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.processingComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" hide />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="expected" fill="#f59e0b" name="Expected Days" />
                    <Line dataKey="actual" stroke="#ef4444" strokeWidth={2} name="Actual Days" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Processing Radar" subtitle="Quick relative performance view for top services.">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data.processingComparison}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="service" tick={false} />
                    <Tooltip />
                    <Legend />
                    <Radar name="Expected" dataKey="expected" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                    <Radar name="Actual" dataKey="actual" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">2. Missing Documents Analytics</h2>
          <div className="grid lg:grid-cols-2 gap-5">
            <SectionCard title="Most Commonly Missing Prerequisites" subtitle="Estimated missing docs across user base.">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.missingDocsDonut} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} label>
                      {data.missingDocsDonut.map((entry, i) => (
                        <Cell key={`doc-${entry.name}`} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Service Blockers" subtitle="Estimated blockers by required document per service.">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.serviceBlockers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" hide />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {REQUIRED_DOCS.map((doc, i) => (
                      <Bar key={doc} dataKey={doc} stackId="a" fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Document Upload Success Rate" subtitle="Users completing a minimum viable portfolio in first 7 days.">
              <div className="h-36 flex items-center">
                <Gauge value={data.uploadSuccessRate} />
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">3. Frequent Issues & Complaints</h2>
          <div className="grid lg:grid-cols-2 gap-5">
            <SectionCard title="Complaints by Department" subtitle="Department-level complaint burden.">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.complaintsByDepartment} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                      {data.complaintsByDepartment.map((entry, i) => (
                        <Cell key={`dept-${entry.name}`} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Issue Resolution Status Over Time" subtitle="Pending vs Processing vs Resolved trend by month.">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.issueResolutionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Pending" stackId="1" stroke="#ef4444" fill="#fecaca" />
                    <Area type="monotone" dataKey="Processing" stackId="1" stroke="#f59e0b" fill="#fde68a" />
                    <Area type="monotone" dataKey="Resolved" stackId="1" stroke="#22c55e" fill="#bbf7d0" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Frequent Issue Keywords" subtitle="Word cloud from complaint keywords and descriptions.">
              <div className="min-h-52 flex flex-wrap gap-2 content-start">
                {data.frequentKeywords.map((kw, idx) => {
                  const size = 12 + Math.min(22, kw.value * 2.2);
                  return (
                    <span
                      key={`${kw.text}-${idx}`}
                      className="px-2 py-1 rounded"
                      style={{
                        fontSize: `${size}px`,
                        background: idx % 2 ? "#eff6ff" : "#ecfeff",
                        color: idx % 3 ? "#1e3a8a" : "#0f766e",
                      }}
                    >
                      {kw.text}
                    </span>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">4. User Statistics</h2>
          <div className="grid lg:grid-cols-2 gap-5">
            <SectionCard title="Profile Readiness Distribution" subtitle="Readiness bracket based on profile fields + uploaded docs.">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.readinessDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Active Users Tracker (DAU / MAU)" subtitle="Activity estimated from complaints and document uploads.">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.activeUsers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="DAU" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="MAU" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="User Geographic Distribution" subtitle="Heat intensity by top address clusters (district/zone approximation).">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.geoDistribution.map((g) => {
                  const intensity = Math.min(1, g.count / Math.max(1, data.geoDistribution[0]?.count || 1));
                  return (
                    <div
                      key={g.region}
                      className="rounded-lg p-3 border"
                      style={{
                        backgroundColor: `rgba(37, 99, 235, ${0.15 + intensity * 0.55})`,
                        borderColor: `rgba(37, 99, 235, ${0.25 + intensity * 0.45})`,
                      }}
                    >
                      <p className="text-sm font-semibold text-gray-900 truncate">{g.region}</p>
                      <p className="text-xs text-gray-700">{g.count} users</p>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </section>
      </div>
    </div>
  );
}
