import { useState } from "react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default function DateFilterCalendar({ onApply, loading }) {
  const [start, setStart] = useState(daysAgoISO(30));
  const [end, setEnd] = useState(todayISO());

  function submit(event) {
    event.preventDefault();
    if (!start || !end) return;
    onApply({ start, end });
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-black text-slate-900">Date Filter</h3>
      <p className="mt-1 text-sm text-slate-600">Select range or use Google Calendar-enabled filtering via API.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-slate-700">Start date</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-slate-700">End date</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Applying..." : "Apply Date Filter"}
      </button>
    </form>
  );
}
