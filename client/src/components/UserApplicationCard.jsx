import { FaExclamationTriangle, FaUpload } from "react-icons/fa";


  const handleUpload = async () => {
    if (!file) {
      showNotification("Please select a file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", type);

    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `${API}/api/documents`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      showNotification("Document uploaded successfully", "success");
      
      setTimeout(() => {
        navigate("/documents");
      }, 1500);

    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        showNotification(err.response?.data?.message || "Upload failed. Please try again.", "error");
      }
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

export default function UserApplicationCard({ app }) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{app.serviceId?.name || "Service"}</h3>
          <span
            className={`text-sm px-3 py-1 flex items-center rounded-full font-semibold ${
              app.status === "AWAITING_USER_DOCS"
                ? "bg-amber-100 text-amber-800"
                : app.status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {app.status.replace(/_/g, " ")}
          </span>
        </div>

        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Department:</span> {app.serviceId?.department || "Unknown"}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Application ID:</span> {app._id}
        </p>
      </div>

      {app.status === "AWAITING_USER_DOCS" && (
        <div className="flex-1 w-full border-2 border-red-400 bg-red-50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-red-700">
            <FaExclamationTriangle className="text-xl" />
            <h4 className="text-lg font-bold">Action Required: Update Your Application</h4>
          </div>
          
          <p className="text-gray-700 mb-4 text-sm">
            The admin has reviewed your application and requested the following documents. Please submit them before the deadline.
          </p>

          {app.deadlines && (
            <div className="bg-white p-4 rounded-lg border border-red-100 mb-4 space-y-2 text-sm shadow-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Application Deadline:</span>{" "}
                {app.deadlines.applicationDate ? new Date(app.deadlines.applicationDate).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-red-600 font-bold border-l-4 border-red-500 pl-2 py-1 bg-red-50">
                <span>Document Submission Deadline:</span>{" "}
                {app.deadlines.documentDate ? new Date(app.deadlines.documentDate).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Appointment Deadline:</span>{" "}
                {app.deadlines.appointmentDate ? new Date(app.deadlines.appointmentDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
          )}

          {app.requestedFields && app.requestedFields.length > 0 && (
            <div className="mb-5">
              <h5 className="font-semibold text-gray-800 mb-2">Requested Documents:</h5>
              <div className="space-y-3">
                {app.requestedFields.map((field, idx) => (
                  <div key={idx} className="flex flex-col bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="file"
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            <FaUpload /> Submit Documents
          </button>
        </div>
      )}
    </div>
  );
}