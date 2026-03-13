// import { useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// export default function UploadDocument() {

//   const { type } = useParams();

//   const [file, setFile] = useState(null);

//   const handleUpload = async () => {

//     if (!file) {
//       alert("Please select a file");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("file", file);

//     try {

//       const res = await axios.post(
//         `http://localhost:5000/api/documents/upload/${type}`,
//         formData
//       );

//       alert("Document uploaded successfully!");

//       console.log(res.data);

//     } catch (error) {

//       console.error(error);

//       alert("Upload failed");

//     }

//   };

//   return (

//     <div className="bg-white p-8 rounded shadow max-w-lg">

//       <h2 className="text-2xl font-bold mb-6">
//         Upload {type} Document
//       </h2>

//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={(e)=>setFile(e.target.files[0])}
//       />

//       <button
//         onClick={handleUpload}
//         className="bg-blue-600 text-white px-5 py-2 rounded mt-4"
//       >
//         Upload
//       </button>

//     </div>

//   );
// }







import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUpload, FaFilePdf, FaTimes } from "react-icons/fa";

export default function UploadDocument() {

  const { type } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    setFile(selected);
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
  };

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


        {/* File Preview */}

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