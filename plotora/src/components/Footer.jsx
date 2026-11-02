import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube,
  Home, Building2, Store, ArrowRight
} from 'lucide-react';

const Logo = () => (
  <div className="flex items-center gap-2 mb-4">
    <svg width="40" height="36" viewBox="0 0 48 42" fill="none">
      <path d="M4 20L24 4L44 20V40H30V28H18V40H4V20Z" fill="#0d2b1d" stroke="#22c55e" strokeWidth="2"/>
      <path d="M8 22L24 8L40 22" fill="none" stroke="#d4a017" strokeWidth="2.5"/>
      <rect x="19" y="28" width="10" height="12" rx="1" fill="#22c55e"/>
      <rect x="8" y="22" width="8" height="7" rx="1" fill="#22c55e" opacity="0.7"/>
      <rect x="32" y="22" width="8" height="7" rx="1" fill="#22c55e" opacity="0.7"/>
    </svg>
    <div>
      <div className="text-xl font-black text-white leading-none">
        PLOT<span className="text-[#d4a017]">O</span>RA
      </div>
      <div className="text-[9px] text-gray-400 tracking-widest uppercase">Modern Property Marketplace</div>
    </div>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#0a1f14] text-gray-300">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">
              Ready to Find Your Dream Property?
            </h3>
            <p className="text-white/80 text-sm">
              Join 12,000+ happy clients who found their perfect property on Plotora.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              to="/browse"
              className="px-6 py-3 bg-white text-primary-700 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm"
            >
              Browse Properties
            </Link>
            <Link
              to="/post-property"
              className="px-6 py-3 bg-[#d4a017] text-white font-bold rounded-full hover:bg-[#b8860b] transition-colors text-sm"
            >
              Post Property
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Logo />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Plotora is Kerala's most trusted property marketplace, connecting buyers,
              sellers, and renters with verified listings and dedicated support.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Properties', to: '/browse' },
                { label: 'Sell Property', to: '/sell' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Blog', to: '/blog' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-[#22c55e] text-sm flex items-center gap-1.5 transition-colors group"
                  >
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Property Types</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Houses for Sale',    icon: Home,      to: '/properties?type=houses-sale'     },
                { label: 'Land & Plots',       icon: MapPin,    to: '/properties?type=land-plots'      },
                { label: 'Buildings for Sale', icon: Building2, to: '/properties?type=buildings-sale'  },
                { label: 'Shops & Commercial', icon: Store,     to: '/properties?type=shops-commercial'},
              ].map(({ label, icon: Icon, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-[#22c55e] text-sm flex items-center gap-1.5 transition-colors group"
                  >
                    <Icon size={12} className="text-primary-600" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={15} className="text-[#22c55e]" />
                </div>
                <div className="text-gray-400 text-sm leading-relaxed">
                  123 MG Road, Kozhikode,<br />Kerala – 673001, India
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-[#22c55e]" />
                </div>
                <a href="tel:+918943746079" className="text-gray-400 hover:text-[#22c55e] text-sm transition-colors">
                  +91 8943746079
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-[#22c55e]" />
                </div>
                <a href="mailto:ajayrajurajcp@gmail.com" className="text-gray-400 hover:text-[#22c55e] text-sm transition-colors">
                  ajayrajurajcp@gmail.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-white text-sm font-semibold mb-2">Get Property Alerts</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email..."
                  className="flex-1 bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 rounded-l-lg outline-none placeholder-gray-500 focus:border-primary-500"
                />
                <button className="px-4 bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold rounded-r-lg transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Plotora. All rights reserved. Your Local Property Partner.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

