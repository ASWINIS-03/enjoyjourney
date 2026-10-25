import React from 'react';
import { Compass, ShieldCheck, Ticket, Award, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { TravelCategory } from '../../types/travel';

interface LandingHeroProps {
  onSelectCategory: (cat: TravelCategory) => void;
  onExploreOffers: () => void;
  onOpenDashboard?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectCategory,
  onExploreOffers,
  onOpenDashboard,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 min-h-[380px] sm:min-h-[440px] flex items-center">
        {/* Background Photo with Gradient Overlays */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
          alt="EnjoyJourney Scenic Destinations"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-12 py-10 max-w-2xl text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Welcome to EnjoyJourney &bull; BCA College Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            Explore More. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">
              Travel Better.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
            Your all-in-one domestic travel booking system. Seamlessly search, select seats, and book{' '}
            <span className="text-white font-semibold">Flights, Buses, Cabs, Hotels, Metro Rail, and Trains</span> with
            exclusive concessions for Senior Citizens, Doctors, Students, and Defence Heroes.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectCategory('flight')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Book Flight or Train</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white border border-teal-500/30 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <LayoutDashboard className="w-4 h-4 text-teal-400" />
                <span>My Dashboard</span>
              </button>
            )}
            <button
              type="button"
              onClick={onExploreOffers}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Special Discounts</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-700/60 text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-[11px] font-medium leading-tight">Interactive Seat Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-[11px] font-medium leading-tight">No Double Booking Lock</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-[11px] font-medium leading-tight">Real In-App Notifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
