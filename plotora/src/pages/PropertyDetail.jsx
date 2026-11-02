import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Car, Ruler, BadgeCheck, Heart, Share2,
  Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight, X,
  Home, Zap, Droplets, Shield, Loader2
} from 'lucide-react';
import { getPropertyById, formatPrice } from '../firebase/propertyService';
import { PropertyCard } from '../components/FeaturedProperties';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeImg, setActiveImg]   = useState(0);
  const [lightbox, setLightbox]     = useState(false);
  const [isSaved, setIsSaved]       = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPropertyById(id)
      .then((data) => { setProperty(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 size={40} className="text-primary-700 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <button onClick={() => navigate('/properties')} className="btn-primary mt-4">
            Browse All Properties
          </button>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [property.image].filter(Boolean);
  if (images.length === 0) images.push('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80');

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleContact = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1000);
  };

  const amenityIcons = [Home, Zap, Droplets, Shield, Car, Bed];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-primary-700 font-medium">
            <ArrowLeft size={15} /> Back
          </button>
          <span>/</span>
          <Link to="/" className="hover:text-primary-700">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary-700">Properties</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-72 sm:h-96 cursor-pointer" onClick={() => setLightbox(true)}>
                <img src={images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImg(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImg(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.verified && (
                    <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      <BadgeCheck size={12} /> Verified
                    </span>
                  )}
                  {property.tag && (
                    <span className="bg-primary-700 text-white text-xs font-bold px-3 py-1 rounded-full">{property.tag}</span>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                  {activeImg + 1} / {images.length}
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 bg-gray-50">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-primary-700' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">{property.type}</span>
                    {property.postedDate && <span className="text-xs text-gray-400">• {property.postedDate}</span>}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{property.title}</h1>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-sm">
                    <MapPin size={14} className="text-primary-700 flex-shrink-0" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl sm:text-3xl font-black text-primary-700">
                    {formatPrice(property.price, property.category)}
                  </div>
                  {property.category === 'rent' && <span className="text-xs text-gray-400">per month</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mb-6">
                <button onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                    isSaved ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 text-gray-700 hover:border-primary-300'
                  }`}>
                  <Heart size={15} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:border-primary-300 transition-colors">
                  <Share2 size={15} /> Share
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Ruler, label: 'Area', value: `${Number(property.area || 0).toLocaleString()} sq.ft` },
                  property.bedrooms && { icon: Bed,  label: 'Bedrooms',  value: property.bedrooms },
                  property.bathrooms && { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                  property.parking  && { icon: Car,  label: 'Parking',   value: `${property.parking} Cars` },
                ].filter(Boolean).map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                      <Icon size={18} className="text-primary-700 mx-auto mb-1" />
                      <div className="font-bold text-gray-900 text-sm">{stat.value}</div>
                      <div className="text-gray-400 text-xs">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {property.description && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">About This Property</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a, i) => {
                    const Icon = amenityIcons[i % amenityIcons.length];
                    return (
                      <div key={a} className="flex items-center gap-2.5 p-3 bg-primary-50 rounded-xl">
                        <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{a}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Contact Agent</h3>
              {property.agent && (
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  {property.agent.image ? (
                    <img src={property.agent.image} alt={property.agent.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary-100" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-lg">
                        {property.agent.name?.[0] || 'A'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{property.agent.name}</p>
                    <p className="text-gray-500 text-xs">Property Agent</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-5">
                <a href={`tel:${property.agent?.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-700 text-white text-sm font-bold rounded-xl hover:bg-primary-800 transition-colors">
                  <Phone size={15} /> Call
                </a>
                <a href="mailto:hello@plotora.com"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-primary-700 text-primary-700 text-sm font-bold rounded-xl hover:bg-primary-50 transition-colors">
                  <Mail size={15} /> Email
                </a>
              </div>

              {submitted ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-bold text-gray-900">Message Sent!</p>
                  <p className="text-gray-500 text-sm mt-1">The agent will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-3">
                  <input type="text" placeholder="Your Name" value={contactForm.name} required
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
                  <input type="tel" placeholder="Phone Number" value={contactForm.phone} required
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
                  <input type="email" placeholder="Email (optional)" value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
                  <textarea placeholder={`I'm interested in "${property.title}"...`} rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 resize-none" />
                  <button type="submit" disabled={submitting}
                    className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
            <X size={20} />
          </button>
          <button onClick={prevImg} className="absolute left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronLeft size={24} />
          </button>
          <img src={images[activeImg]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" />
          <button onClick={nextImg} className="absolute right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 text-white/60 text-sm">{activeImg + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
