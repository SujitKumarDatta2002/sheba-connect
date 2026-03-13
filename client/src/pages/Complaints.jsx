


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FaClipboardList, FaTrash, FaEye, FaPlus } from "react-icons/fa";

// export default function Complaints() {

//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const [formData, setFormData] = useState({
//     department: "",
//     issueKeyword: "",
//     description: ""
//   });

//   const userId = "64b123456789abcdef123456";

//   const fetchComplaints = async () => {
//     const res = await axios.get("http://localhost:5000/api/complaints");
//     setComplaints(res.data);
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await axios.post("http://localhost:5000/api/complaints/create", {
//       userId,
//       ...formData
//     });

//     setFormData({
//       department: "",
//       issueKeyword: "",
//       description: ""
//     });

//     fetchComplaints();
//   };

//   const deleteComplaint = async () => {

//     await axios.delete(
//       `http://localhost:5000/api/complaints/${deleteTarget}`
//     );

//     setDeleteTarget(null);
//     fetchComplaints();
//   };

//   const pending = complaints.filter(c => c.status === "Pending").length;
//   const resolved = complaints.filter(c => c.status === "Resolved").length;

//   return (

//     <div className="flex bg-gray-100 min-h-screen">

//       {/* SIDEBAR */}

//       <div className="w-60 bg-blue-900 text-white p-6">

//         <h1 className="text-xl font-bold mb-10">
//           ShebaConnect
//         </h1>

//         <ul className="space-y-4">

//           <li className="hover:text-gray-300 cursor-pointer">
//             Dashboard
//           </li>

//           <li className="font-semibold text-yellow-300">
//             Complaints
//           </li>

//           <li className="hover:text-gray-300 cursor-pointer">
//             Services
//           </li>

//           <li className="hover:text-gray-300 cursor-pointer">
//             Documents
//           </li>

//         </ul>

//       </div>


//       {/* MAIN CONTENT */}

//       <div className="flex-1 p-10">

//         <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
//           <FaClipboardList />
//           Complaint Dashboard
//         </h1>


//         {/* STATS */}

//         <div className="grid md:grid-cols-3 gap-6 mb-10">

//           <div className="bg-white p-6 rounded-lg shadow">

//             <p className="text-gray-500">Total Complaints</p>
//             <h2 className="text-3xl font-bold">{complaints.length}</h2>

//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">

//             <p className="text-gray-500">Pending</p>
//             <h2 className="text-3xl font-bold text-yellow-500">
//               {pending}
//             </h2>

//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">

//             <p className="text-gray-500">Resolved</p>
//             <h2 className="text-3xl font-bold text-green-600">
//               {resolved}
//             </h2>

//           </div>

//         </div>


//         {/* COMPLAINT FORM */}

//         <div className="bg-white shadow rounded-lg p-6 mb-10">

//           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <FaPlus />
//             Submit Complaint
//           </h2>

//           <form onSubmit={handleSubmit}>

//             <div className="grid md:grid-cols-2 gap-4 mb-4">

//               <input
//                 type="text"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 placeholder="Department"
//                 className="border p-2 rounded"
//                 required
//               />

//               <input
//                 type="text"
//                 name="issueKeyword"
//                 value={formData.issueKeyword}
//                 onChange={handleChange}
//                 placeholder="Issue Keyword"
//                 className="border p-2 rounded"
//                 required
//               />

//             </div>

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Describe your issue"
//               className="border p-2 rounded w-full mb-4"
//               rows="4"
//               required
//             />

//             <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
//               Submit Complaint
//             </button>

//           </form>

//         </div>


//         {/* TABLE */}

//         <div className="bg-white shadow rounded-lg p-6">

//           <h2 className="text-xl font-bold mb-4">
//             Complaint Records
//           </h2>

//           <table className="w-full text-left">

//             <thead className="bg-gray-200">

//               <tr>
//                 <th className="p-3">Department</th>
//                 <th className="p-3">Issue</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Actions</th>
//               </tr>

//             </thead>

//             <tbody>

//               {complaints.map(c => (

//                 <tr key={c._id} className="border-t hover:bg-gray-50">

//                   <td className="p-3">{c.department}</td>
//                   <td className="p-3">{c.issueKeyword}</td>

//                   <td className="p-3">

//                     <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
//                       {c.status}
//                     </span>

//                   </td>

//                   <td className="p-3 flex gap-3">

//                     <button
//                       onClick={() => setSelectedComplaint(c)}
//                       className="text-blue-600"
//                     >
//                       <FaEye />
//                     </button>

//                     <button
//                       onClick={() => setDeleteTarget(c._id)}
//                       className="text-red-600"
//                     >
//                       <FaTrash />
//                     </button>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//       </div>


//       {/* VIEW MODAL */}

//       {selectedComplaint && (

//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-lg w-96">

//             <h2 className="text-xl font-bold mb-4">
//               Complaint Description
//             </h2>

//             <p className="mb-4">
//               {selectedComplaint.description}
//             </p>

//             <button
//               onClick={() => setSelectedComplaint(null)}
//               className="bg-gray-700 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>

//           </div>

//         </div>

//       )}


//       {/* DELETE MODAL */}

//       {deleteTarget && (

//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-lg text-center">

//             <h2 className="text-lg font-bold mb-4">
//               Confirm Deletion
//             </h2>

//             <p className="mb-6">
//               Are you sure you want to delete this complaint?
//             </p>

//             <div className="flex justify-center gap-4">

//               <button
//                 onClick={deleteComplaint}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 Delete
//               </button>

//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }




export default function Complaints() {
  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold">Complaints Page</h2>
    </div>
  );
}




