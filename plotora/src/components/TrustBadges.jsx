import { ShieldCheck, Handshake, Zap, Headphones } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Trusted Platform',
    subtitle: '100% Secure',
    color: 'text-primary-700',
    bg: 'bg-primary-50',
  },
  {
    icon: Handshake,
    title: 'Verified Listings',
    subtitle: 'Real Properties',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Quick & Easy',
    subtitle: 'List in Minutes',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    subtitle: 'Always Here',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-10 bg-[#0d2b1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-6 py-4 group cursor-default"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={20} className={b.color} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{b.title}</p>
                  <p className="text-white/60 text-xs">{b.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

