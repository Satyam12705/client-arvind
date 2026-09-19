import { lazy, Suspense } from "react";
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
import AdminRoute from "./components/admin/AdminRoute";

// Public pages are bundled eagerly (like before code-splitting was tried
// here) — each one is only 1-3 KB gzipped, so splitting them saved little
// bundle size but cost a visible blank flash on every first visit to a page
// while its chunk fetched over the network (Suspense had nothing to show
// during that gap). The admin panel is the one route worth lazy-loading:
// its own editors + media picker are real weight, and it's never hit by
// public traffic, so there's no navigation-flicker cost to worry about.
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

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
        <Suspense fallback={null}>
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
        </Suspense>
      </BrowserRouter>
    </ContentProvider>
  );
}
