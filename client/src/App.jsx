import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Complaints from "./pages/Complaints";
import Services from "./pages/Services";
import Documents from "./pages/Documents";

function App() {

  return (

    <Router>

      <Layout>

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/services" element={<Services />} />
          <Route path="/documents" element={<Documents />} />

        </Routes>

      </Layout>

    </Router>

  );

}

export default App;