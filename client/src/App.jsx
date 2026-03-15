// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // import Layout from "./components/Layout";

// import Home from "./pages/Home";
// import Complaints from "./pages/Complaints";
// import Services from "./pages/Services";
// import Documents from "./pages/Documents";

// function App() {

//   return (

//     <Router>

//       <Layout>

//         <Routes>

//           <Route path="/" element={<Home />} />
//           <Route path="/complaints" element={<Complaints />} />
//           <Route path="/services" element={<Services />} />
//           <Route path="/documents" element={<Documents />} />

//         </Routes>

//       </Layout>

//     </Router>

//   );

// }

// export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Complaints from "./pages/Complaints";
// import Services from "./pages/Services";
// import Documents from "./pages/Documents";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import PrivateRoute from "./components/PrivateRoute";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check if user is logged in
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("token");
    
//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   return (
//     <Router>
//       {/* Navbar will be shown on all pages except login/register */}
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
//         <Route path="/complaints" element={
//           <PrivateRoute>
//             <Complaints user={user} />
//           </PrivateRoute>
//         } />
//         <Route path="/services" element={
//           <PrivateRoute>
//             <Services />
//           </PrivateRoute>
//         } />
//         <Route path="/documents" element={
//           <PrivateRoute>
//             <Documents />
//           </PrivateRoute>
//         } />
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";

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
        <Route path="/complaints" element={
          <PrivateRoute>
            <Complaints user={user} />
          </PrivateRoute>
        } />
        <Route path="/services" element={
          <PrivateRoute>
            <Services />
          </PrivateRoute>
        } />
        <Route path="/documents" element={
          <PrivateRoute>
            <Documents />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;