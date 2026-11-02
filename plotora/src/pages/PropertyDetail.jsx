import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Car, Ruler, BadgeCheck, Heart, Share2,
  Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight, X,
  Home, Zap, Droplets, Shield
} from 'lucide-react';
import { properties } from '../data/properties';
import { PropertyCard } from '../components/FeaturedProperties';

function formatPrice(price, category) {
  if (category === 'rent') return `₹${(price / 1000).toFixed(0)},000 / month`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} Lakh`;
  return `₹${price.toLocaleString()}`;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === parseInt(id));
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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

  const similar = properties.filter((p) => p.id !== property.id && p.type === property.type).slice(0, 3);

  const prevImg = () => setActiveImg((i) => (i === 0 ? property.images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === property.images.length - 1 ? 0 : i + 1));

  const handleContact = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-primary-700 transition-colors font-medium">
            <ArrowLeft size={15} />
            Back
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Main Image */}
              <div className="relative h-72 sm:h-96 cursor-pointer" onClick={() => setLightbox(true)}>
                <img
                  src={property.images[activeImg]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {/* Nav arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImg(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImg(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.verified && (
                    <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      <BadgeCheck size={12} /> Verified
                    </span>
                  )}
                  {property.tag && (
                    <span className="bg-primary-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {property.tag}
                    </span>
                  )}
                </div>
                {/* Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                  {activeImg + 1} / {property.images.length}
                </div>
              </div>
              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 p-3 bg-gray-50">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeImg ? 'border-primary-700' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                      {property.type}
                    </span>
                    <span className="text-xs text-gray-400">• {property.postedDate}</span>
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
                  {property.category === 'rent' && (
                    <span className="text-xs text-gray-400">per month</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                    isSaved
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-700 hover:border-primary-300'
                  }`}
                >
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
                  { icon: Ruler, label: 'Area', value: `${property.area.toLocaleString()} sq.ft` },
                  property.bedrooms && { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                  property.bathrooms && { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                  property.parking && { icon: Car, label: 'Parking', value: `${property.parking} Cars` },
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

              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">About This Property</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a, i) => {
                    const icons = [Home, Zap, Droplets, Shield, Car, Bed];
                    const Icon = icons[i % icons.length];
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

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 text-xl mb-4">Similar Properties</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Contact Agent</h3>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <img
                  src={property.agent.image}
                  alt={property.agent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-100"
                />
                <div>
                  <p className="font-bold text-gray-900">{property.agent.name}</p>
                  <p className="text-gray-500 text-xs">Property Consultant</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick contact */}
              <div className="flex gap-2 mb-5">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-700 text-white text-sm font-bold rounded-xl hover:bg-primary-800 transition-colors"
                >
                  <Phone size={15} /> Call
                </a>
                <a
                  href={`mailto:hello@plotora.com`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-primary-700 text-primary-700 text-sm font-bold rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <Mail size={15} /> Email
                </a>
              </div>

              {/* Contact Form */}
              {submitted ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-bold text-gray-900">Message Sent!</p>
                  <p className="text-gray-500 text-sm mt-1">The agent will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
                  />
                  <textarea
                    placeholder={`I'm interested in "${property.title}". Please contact me with more details.`}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    Send Message
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
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <button onClick={prevImg} className="absolute left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronLeft size={24} />
          </button>
          <img
            src={property.images[activeImg]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
          <button onClick={nextImg} className="absolute right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {activeImg + 1} / {property.images.length}
          </div>
        </div>
      )}
    </div>
  );
}

