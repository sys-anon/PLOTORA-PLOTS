import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Home } from 'lucide-react';
import { locations } from '../data/properties';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=90';

const propertyTypes = [
  'All Properties',
  'Houses for Sale',
  'Land & Plots',
  'Buildings for Sale',
  'Shops & Commercial',
  'Homes for Rent',
  'Buildings for Rent',
];

export default function Hero() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [propType, setPropType] = useState('All Properties');
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [showTypeDrop, setShowTypeDrop] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    if (propType !== 'All Properties') params.set('type', propType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Luxury Property"
          className="w-full h-full object-cover object-center"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-gold-DEFAULT" />
            <span className="text-gold-DEFAULT text-sm font-semibold tracking-widest uppercase">
              Your Dream Property
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            Now Just a{' '}
            <span className="text-[#22c55e]">Click</span>{' '}
            Away
          </h1>

          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-xl font-light leading-relaxed">
            Buy, Sell or Rent Properties with Ease.{' '}
            <br className="hidden sm:block" />
            Find the perfect place with Plotora.
          </p>

          {/* Quick pills — clickable */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/properties?category=sale')}
              className="px-4 py-1.5 rounded-full text-sm font-bold border border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/25 hover:border-white transition-all"
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => navigate('/post-property')}
              className="px-4 py-1.5 rounded-full text-sm font-bold border border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/25 hover:border-white transition-all"
            >
              Sell
            </button>
            <button
              type="button"
              onClick={() => navigate('/properties?category=rent')}
              className="px-4 py-1.5 rounded-full text-sm font-bold border border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/25 hover:border-white transition-all"
            >
              Rent
            </button>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2"
          >
            {/* Query input */}
            <div className="flex items-center gap-2 flex-1 px-4 py-2 bg-gray-50 rounded-xl">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for houses, land, buildings..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Location dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowLocDrop(!showLocDrop); setShowTypeDrop(false); }}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors min-w-[160px]"
              >
                <MapPin size={16} className="text-primary-700 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{location || 'Select Location'}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {showLocDrop && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 max-h-56 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => { setLocation(''); setShowLocDrop(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-primary-50"
                  >
                    Any Location
                  </button>
                  {locations.map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => { setLocation(l); setShowLocDrop(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property type dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowTypeDrop(!showTypeDrop); setShowLocDrop(false); }}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors min-w-[150px]"
              >
                <Home size={16} className="text-primary-700 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{propType}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {showTypeDrop && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  {propertyTypes.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => { setPropType(t); setShowTypeDrop(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        propType === t
                          ? 'bg-primary-700 text-white'
                          : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-3 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors shadow-lg text-sm"
            >
              <Search size={17} />
              Search
            </button>
          </form>

          {/* Trust tags */}
          <div className="flex flex-wrap gap-4 mt-6">
            {['5,000+ Listings', 'Verified Properties', 'Safe & Secure Deals'].map((tag) => (
              <div key={tag} className="flex items-center gap-1.5 text-white/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 30C1200 0 960 60 720 30C480 0 240 60 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

