import React from 'react';
import { MapPin, ArrowUpRight, Compass } from 'lucide-react';
import { PopularDestination, TravelCategory } from '../../types/travel';

interface PopularDestinationsProps {
  destinations: PopularDestination[];
  onSelectDestination: (dest: PopularDestination) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  onSelectDestination,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Discover India</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Popular Places to Explore
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Handpicked hill stations, temples, backwaters, historic forts, and beach paradises with sample routes.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-medium bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          12 Featured Destinations
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="group bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-teal-500/50 transition-all duration-200 flex flex-col"
          >
            {/* Destination Image with Badge */}
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] font-bold text-teal-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" />
                <span>{dest.state}</span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3">
                <h3 className="text-lg font-black text-white tracking-tight leading-none drop-shadow-md">
                  {dest.name}
                </h3>
                <span className="text-[11px] text-teal-300 font-medium drop-shadow">{dest.tagline}</span>
              </div>
            </div>

            {/* Description & Action */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {dest.description}
              </p>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {dest.category}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectDestination(dest)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Explore & Book</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
