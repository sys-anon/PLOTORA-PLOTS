import { useNavigate } from 'react-router-dom';
import { agents } from '../data/properties';
import { Phone, Mail, Building2 } from 'lucide-react';

export default function AgentsSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-widest mb-2">
            Our Team
          </p>
          <h2 className="section-title">Meet Our Expert Agents</h2>
          <p className="section-subtitle">Dedicated professionals ready to help you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="card text-center p-6 group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative inline-block mb-4">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 group-hover:border-primary-400 transition-colors"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">{agent.name}</h3>
              <p className="text-primary-700 text-xs font-semibold mb-1">{agent.role}</p>
              <p className="text-gray-400 text-xs mb-3">{agent.specialization}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                <Building2 size={12} className="text-primary-700" />
                <span>{agent.listings} listings • {agent.experience} exp.</span>
              </div>
              <div className="flex gap-2 justify-center">
                <a
                  href={`tel:${agent.phone}`}
                  className="w-9 h-9 bg-primary-50 hover:bg-primary-700 text-primary-700 hover:text-white rounded-full flex items-center justify-center transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone size={15} />
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="w-9 h-9 bg-primary-50 hover:bg-primary-700 text-primary-700 hover:text-white rounded-full flex items-center justify-center transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

