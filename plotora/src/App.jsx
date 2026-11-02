import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PostProperty from './pages/PostProperty';
import AdminPanel from './pages/AdminPanel';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const LoginPage = () => (
  <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
    <div className="card p-10 text-center max-w-sm w-full mx-4">
      <div className="text-5xl mb-4">🔐</div>
      <h2 className="text-2xl font-black text-gray-900 mb-6">Login to Plotora</h2>
      <div className="space-y-3">
        <input type="email" placeholder="Email address"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
        <input type="password" placeholder="Password"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
        <button className="w-full py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors">
          Login
        </button>
        <button className="w-full py-3 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition-colors">
          📱 Continue with Google
        </button>
      </div>
    </div>
  </div>
);

const SellPage = () => <Navigate to="/post-property" replace />;

const SavedPage = () => (
  <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-5xl mb-4">❤️</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Saved Properties</h2>
      <p className="text-gray-500">Please log in to view your saved properties.</p>
    </div>
  </div>
);

// Admin has no Navbar/Footer
function AdminLayout({ children }) {
  return <>{children}</>;
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

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin route — no navbar/footer */}
        <Route path="/admin" element={
          <AdminLayout><AdminPanel /></AdminLayout>
        } />

        {/* All public routes — with navbar + footer */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/properties"     element={<Properties />} />
              <Route path="/property/:id"   element={<PropertyDetail />} />
              <Route path="/about"          element={<About />} />
              <Route path="/contact"        element={<Contact />} />
              <Route path="/post-property"  element={<PostProperty />} />
              <Route path="/sell"           element={<SellPage />} />
              <Route path="/login"          element={<LoginPage />} />
              <Route path="/saved"          element={<SavedPage />} />
              <Route path="*"              element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}
