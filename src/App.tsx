import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RouteTransition from "./components/RouteTransition";
import { ContentProvider } from "./lib/content";
import Home from "./pages/Home";
import AdminRoute from "./components/admin/AdminRoute";

// Every route below is fetched on first navigation to it rather than bundled
// into the initial script — Home stays eager since it's the near-universal
// landing page (no extra chunk round-trip for the page that matters most for
// LCP), and the admin panel (its own editors + media picker) is pure dead
// weight for the ~99% of visitors who never open /admin.
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Capabilities = lazy(() => import("./pages/Capabilities"));
const QualitySafety = lazy(() => import("./pages/QualitySafety"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Locations = lazy(() => import("./pages/Locations"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

function PublicSite() {
  return (
    <Layout>
      <Suspense fallback={null}>
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
      </Suspense>
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
