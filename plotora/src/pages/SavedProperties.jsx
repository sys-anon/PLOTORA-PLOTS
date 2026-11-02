import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Maximize2, Bed, Bath, Trash2, ArrowRight } from 'lucide-react';
import { getPropertyById, formatPrice } from '../firebase/propertyService';

export default function SavedProperties() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved IDs from localStorage
  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('plotora_saved') || '[]');
    if (ids.length === 0) { setLoading(false); return; }

    Promise.all(ids.map((id) => getPropertyById(id)))
      .then((results) => {
        setSaved(results.filter(Boolean)); // remove nulls
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeSaved = (id) => {
    const ids = JSON.parse(localStorage.getItem('plotora_saved') || '[]');
    const updated = ids.filter((i) => i !== id);
    localStorage.setItem('plotora_saved', JSON.stringify(updated));
    setSaved((prev) => prev.filter((p) => p.id !== id));
  };

  const clearAll = () => {
    localStorage.setItem('plotora_saved', '[]');
    setSaved([]);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="bg-[#0d2b1d] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Heart size={22} className="text-red-400" /> Saved Properties
            </h1>
            <p className="text-white/60 text-sm mt-1">{saved.length} saved listing{saved.length !== 1 ? 's' : ''}</p>
          </div>
          {saved.length > 0 && (
            <button
              onClick={() => { if (window.confirm('Clear all saved properties?')) clearAll(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={56} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No saved properties yet</h2>
            <p className="text-gray-500 mb-6">Click the ♡ heart icon on any property to save it here.</p>
            <button
              onClick={() => navigate('/properties')}
              className="btn-primary"
            >
              Browse Properties →
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((p) => (
              <div key={p.id} className="card overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">🏠</div>
                  )}
                  {/* Remove button */}
                  <button
                    onClick={() => removeSaved(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </button>
                  {p.tag && (
                    <span className="absolute top-3 left-3 bg-[#d4a017] text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {p.tag}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="text-primary-700 font-black text-lg mb-1">{formatPrice(p.price, p.category)}</p>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{p.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                    <MapPin size={12} />
                    <span>{p.location}</span>
                  </div>

                  {/* Specs */}
                  <div className="flex gap-3 text-xs text-gray-600 mb-4">
                    {p.area && (
                      <span className="flex items-center gap-1">
                        <Maximize2 size={12} /> {p.area} sq.ft
                      </span>
                    )}
                    {p.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed size={12} /> {p.bedrooms} BHK
                      </span>
                    )}
                    {p.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath size={12} /> {p.bathrooms}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/property/${p.id}`)}
                    className="w-full py-2 bg-primary-700 text-white text-sm font-bold rounded-xl hover:bg-primary-800 transition-colors flex items-center justify-center gap-2"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

