import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RouteTransition from "./components/RouteTransition";
import { ContentProvider } from "./lib/content";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Capabilities from "./pages/Capabilities";
import QualitySafety from "./pages/QualitySafety";
import Certifications from "./pages/Certifications";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import ServiceDetail from "./pages/ServiceDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRoute from "./components/admin/AdminRoute";

function PublicSite() {
  return (
    <Layout>
      <RouteTransition>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:state" element={<LocationDetail />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/quality-safety" element={<QualitySafety />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </RouteTransition>
    </Layout>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
