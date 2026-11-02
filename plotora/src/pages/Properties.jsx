import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, X, ChevronDown } from 'lucide-react';
import { PropertyCard } from '../components/FeaturedProperties';
import { properties, locations } from '../data/properties';

const propertyTypes = [
  'All Types',
  'Houses for Sale',
  'Land & Plots',
  'Buildings for Sale',
  'Shops & Commercial',
  'Homes for Rent',
  'Buildings for Rent',
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Area: Large to Small', value: 'area-desc' },
];

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propType, setPropType] = useState(searchParams.get('type') || 'All Types');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBeds, setMinBeds] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Map URL type params to display labels
  useEffect(() => {
    const typeMap = {
      'houses-sale': 'Houses for Sale',
      'land-plots': 'Land & Plots',
      'buildings-sale': 'Buildings for Sale',
      'shops-commercial': 'Shops & Commercial',
      'homes-rent': 'Homes for Rent',
      'buildings-rent': 'Buildings for Rent',
    };
    const urlType = searchParams.get('type');
    if (urlType && typeMap[urlType]) setPropType(typeMap[urlType]);
    const urlCat = searchParams.get('category');
    if (urlCat) setCategory(urlCat);
  }, [searchParams]);

  // Filter logic
  let filtered = properties.filter((p) => {
    const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase());
    const matchLocation = !location || p.location.toLowerCase().includes(location.toLowerCase());
    const matchType = propType === 'All Types' || p.type === propType;
    const matchCategory = category === 'all' || p.category === category;
    const matchMinPrice = !minPrice || p.price >= parseInt(minPrice);
    const matchMaxPrice = !maxPrice || p.price <= parseInt(maxPrice);
    const matchBeds = !minBeds || (p.bedrooms && p.bedrooms >= parseInt(minBeds));
    return matchQuery && matchLocation && matchType && matchCategory && matchMinPrice && matchMaxPrice && matchBeds;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'area-desc') return b.area - a.area;
    return b.id - a.id;
  });

  const clearFilters = () => {
    setQuery(''); setLocation(''); setPropType('All Types');
    setCategory('all'); setMinPrice(''); setMaxPrice(''); setMinBeds('');
  };

  const hasFilters = query || location || propType !== 'All Types' || category !== 'all' || minPrice || maxPrice || minBeds;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="bg-[#0d2b1d] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white mb-2">Browse Properties</h1>
          <p className="text-white/60 text-sm">
            {filtered.length} properties found
            {location ? ` in ${location}` : ''}
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 min-w-[180px]">
              <MapPin size={16} className="text-primary-700" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
              >
                <option value="">All Locations</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                showFilters ? 'bg-primary-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Property Type */}
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Property Type</label>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary-500"
                >
                  {propertyTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Category */}
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Listing Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary-500"
                >
                  <option value="all">Buy & Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              {/* Min Price */}
              <div className="flex-1 min-w-[130px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Min Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary-500"
                />
              </div>
              {/* Max Price */}
              <div className="flex-1 min-w-[130px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 10000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary-500"
                />
              </div>
              {/* Min Beds */}
              <div className="flex-1 min-w-[110px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Min Bedrooms</label>
                <select
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary-500"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X size={14} /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          {/* Category tabs */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            {[
              { id: 'all', label: 'All' },
              { id: 'sale', label: 'For Sale' },
              { id: 'rent', label: 'For Rent' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  category === tab.id
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-primary-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white focus:border-primary-500"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
            <button onClick={clearFilters} className="btn-primary text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

