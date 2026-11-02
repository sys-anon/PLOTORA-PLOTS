import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PostProperty from './pages/PostProperty';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import SavedProperties from './pages/SavedProperties';
import BrowseProperties from './pages/BrowseProperties';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin — no navbar/footer */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Auth pages — no footer */}
        <Route path="/login"    element={<><Navbar /><LoginPage /></>} />
        <Route path="/register" element={<><Navbar /><LoginPage /></>} />

        {/* Public routes with full layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/properties"    element={<Properties />} />
              <Route path="/browse"        element={<BrowseProperties />} />
              <Route path="/property/:id"  element={<PropertyDetail />} />
              <Route path="/about"         element={<About />} />
              <Route path="/contact"       element={<Contact />} />
              <Route path="/post-property" element={<PostProperty />} />
              <Route path="/sell"          element={<Navigate to="/post-property" replace />} />
              <Route path="/saved"         element={<SavedProperties />} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
