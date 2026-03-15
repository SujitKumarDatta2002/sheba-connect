

import { useEffect, useState } from "react";
import axios from "axios";
import { FaUpload, FaDownload, FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Documents() {

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const documentTypes = [
    { type: "passport", name: "Passport", category: "Identity" },
    { type: "nid", name: "National ID", category: "Identity" },
    { type: "birthCertificate", name: "Birth Certificate", category: "Identity" },
    { type: "tin", name: "TIN Certificate", category: "Financial" },
    { type: "drivingLicense", name: "Driving License", category: "Transport" }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/documents");
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getDocument = (type) => {
    return documents.find(doc => doc.documentType === type);
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.log(err);
    }
  };

  /* ----------------------------
     FIXED PROFILE COMPLETION
  -----------------------------*/

  const uploadedCount = documentTypes.filter(docType =>
    documents.some(doc => doc.documentType === docType.type)
  ).length;

  const completion = Math.round(
    (uploadedCount / documentTypes.length) * 100
  );

  /* ----------------------------
     SEARCH / FILTER / SORT
  -----------------------------*/

  const filteredDocs = documentTypes
    .filter(doc =>
      doc.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(doc => {
      const uploaded = getDocument(doc.type);

      if (statusFilter === "uploaded") return uploaded;
      if (statusFilter === "missing") return !uploaded;

      return true;
    });

  const sortedDocs = [...filteredDocs].sort((a, b) => {

    const docA = getDocument(a.type);
    const docB = getDocument(b.type);

    if (sort === "name")
      return a.name.localeCompare(b.name);

    if (sort === "newest")
      return new Date(docB?.createdAt || 0) -
             new Date(docA?.createdAt || 0);

    if (sort === "oldest")
      return new Date(docA?.createdAt || 0) -
             new Date(docB?.createdAt || 0);

    return 0;
  });

  return (

    <div className="p-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Document Center
        </h1>

      </div>

      {/* Profile Completion */}

      <div className="bg-white shadow rounded-lg p-6 mb-8">

        <h2 className="font-semibold mb-2">
          Profile Completion
        </h2>

        <p className="text-sm text-gray-500 mb-3">
          {uploadedCount} of {documentTypes.length} documents uploaded ({completion}%)
        </p>

        <div className="w-full bg-gray-200 rounded h-3">

          <div
            className="bg-blue-600 h-3 rounded"
            style={{ width: `${completion}%` }}
          />

        </div>

      </div>

      {/* Search + Filters */}

      <div className="flex gap-4 mb-6">

        <div className="flex items-center border rounded px-3 py-2 bg-white">

          <FaSearch className="text-gray-400 mr-2" />

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none"
          />

        </div>

        <select
          className="border rounded px-3 py-2 bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >

          <option value="all">All Status</option>
          <option value="uploaded">Uploaded</option>
          <option value="missing">Missing</option>

        </select>

        <select
          className="border rounded px-3 py-2 bg-white"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >

          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>

        </select>

      </div>

      {/* Document Table */}

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4">Document</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Uploaded</th>
              <th className="p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {sortedDocs.map((docType) => {

              const doc = getDocument(docType.type);

              return (

                <tr key={docType.type} className="border-t">

                  <td className="p-4 font-medium">
                    {docType.name}
                  </td>

                  <td className="p-4">
                    {docType.category}
                  </td>

                  <td className="p-4">

                    {doc ? (

                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        Uploaded
                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        Missing
                      </span>

                    )}

                  </td>

                  <td className="p-4 text-sm text-gray-500">

                    {doc
                      ? new Date(doc.createdAt).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="p-4 flex gap-3">

                    {doc ? (

                      <>

                        <a
                          href={`http://localhost:5000/${doc.filePath}`}
                          download
                          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
                        >
                          <FaDownload />
                          Download
                        </a>

                        <button
                          onClick={() => deleteDocument(doc._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700"
                        >
                          <FaTrash />
                          Delete
                        </button>

                      </>

                    ) : (

                      <button
                        onClick={() => navigate(`/upload/${docType.type}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
                      >
                        <FaUpload />
                        Upload
                      </button>

                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}