import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Home, Building2, Store, Key, Building, CheckCircle, Loader2, X, Image } from 'lucide-react';
import { addProperty, uploadImages } from '../firebase/propertyService';
import { locations } from '../data/properties';

const propertyTypes = [
  { id: 'Houses for Sale',      label: 'House for Sale',      icon: Home     },
  { id: 'Land & Plots',         label: 'Land & Plot',         icon: MapPin   },
  { id: 'Buildings for Sale',   label: 'Building for Sale',   icon: Building2},
  { id: 'Shops & Commercial',   label: 'Shop / Commercial',   icon: Store    },
  { id: 'Homes for Rent',       label: 'Home for Rent',       icon: Key      },
  { id: 'Buildings for Rent',   label: 'Building for Rent',   icon: Building },
];

const amenitiesOptions = [
  'Swimming Pool','Parking','Garden','Gym','Power Backup',
  'Security','Lift/Elevator','Balcony','Modular Kitchen',
  'CCTV','Solar Panels','Water Purifier','Children Play Area',
  'Road Access','Clear Title',
];

export default function PostProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: '', category: 'sale', title: '', location: '', price: '',
    area: '', bedrooms: '', bathrooms: '', parking: '',
    description: '', amenities: [],
    agentName: '', agentPhone: '', agentEmail: '',
    tag: '',
  });
  const [files, setFiles] = useState([]);        // File objects
  const [previews, setPreviews] = useState([]);  // Preview URLs
  const [uploadProgress, setUploadProgress] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6); // max 6 images
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
    setUploadProgress(selected.map(() => 0));
  };

  const removeImage = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
    setUploadProgress((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let imageUrls = [];

      // Upload images if any
      if (files.length > 0) {
        imageUrls = await uploadImages(files, (fileIdx, pct) => {
          setUploadProgress((prev) => {
            const next = [...prev];
            next[fileIdx] = pct;
            return next;
          });
        });
      }

      // Determine category from type
      const isRent = form.type.toLowerCase().includes('rent');
      const category = isRent ? 'rent' : 'sale';

      // Save to Firestore
      await addProperty({
        type:        form.type,
        category,
        title:       form.title,
        location:    form.location,
        price:       Number(form.price),
        area:        Number(form.area),
        bedrooms:    form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms:   form.bathrooms ? Number(form.bathrooms) : null,
        parking:     form.parking  ? Number(form.parking)  : null,
        description: form.description,
        amenities:   form.amenities,
        tag:         form.tag || null,
        image:       imageUrls[0] || '',
        images:      imageUrls,
        agent: {
          name:  form.agentName,
          phone: form.agentPhone,
          email: form.agentEmail,
          image: '',
        },
        postedDate: 'Just now',
        featured:   false,
        verified:   false,
        status:     'pending',   // admin must approve
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please check your Firebase config and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success Screen ────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="card p-12 text-center max-w-md mx-auto">
          <CheckCircle size={64} className="text-primary-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Property Submitted! 🎉</h2>
          <p className="text-gray-500 mb-2">
            Your listing has been sent for review.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Our team will verify and publish it within 24 hours.
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
          <p className="text-white/60">List your property for free — reach thousands of buyers & renters</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-20 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            {[
              { n: 1, label: 'Property Type' },
              { n: 2, label: 'Details & Photos' },
              { n: 3, label: 'Contact Info' },
            ].map(({ n, label }) => (
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

          {/* ── Step 1: Property Type ── */}
          {step === 1 && (
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">What type of property are you listing?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {propertyTypes.map(({ id, label, icon: Icon }) => (
                  <button key={id} type="button" onClick={() => setForm({ ...form, type: id })}
                    className={`p-5 border-2 rounded-2xl text-center transition-all ${
                      form.type === id
                        ? 'border-primary-700 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                      form.type === id ? 'bg-primary-700' : 'bg-gray-100'
                    }`}>
                      <Icon size={20} className={form.type === id ? 'text-white' : 'text-gray-600'} />
                    </div>
                    <span className="text-sm font-semibold">{label}</span>
                  </button>
                ))}
              </div>
              <button type="button" disabled={!form.type} onClick={() => setStep(2)}
                className="w-full py-4 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors disabled:opacity-40">
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Details & Photos ── */}
          {step === 2 && (
            <div className="card p-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Property Details</h2>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Property Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. Luxury 3BHK Villa with Swimming Pool"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Location *</label>
                  <select name="location" value={form.location} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                    <option value="">Select Location</option>
                    {locations.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required
                    placeholder="e.g. 5000000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Area (sq.ft) *</label>
                  <input name="area" type="number" value={form.area} onChange={handleChange} required
                    placeholder="e.g. 2000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Bedrooms</label>
                  <select name="bedrooms" value={form.bedrooms} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                    <option value="">N/A</option>
                    {[1,2,3,4,5,6,7].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Bathrooms</label>
                  <select name="bathrooms" value={form.bathrooms} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                    <option value="">N/A</option>
                    {[1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Parking Spaces</label>
                  <select name="parking" value={form.parking} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                    <option value="">N/A</option>
                    {[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required
                  placeholder="Describe your property in detail — location benefits, nearby amenities, unique features..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 resize-none" />
              </div>

              {/* Amenities */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenitiesOptions.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.amenities.includes(a)
                          ? 'bg-primary-700 border-primary-700 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Listing Tag (optional)</label>
                <select name="tag" value={form.tag} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
                  <option value="">No Tag</option>
                  <option>New</option>
                  <option>Hot Deal</option>
                  <option>Popular</option>
                  <option>Premium</option>
                  <option>Featured</option>
                </select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Property Photos (up to 6) — Saved to Firebase Storage
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-primary-300 transition-colors cursor-pointer bg-gray-50">
                  <Upload size={32} className="text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm text-center">
                    Click to upload photos<br/>
                    <span className="text-xs text-gray-400">JPG, PNG up to 10MB each</span>
                  </p>
                  <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                </label>

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {previews.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {uploadProgress[i] > 0 && uploadProgress[i] < 100 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{uploadProgress[i]}%</span>
                          </div>
                        )}
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-sm">
                  ← Back
                </button>
                <button type="button" disabled={!form.title || !form.location || !form.price || !form.area}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors text-sm disabled:opacity-40">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Contact ── */}
          {step === 3 && (
            <div className="card p-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Your Contact Details</h2>
              <p className="text-gray-500 text-sm">Buyers & renters will contact you directly through these details.</p>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Your Name *</label>
                <input name="agentName" value={form.agentName} onChange={handleChange} required
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Phone Number *</label>
                <input name="agentPhone" type="tel" value={form.agentPhone} onChange={handleChange} required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email Address</label>
                <input name="agentEmail" type="email" value={form.agentEmail} onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500" />
              </div>

              {/* Summary */}
              <div className="bg-primary-50 rounded-xl p-4 text-sm space-y-1">
                <p className="font-bold text-gray-900 mb-2">📋 Listing Summary</p>
                <p className="text-gray-600"><strong>Type:</strong> {form.type}</p>
                <p className="text-gray-600"><strong>Title:</strong> {form.title}</p>
                <p className="text-gray-600"><strong>Location:</strong> {form.location}</p>
                <p className="text-gray-600"><strong>Price:</strong> ₹{Number(form.price || 0).toLocaleString()}</p>
                <p className="text-gray-600"><strong>Photos:</strong> {files.length} selected</p>
                <p className="text-orange-600 text-xs mt-2">
                  ⚠️ Your listing will be reviewed by admin before going live.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(2)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-sm">
                  ← Back
                </button>
                <button type="submit" disabled={!form.agentName || !form.agentPhone || submitting}
                  className="flex-1 py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors text-sm disabled:opacity-70 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Uploading & Saving...</> : '🎉 Submit Property Free'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
