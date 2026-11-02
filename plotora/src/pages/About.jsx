import { Target, Eye, Heart, Award, Users, Building2, MapPin } from 'lucide-react';
import { stats } from '../data/properties';

const iconMap = { Building2, Users, MapPin, Award };

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To make property buying, selling and renting transparent, simple and accessible for everyone across Kerala.' },
  { icon: Eye, title: 'Our Vision', desc: 'To become the most trusted digital property marketplace in South India, with a focus on verified listings and customer satisfaction.' },
  { icon: Heart, title: 'Our Values', desc: 'Integrity, transparency, customer-first approach, and innovation drive everything we do at Plotora.' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-[#0d2b1d] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#22c55e] font-semibold text-sm uppercase tracking-widest mb-3">About Plotora</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Your Trusted Property Partner
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Founded with the vision of making real estate accessible and transparent,
            Plotora has grown to become Kerala's most trusted property marketplace.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-700 font-semibold text-sm uppercase tracking-widest mb-2">Our Story</p>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Built for the People of Kerala
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Plotora was born out of a simple frustration — finding a reliable property
                in Kerala was unnecessarily complicated. We set out to change that by creating
                a platform where every listing is verified, every agent is vetted, and every
                transaction is transparent.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, with over 5,000 active listings and 12,000+ satisfied clients, we are
                proud to be the go-to property marketplace for buyers, sellers, and renters
                across 50+ cities in Kerala and beyond.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-black text-primary-700">10+</div>
                  <div className="text-gray-500 text-sm">Years of Trust</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary-700">50+</div>
                  <div className="text-gray-500 text-sm">Cities</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary-700">99%</div>
                  <div className="text-gray-500 text-sm">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80"
                alt="Office"
                className="rounded-2xl object-cover h-48 w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"
                alt="Building"
                className="rounded-2xl object-cover h-48 w-full mt-6"
              />
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"
                alt="Home"
                className="rounded-2xl object-cover h-48 w-full -mt-6"
              />
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"
                alt="Land"
                className="rounded-2xl object-cover h-48 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="card p-8 text-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-primary-50 group-hover:bg-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Icon size={26} className="text-primary-700 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#0d2b1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = iconMap[stat.icon];
              return (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    {Icon && <Icon size={22} className="text-[#22c55e]" />}
                  </div>
                  <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team section removed */}
    </div>
  );
}

