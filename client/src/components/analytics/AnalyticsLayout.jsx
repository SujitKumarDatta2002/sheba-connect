export default function AnalyticsLayout({ children, title, onRefresh, loading, refreshing }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/50 to-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{title}</h1>
              <p className="text-sm text-slate-600">Bangladesh public data analytics dashboard</p>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={loading || refreshing}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh From External APIs"}
            </button>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
