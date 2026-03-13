import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function UploadDocument() {

  const { type } = useParams();

  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      const res = await axios.post(
        `http://localhost:5000/api/documents/upload/${type}`,
        formData
      );

      alert("Document uploaded successfully!");

      console.log(res.data);

    } catch (error) {

      console.error(error);

      alert("Upload failed");

    }

  };

  return (

    <div className="bg-white p-8 rounded shadow max-w-lg">

      <h2 className="text-2xl font-bold mb-6">
        Upload {type} Document
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e)=>setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-5 py-2 rounded mt-4"
      >
        Upload
      </button>

    </div>

  );
}