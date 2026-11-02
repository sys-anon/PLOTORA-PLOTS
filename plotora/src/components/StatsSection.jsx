import { useNavigate } from 'react-router-dom';
import { Building2, Users, MapPin, Award } from 'lucide-react';
import { stats } from '../data/properties';

const iconMap = { Building2, Users, MapPin, Award };

export default function StatsSection() {
  const navigate = useNavigate();

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d2b1d 0%, #1a3a28 60%, #0d2b1d 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - text */}
          <div>
            <p className="text-[#22c55e] font-semibold text-sm uppercase tracking-widest mb-3">
              Why Choose Plotora
            </p>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Your Property Journey{' '}
              <span className="text-[#d4a017] italic">Starts Here...</span>
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              We connect buyers, sellers, and renters with verified, trusted listings
              across Kerala. With dedicated support and a seamless experience, finding
              your perfect property has never been easier.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/properties')}
                className="px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-full transition-colors shadow-lg"
              >
                Explore Properties
              </button>
              <button
                onClick={() => navigate('/post-property')}
                className="px-6 py-3 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                Post Property Free
              </button>
            </div>
          </div>

          {/* Right - stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = iconMap[stat.icon];
              return (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#22c55e]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    {Icon && <Icon size={24} className="text-[#22c55e]" />}
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

