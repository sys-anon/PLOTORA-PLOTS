import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Building2, Store, Key, Building, ArrowRight } from 'lucide-react';
import { categories } from '../data/properties';

const iconMap = { Home, MapPin, Building2, Store, Key, Building };

export default function CategoryCards() {
  const navigate = useNavigate();

  const handleCategory = (cat) => {
    const params = new URLSearchParams();
    if (cat.filter.category) params.set('category', cat.filter.category);
    if (cat.filter.type) params.set('type', cat.filter.type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-widest mb-2">
            Browse By Category
          </p>
          <h2 className="section-title">Find What You're Looking For</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Explore our wide range of property categories — from homes to commercial spaces
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            return (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat)}
                className="category-card group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                {/* Background image */}
                <div className="relative h-36 overflow-hidden rounded-t-2xl">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b1d]/80 via-[#0d2b1d]/20 to-transparent" />
                  {/* Count badge */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cat.count}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                      {Icon && <Icon size={14} className="text-primary-700 group-hover:text-white transition-colors" />}
                    </div>
                    <ArrowRight size={14} className="text-gray-400 group-hover:text-primary-700 group-hover:translate-x-1 transition-all ml-auto" />
                  </div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">{cat.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.count} listings</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/properties')}
            className="btn-outline text-sm"
          >
            View All Properties →
          </button>
        </div>
      </div>
    </section>
  );
}

