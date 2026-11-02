import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, Trash2, Loader2, Eye, RefreshCw } from 'lucide-react';
import { getAllProperties, approveProperty, rejectProperty, deleteProperty, updateProperty } from '../firebase/propertyService';
import { formatPrice } from '../firebase/propertyService';

export default function AdminPanel() {
  const [tab, setTab] = useState('pending');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Simple admin password protection
  const ADMIN_PASS = 'plotora@admin2024'; // Change this to your password

  const fetchProps = async () => {
    setLoading(true);
    try {
      const data = await getAllProperties(tab);
      setProperties(data);
    } catch {
      // also try pending
      try {
        const pending = await getAllProperties('pending');
        setProperties(pending);
      } catch {}
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchProps();
  }, [tab, authenticated]);

  const handleAction = async (id, action, featured = false) => {
    setActionId(id);
    try {
      if (action === 'approve')  await approveProperty(id, featured);
      if (action === 'reject')   await rejectProperty(id);
      if (action === 'delete')   await deleteProperty(id);
      if (action === 'feature')  await updateProperty(id, { featured: true });
      if (action === 'unfeature')await updateProperty(id, { featured: false });
      await fetchProps();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
    setActionId(null);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="card p-10 max-w-sm w-full mx-4 text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Admin Panel</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && password === ADMIN_PASS && setAuthenticated(true)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 mb-4"
          />
          <button
            onClick={() => {
              if (password === ADMIN_PASS) setAuthenticated(true);
              else alert('Wrong password!');
            }}
            className="w-full py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors"
          >
            Login as Admin
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Change password in <code>src/pages/AdminPanel.jsx</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="bg-[#0d2b1d] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-white/60 text-sm">Manage property listings</p>
          </div>
          <button onClick={fetchProps} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {[
            { id: 'pending',  label: '⏳ Pending'  },
            { id: 'approved', label: '✅ Approved' },
            { id: 'rejected', label: '❌ Rejected' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-primary-700 text-white shadow-md' : 'text-gray-600 hover:text-primary-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="text-primary-700 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 font-semibold">No {tab} listings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🏠</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{p.title}</h3>
                        <p className="text-gray-500 text-sm">{p.location} • {p.type}</p>
                        <p className="text-primary-700 font-bold text-sm mt-1">
                          {formatPrice(p.price, p.category)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">By: {p.agent?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{p.agent?.phone}</p>
                        {p.featured && (
                          <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <a href={`/property/${p.id}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                        <Eye size={13} /> View
                      </a>

                      {tab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(p.id, 'approve', false)}
                            disabled={actionId === p.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60">
                            {actionId === p.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={13} />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(p.id, 'approve', true)}
                            disabled={actionId === p.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-60">
                            <Star size={13} /> Approve + Feature
                          </button>
                          <button
                            onClick={() => handleAction(p.id, 'reject')}
                            disabled={actionId === p.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-60">
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}

                      {tab === 'approved' && (
                        <>
                          {p.featured ? (
                            <button onClick={() => handleAction(p.id, 'unfeature')} disabled={actionId === p.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-50 disabled:opacity-60">
                              <Star size={13} /> Remove Featured
                            </button>
                          ) : (
                            <button onClick={() => handleAction(p.id, 'feature')} disabled={actionId === p.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-60">
                              <Star size={13} /> Mark Featured
                            </button>
                          )}
                          <button onClick={() => handleAction(p.id, 'reject')} disabled={actionId === p.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 disabled:opacity-60">
                            <XCircle size={13} /> Unpublish
                          </button>
                        </>
                      )}

                      {tab === 'rejected' && (
                        <button onClick={() => handleAction(p.id, 'approve')} disabled={actionId === p.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60">
                          <CheckCircle size={13} /> Re-Approve
                        </button>
                      )}

                      <button
                        onClick={() => { if (window.confirm('Delete permanently?')) handleAction(p.id, 'delete'); }}
                        disabled={actionId === p.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-60">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

