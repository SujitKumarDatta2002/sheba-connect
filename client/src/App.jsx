

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Complaints from "./pages/Complaints";
// import Services from "./pages/Services";
// import Documents from "./pages/Documents";
// import UploadDocument from "./pages/UploadDocument";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import PrivateRoute from "./components/PrivateRoute";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   return (
//     <Router>

//       {/* Navbar */}
//       <Routes>
//         <Route path="/login" element={null} />
//         <Route path="/register" element={null} />
//         <Route path="*" element={<Navbar user={user} setUser={setUser} />} />
//       </Routes>

//       {/* Page Content */}
//       <Routes>

//         <Route path="/" element={<Home />} />

//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/register" element={<Register setUser={setUser} />} />

//         {/* Protected Routes */}

//         <Route
//           path="/complaints"
//           element={
//             <PrivateRoute>
//               <Complaints user={user} />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/services"
//           element={
//             <PrivateRoute>
//               <Services />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/documents"
//           element={
//             <PrivateRoute>
//               <Documents />
//             </PrivateRoute>
//           }
//         />

//         {/* Upload Document Route */}

//         <Route
//           path="/upload/:type"
//           element={
//             <PrivateRoute>
//               <UploadDocument />
//             </PrivateRoute>
//           }
//         />

//           {/* Admin Dashboard Route */}
//           <Route
//             path="/admin"
//             element={
//               <PrivateRoute>
//                 <AdminDashboard />
//               </PrivateRoute>
//             }
//           />

//       </Routes>

//     </Router>
//   );
// }

// export default App;











import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Complaints from "./pages/Complaints";
import Services from "./pages/Services";
import Documents from "./pages/Documents";
import UploadDocument from "./pages/UploadDocument";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import NearbyOffices from "./pages/NearbyOffices"; // 👈 Import new page

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>

      {/* Navbar */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/register" element={null} />
        <Route path="*" element={<Navbar user={user} setUser={setUser} />} />
      </Routes>

      {/* Page Content */}
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Protected Routes */}

        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <Complaints user={user} />
            </PrivateRoute>
          }
        />

        <Route
          path="/services"
          element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <PrivateRoute>
              <Documents />
            </PrivateRoute>
          }
        />

        {/* Upload Document Route */}
        <Route
          path="/upload/:type"
          element={
            <PrivateRoute>
              <UploadDocument />
            </PrivateRoute>
          }
        />

        {/* Nearby Offices Route */}
        <Route
          path="/nearby"
          element={
            <PrivateRoute>
              <NearbyOffices />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;