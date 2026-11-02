import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, SlidersHorizontal, Home, Building2,
  Store, X, ChevronDown, ArrowRight, Loader2,
} from 'lucide-react';
import { PropertyCard, PropertyCardSkeleton } from '../components/FeaturedProperties';
import { getAllProperties, formatPrice } from '../firebase/propertyService';
import { locations } from '../data/properties';

// ── Constants ───────────────────────────────────────────────
const PROPERTY_TYPES = [
  { value: '',                    label: 'All Types'          },
  { value: 'Houses for Sale',     label: 'Houses for Sale'    },
  { value: 'Land & Plots',        label: 'Land & Plots'       },
  { value: 'Buildings for Sale',  label: 'Buildings for Sale' },
  { value: 'Shops & Commercial',  label: 'Shops & Commercial' },
];

const PRICE_RANGES = [
  { label: 'Any Price',       min: '',        max: ''         },
  { label: 'Under ₹10 L',    min: '',        max: '1000000'  },
  { label: '₹10L – ₹25L',   min: '1000000', max: '2500000'  },
  { label: '₹25L – ₹50L',   min: '2500000', max: '5000000'  },
  { label: '₹50L – ₹1 Cr',  min: '5000000', max: '10000000' },
  { label: 'Above ₹1 Cr',   min: '10000000', max: ''         },
];

const SORT_OPTIONS = [
  { label: 'Newest First',         value: 'newest'     },
  { label: 'Price: Low → High',    value: 'price-asc'  },
  { label: 'Price: High → Low',    value: 'price-desc' },
  { label: 'Area: Large → Small',  value: 'area-desc'  },
];

// ── Initial filter state ─────────────────────────────────────
const INITIAL_FILTERS = {
  keyword:   '',
  location:  '',
  type:      '',
  priceRange: 0,   // index into PRICE_RANGES
  minBeds:   '',
  sort:      'newest',
};

// ── Sort helper ──────────────────────────────────────────────
function applySorting(list, sort) {
  return [...list].sort((a, b) => {
    if (sort === 'price-asc')  return Number(a.price) - Number(b.price);
    if (sort === 'price-desc') return Number(b.price) - Number(a.price);
    if (sort === 'area-desc')  return Number(b.area)  - Number(a.area);
    return 0;
  });
}

// ── Filter helper ────────────────────────────────────────────
function applyFilters(list, filters) {
  const { keyword, location, type, priceRange, minBeds } = filters;
  const kw  = keyword.toLowerCase().trim();
  const pr  = PRICE_RANGES[priceRange];

  return list.filter((p) => {
    const matchKw  = !kw || p.title?.toLowerCase().includes(kw) || p.location?.toLowerCase().includes(kw);
    const matchLoc = !location || p.location === location;
    const matchTyp = !type     || p.type === type;
    const matchMin = !pr.min   || Number(p.price) >= Number(pr.min);
    const matchMax = !pr.max   || Number(p.price) <= Number(pr.max);
    const matchBed = !minBeds  || (p.bedrooms && Number(p.bedrooms) >= Number(minBeds));
    return matchKw && matchLoc && matchTyp && matchMin && matchMax && matchBed;
  });
}

// ════════════════════════════════════════════════════════════
export default function BrowseProperties() {
  const navigate = useNavigate();

  // Filter form state
  const [filters, setFilters]     = useState(INITIAL_FILTERS);
  const [draft, setDraft]         = useState(INITIAL_FILTERS); // draft = form values before search

  // Results state
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false); // has user searched at least once?
  const [error, setError]         = useState('');

  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ── Handle search ────────────────────────────────────────
  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // Fetch all approved properties from Firestore
      const all = await getAllProperties('approved');

      // Apply filters + sort in memory
      const committed = { ...draft };
      setFilters(committed);

      const filtered = applyFilters(all, committed);
      const sorted   = applySorting(filtered, committed.sort);
      setResults(sorted);
    } catch (err) {
      setError('Failed to load properties. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [draft]);

  const handleClear = () => {
    setDraft(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
    setResults([]);
    setSearched(false);
  };

  const hasActiveDraft =
    draft.keyword || draft.location || draft.type ||
    draft.priceRange !== 0 || draft.minBeds;

  // ── Re-sort already-fetched results without re-fetching ──
  const handleSortChange = (sortVal) => {
    setDraft((d) => ({ ...d, sort: sortVal }));
    setFilters((f) => ({ ...f, sort: sortVal }));
    setResults((prev) => applySorting(prev, sortVal));
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">

      {/* ── Hero Search Panel ──────────────────────────────── */}
      <div className="bg-[#0d2b1d] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-[#22c55e] text-sm font-semibold uppercase tracking-widest mb-2">
              Find Your Property
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Browse Properties
            </h1>
            <p className="text-white/60 text-base">
              Use the filters below to find your perfect property in Kerala
            </p>
          </div>

          {/* ── Main Search Form ── */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 space-y-4">

            {/* Row 1: Keyword + Location */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors">
                <Search size={17} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by title, keyword..."
                  value={draft.keyword}
                  onChange={(e) => setDraft((d) => ({ ...d, keyword: e.target.value }))}
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                />
                {draft.keyword && (
                  <button type="button" onClick={() => setDraft((d) => ({ ...d, keyword: '' }))}>
                    <X size={14} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors">
                <MapPin size={17} className="text-primary-700 flex-shrink-0" />
                <select
                  value={draft.location}
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                >
                  <option value="">All Locations</option>
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Property Type + Price Range */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors">
                <Home size={17} className="text-primary-700 flex-shrink-0" />
                <select
                  value={draft.type}
                  onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors">
                <span className="text-primary-700 font-bold text-sm flex-shrink-0">₹</span>
                <select
                  value={draft.priceRange}
                  onChange={(e) => setDraft((d) => ({ ...d, priceRange: Number(e.target.value) }))}
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                >
                  {PRICE_RANGES.map((pr, i) => (
                    <option key={i} value={i}>{pr.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 transition-colors"
            >
              <SlidersHorizontal size={14} />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
              <ChevronDown
                size={14}
                className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Advanced filters */}
            {showAdvanced && (
              <div className="border-t border-gray-100 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                      Min. Bedrooms
                    </label>
                    <select
                      value={draft.minBeds}
                      onChange={(e) => setDraft((d) => ({ ...d, minBeds: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}+ Bedrooms</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                      Sort Results By
                    </label>
                    <select
                      value={draft.sort}
                      onChange={(e) => setDraft((d) => ({ ...d, sort: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              {hasActiveDraft && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-5 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 text-sm transition-colors"
                >
                  <X size={15} /> Clear
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors text-base shadow-lg disabled:opacity-70"
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> Searching...</>
                  : <><Search size={18} /> Search Properties</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Results Section ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Not searched yet — prompt state */}
        {!searched && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Search size={36} className="text-primary-700" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">
              Find Your Ideal Property
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              Use the search panel above to set your location, budget, and property type — then click
              <strong> Search Properties</strong> to see matching listings.
            </p>

            {/* Quick-start chips */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: '🏠 Houses for Sale', type: 'Houses for Sale' },
                { label: '🌿 Land & Plots',    type: 'Land & Plots'    },
                { label: '🏢 Commercial',       type: 'Shops & Commercial' },
                { label: '🏗️ Buildings',        type: 'Buildings for Sale' },
              ].map((chip) => (
                <button
                  key={chip.type}
                  onClick={() => {
                    const next = { ...INITIAL_FILTERS, type: chip.type };
                    setDraft(next);
                    // Auto-search immediately when chip is clicked
                    setLoading(true);
                    setSearched(true);
                    getAllProperties('approved').then((all) => {
                      setFilters(next);
                      setResults(applySorting(applyFilters(all, next), next.sort));
                      setLoading(false);
                    }).catch(() => setLoading(false));
                  }}
                  className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:border-primary-500 hover:text-primary-700 transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map((n) => <PropertyCardSkeleton key={n} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button onClick={handleSearch} className="btn-primary text-sm">Try Again</button>
          </div>
        )}

        {/* Results */}
        {searched && !loading && !error && (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {results.length > 0
                    ? `${results.length} propert${results.length === 1 ? 'y' : 'ies'} found`
                    : 'No properties found'}
                </h2>
                {filters.location && (
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={13} className="text-primary-700" /> {filters.location}
                    {filters.type && <> · {filters.type}</>}
                    {filters.priceRange !== 0 && <> · {PRICE_RANGES[filters.priceRange].label}</>}
                  </p>
                )}
              </div>

              {/* Sort (re-sort without re-fetch) */}
              {results.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort:</span>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white focus:border-primary-500"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No properties match your search</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                  Try changing the location, removing the price filter, or selecting a different property type.
                </p>
                <button onClick={handleClear} className="btn-primary text-sm">
                  Clear Filters & Search Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {results.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

