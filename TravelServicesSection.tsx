import React from 'react';
import {
  Plane,
  Bus,
  Car,
  Building2,
  TramFront,
  Train,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { TravelCategory } from '../../types/travel';

interface TravelServicesSectionProps {
  onSelectCategory: (cat: TravelCategory) => void;
}

export const TravelServicesSection: React.FC<TravelServicesSectionProps> = ({ onSelectCategory }) => {
  const services = [
    {
      id: 'flight' as TravelCategory,
      title: 'Domestic Flights',
      tagline: 'Fastest Connections Across Major Hubs',
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      sampleRoutes: 'Chennai, Delhi, Mumbai, Bengaluru, Goa',
      sampleFare: 'Starting ₹2,890',
      icon: Plane,
      badge: 'Airbus & Boeing Fleets',
    },
    {
      id: 'bus' as TravelCategory,
      title: 'Intercity Buses & Sleepers',
      tagline: 'Multi-Axle AC Sleeper & Semi-Sleeper Coaches',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      sampleRoutes: 'Chennai, Madurai, Coimbatore, Bengaluru, Ooty',
      sampleFare: 'Starting ₹450',
      icon: Bus,
      badge: '2+1 Luxury Sleeper',
    },
    {
      id: 'cab' as TravelCategory,
      title: 'Cabs & Outstation Taxis',
      tagline: 'Airport Transfers & Hill Station Roadtrips',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      sampleRoutes: 'Sedan, SUV Innova, Hatchback & Prime',
      sampleFare: 'Starting ₹11 / km',
      icon: Car,
      badge: 'Top-Rated Drivers',
    },
    {
      id: 'hotel' as TravelCategory,
      title: 'Hotels & Hill Resorts',
      tagline: 'Handpicked Resorts, Tea Villas & Beach Suites',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      sampleRoutes: 'Ooty, Kodaikanal, Goa, Kerala, Jaipur',
      sampleFare: 'Starting ₹3,500 / night',
      icon: Building2,
      badge: 'Free Breakfast & Wi-Fi',
    },
    {
      id: 'metro' as TravelCategory,
      title: 'Metro Rail QR Tokens',
      tagline: 'Hassle-Free City Rapid Transit Corridors',
      imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      sampleRoutes: 'Chennai CMRL (Blue & Green) & Namma Metro',
      sampleFare: 'Tokens from ₹10',
      icon: TramFront,
      badge: 'Every 4-7 Mins',
    },
    {
      id: 'train' as TravelCategory,
      title: 'Vande Bharat & Express Trains',
      tagline: 'Confirmed Berths & Superfast Comfort',
      imageUrl: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80',
      sampleRoutes: 'Vande Bharat, Tejas, Tamil Nadu Express',
      sampleFare: 'Starting ₹195',
      icon: Train,
      badge: 'AC Chair & Sleeper',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-teal-400 text-xs font-bold uppercase tracking-wider block mb-1">
            Complete Mobility Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Popular Travel Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            EnjoyJourney integrates all 6 major travel modes in one seamless platform with verified seat maps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:border-teal-500/50 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-teal-300 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-teal-400" />
                    <span>{item.badge}</span>
                  </div>
                  <div className="absolute bottom-2.5 left-3">
                    <h3 className="text-lg font-black text-white drop-shadow-md">{item.title}</h3>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-300 font-medium">{item.tagline}</p>
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Popular Routes:</strong> {item.sampleRoutes}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-slate-700/70 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 font-mono">{item.sampleFare}</span>
                <button
                  type="button"
                  onClick={() => onSelectCategory(item.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Search &amp; Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
