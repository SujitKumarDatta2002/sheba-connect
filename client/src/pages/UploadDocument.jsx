

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUpload, FaFilePdf, FaTimes } from "react-icons/fa";

export default function UploadDocument() {

  const { type } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {

    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    setFile(selected);

    // Create preview URL
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", type);

    try {

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/documents",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Document uploaded successfully");

      navigate("/documents");

    } catch (err) {

      console.log(err);
      alert("Upload failed");

    }

    setLoading(false);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (

    <div className="p-10 flex justify-center">

      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl p-8">

        <h1 className="text-2xl font-bold mb-6 capitalize">
          Upload {type}
        </h1>

        {/* Drag Drop Box */}

        <label className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-blue-500 transition block">

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <FaUpload className="text-4xl text-blue-600 mx-auto mb-3" />

          <p className="text-gray-600">
            Drag & drop your PDF here or click to browse
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Only PDF files allowed
          </p>

        </label>


        {/* File Info */}

        {file && (

          <div className="mt-6 flex items-center justify-between bg-gray-100 p-4 rounded">

            <div className="flex items-center gap-3">

              <FaFilePdf className="text-red-600 text-xl" />

              <div>

                <p className="font-medium">
                  {file.name}
                </p>

                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

            <button
              onClick={removeFile}
              className="text-red-500"
            >
              <FaTimes />
            </button>

          </div>

        )}


        {/* PDF Preview */}

        {previewUrl && (

          <div className="mt-6 border rounded-lg overflow-hidden">

            <div className="bg-gray-100 px-4 py-2 font-medium">
              PDF Preview
            </div>

            <iframe
              src={previewUrl}
              className="w-full h-96"
              title="PDF Preview"
            />

          </div>

        )}


        {/* Upload Button */}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >

          {loading ? "Uploading..." : "Upload Document"}

        </button>

      </div>

    </div>

  );
}