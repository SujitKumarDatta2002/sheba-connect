import { Link } from "react-router-dom";

export default function Documents() {

  const documents = [
    "nid",
    "birthCertificate",
    "passport",
    "drivingLicense",
    "tin"
  ];

  return (

    <div>

      <h2 className="text-3xl font-bold mb-6">
        Document Center
      </h2>

      <div className="grid grid-cols-2 gap-6">

        {documents.map((doc)=> (

          <div
            key={doc}
            className="bg-white p-6 rounded shadow"
          >

            <h3 className="text-xl font-semibold mb-4">
              {doc}
            </h3>

            <Link
              to={`/upload/${doc}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Upload
            </Link>

          </div>

        ))}

      </div>

    </div>

  );
}