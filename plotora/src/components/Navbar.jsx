import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Building2, Heart, User, Plus, Menu, X, ChevronDown,
  Phone, Mail, MapPin
} from 'lucide-react';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="relative">
      <svg width="48" height="42" viewBox="0 0 48 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* House outline */}
        <path d="M4 20L24 4L44 20V40H30V28H18V40H4V20Z" fill="#0d2b1d" stroke="#22c55e" strokeWidth="2"/>
        {/* Roof accent */}
        <path d="M8 22L24 8L40 22" fill="none" stroke="#d4a017" strokeWidth="2.5"/>
        {/* Door */}
        <rect x="19" y="28" width="10" height="12" rx="1" fill="#22c55e"/>
        {/* Window */}
        <rect x="8" y="22" width="8" height="7" rx="1" fill="#22c55e" opacity="0.7"/>
        <rect x="32" y="22" width="8" height="7" rx="1" fill="#22c55e" opacity="0.7"/>
        {/* Arrow/P shape overlay */}
        <path d="M36 2 L44 2 L44 14 L36 14 L36 10 L40 10 L40 6 L36 6 Z" fill="#d4a017"/>
      </svg>
    </div>
    <div>
      <div className="text-2xl font-black text-[#0d2b1d] leading-none tracking-wide">
        PLOT<span className="text-[#d4a017]">O</span>RA
      </div>
      <div className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase leading-tight">
        Modern Property Marketplace
      </div>
    </div>
  </Link>
);

const navLinks = [
  { label: 'Home', to: '/', icon: Home },
  {
    label: 'Properties',
    to: '/properties',
    icon: Building2,
    dropdown: [
      { label: 'All Properties', to: '/properties' },
      { label: 'Houses for Sale', to: '/properties?type=houses-sale' },
      { label: 'Land & Plots', to: '/properties?type=land-plots' },
      { label: 'Buildings for Sale', to: '/properties?type=buildings-sale' },
      { label: 'Shops & Commercial', to: '/properties?type=shops-commercial' },
      { label: 'Homes for Rent', to: '/properties?type=homes-rent' },
      { label: 'Buildings for Rent', to: '/properties?type=buildings-rent' },
    ],
  },
  { label: 'Sell Property', to: '/sell' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg py-2'
          : 'bg-white/95 backdrop-blur-sm py-3'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-primary-700 rounded-lg hover:bg-primary-50 transition-colors">
                    <link.icon size={15} />
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
                    }`
                  }
                >
                  {link.icon && <link.icon size={15} />}
                  {link.label}
                </NavLink>
              )
            )}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              className="p-2 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              title="Saved Properties"
              onClick={() => navigate('/saved')}
            >
              <Heart size={20} />
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-full hover:border-primary-700 hover:text-primary-700 transition-colors"
              onClick={() => navigate('/login')}
            >
              <User size={15} />
              Login
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-700 rounded-full hover:bg-primary-800 transition-colors shadow-md"
              onClick={() => navigate('/post-property')}
            >
              <Plus size={15} />
              Post Property
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-3 pb-4 border-t border-gray-100">
            <div className="pt-3 space-y-1">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <div className="px-4 py-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {link.label}
                    </div>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="block px-6 py-2 text-sm text-gray-700 hover:text-primary-700"
                        onClick={() => setMobileOpen(false)}
                      >
                        → {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm font-semibold rounded-lg ${
                        isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-700'
                      }`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                )
              )}
              <div className="flex gap-2 px-4 pt-3">
                <button className="flex-1 py-2.5 text-sm font-semibold border border-gray-300 rounded-full text-gray-700">
                  Login
                </button>
                <button className="flex-1 py-2.5 text-sm font-bold bg-primary-700 text-white rounded-full">
                  + Post Property
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

