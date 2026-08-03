export default function AdminDepartmentBoard({ groupedData = {}, onSelectApplication }) {
  return (
    <div className="space-y-5">
      {Object.entries(groupedData).length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-500">
          No applications available.
        </div>
      ) : (
        Object.entries(groupedData).map(([departmentName, applicationsList]) => (
          <div key={departmentName} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{departmentName}</h3>
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {applicationsList.length} application{applicationsList.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {applicationsList.map((app) => (
                <button
                  key={app._id}
                  type="button"
                  onClick={() => onSelectApplication?.(app)}
                  className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {app.serviceId?.name || "Unknown Service"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {app.userId?.name || "Unknown User"} ({app.userId?.email || "N/A"})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Status: {app.status}</p>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
