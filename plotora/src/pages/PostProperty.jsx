import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Home, Building2, Store, Key, Building, ChevronDown, CheckCircle } from 'lucide-react';
import { locations } from '../data/properties';

const propertyTypes = [
  { id: 'houses-sale', label: 'House for Sale', icon: Home },
  { id: 'land-plots', label: 'Land & Plot', icon: MapPin },
  { id: 'buildings-sale', label: 'Building for Sale', icon: Building2 },
  { id: 'shops-commercial', label: 'Shop / Commercial', icon: Store },
  { id: 'homes-rent', label: 'Home for Rent', icon: Key },
  { id: 'buildings-rent', label: 'Building for Rent', icon: Building },
];

export default function PostProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: '', title: '', location: '', price: '',
    area: '', bedrooms: '', bathrooms: '', parking: '',
    description: '', name: '', phone: '', email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="card p-12 text-center max-w-md mx-auto">
          <CheckCircle size={64} className="text-primary-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Property Posted!</h2>
          <p className="text-gray-500 mb-6">
            Your property listing has been submitted for review. Our team will verify and publish it within 24 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/')} className="btn-outline text-sm">Go Home</button>
            <button onClick={() => navigate('/properties')} className="btn-primary text-sm">Browse Properties</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="bg-[#0d2b1d] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-black text-white mb-2">Post Your Property</h1>
          <p className="text-white/60">List your property for free and reach thousands of buyers & renters</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-20 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            {[{ n: 1, label: 'Property Type' }, { n: 2, label: 'Details' }, { n: 3, label: 'Contact' }].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= n ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > n ? '✓' : n}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${step >= n ? 'text-primary-700' : 'text-gray-400'}`}>
                  {label}
                </span>
                {n < 3 && <div className={`flex-1 h-0.5 ${step > n ? 'bg-primary-700' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit}>

          {/* Step 1: Property Type */}
          {step === 1 && (
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">What type of property are you listing?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {propertyTypes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm({ ...form, type: id })}
                    className={`p-5 border-2 rounded-2xl text-center transition-all ${
                      form.type === id
                        ? 'border-primary-700 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                      form.type === id ? 'bg-primary-700' : 'bg-gray-100'
                    }`}>
                      <Icon size={20} className={form.type === id ? 'text-white' : 'text-gray-600'} />
                    </div>
                    <span className="text-sm font-semibold">{label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!form.type}
                onClick={() => setStep(2)}
                className="w-full mt-8 py-4 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="card p-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Property Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Luxury 3BHK Villa in Kozhikode"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Location *</label>
                <select name="location" value={form.location} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                  <option value="">Select Location</option>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="e.g. 5000000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Area (sq.ft) *</label>
                  <input name="area" type="number" value={form.area} onChange={handleChange} required placeholder="e.g. 2000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Bedrooms</label>
                  <select name="bedrooms" value={form.bedrooms} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                    <option value="">N/A</option>
                    {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Bathrooms</label>
                  <select name="bathrooms" value={form.bathrooms} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                    <option value="">N/A</option>
                    {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required
                  placeholder="Describe your property..." rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 resize-none" />
              </div>
              {/* Image upload placeholder */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Upload Photos</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
                  <Upload size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Drag & drop photos here, or <span className="text-primary-700 font-semibold">browse</span></p>
                  <p className="text-gray-400 text-xs mt-1">JPG, PNG up to 10MB each</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  ← Back
                </button>
                <button type="button" disabled={!form.title || !form.location || !form.price}
                  onClick={() => setStep(3)}
                  className="flex-2 px-8 py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors text-sm disabled:opacity-40">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="card p-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Your Contact Details</h2>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Phone Number *</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>

              {/* Summary */}
              <div className="bg-primary-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-gray-900 mb-2">Listing Summary</p>
                <div className="space-y-1 text-gray-600">
                  <p><strong>Type:</strong> {form.type}</p>
                  <p><strong>Title:</strong> {form.title}</p>
                  <p><strong>Location:</strong> {form.location}</p>
                  <p><strong>Price:</strong> ₹{parseInt(form.price || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  ← Back
                </button>
                <button type="submit" disabled={!form.name || !form.phone}
                  className="flex-1 py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors text-sm disabled:opacity-40">
                  🎉 Post Property Free
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

