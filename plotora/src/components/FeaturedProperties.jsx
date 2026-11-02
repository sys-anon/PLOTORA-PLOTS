import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Car, ArrowRight, BadgeCheck } from 'lucide-react';
import { properties } from '../data/properties';

function formatPrice(price, category) {
  if (category === 'rent') {
    return `₹${(price / 1000).toFixed(0)}K/mo`;
  }
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString()}`;
}

const tagColors = {
  Featured: 'bg-primary-700 text-white',
  'Hot Deal': 'bg-red-500 text-white',
  New: 'bg-blue-500 text-white',
  Popular: 'bg-orange-500 text-white',
  Premium: 'bg-purple-600 text-white',
};

export function PropertyCard({ property, saved = false, onSave }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(saved);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave && onSave(property.id, !isSaved);
  };

  return (
    <div
      className="card overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="property-img-wrap relative h-52">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.tag && (
            <span className={`badge ${tagColors[property.tag] || 'bg-gray-700 text-white'}`}>
              {property.tag}
            </span>
          )}
          {property.verified && (
            <span className="badge bg-green-100 text-green-800">
              <BadgeCheck size={11} /> Verified
            </span>
          )}
        </div>
        {/* Save button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            size={16}
            className={isSaved ? 'text-red-500 fill-red-500' : 'text-gray-500'}
          />
        </button>
        {/* Price tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-[#0d2b1d] font-black text-base px-3 py-1 rounded-lg shadow">
          {formatPrice(property.price, property.category)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-primary-700 transition-colors truncate">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="text-primary-700 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Stats */}
        {(property.bedrooms || property.bathrooms || property.parking) && (
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <Bed size={13} className="text-primary-700" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath size={13} className="text-primary-700" />
                {property.bathrooms} Baths
              </span>
            )}
            {property.parking && (
              <span className="flex items-center gap-1">
                <Car size={13} className="text-primary-700" />
                {property.parking} Cars
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {property.area.toLocaleString()} sq.ft • {property.postedDate}
          </div>
          <button className="text-primary-700 hover:text-primary-800 p-1 rounded-lg hover:bg-primary-50 transition-colors">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProperties() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'sale', label: 'For Sale' },
    { id: 'rent', label: 'For Rent' },
  ];

  const filtered = activeTab === 'all'
    ? properties.filter((p) => p.featured)
    : properties.filter((p) => p.featured && p.category === activeTab);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-primary-700 font-semibold text-sm uppercase tracking-widest mb-2">
              Top Picks
            </p>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Handpicked premium properties just for you</p>
          </div>
          {/* Tabs */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-primary-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/properties')}
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Properties
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

