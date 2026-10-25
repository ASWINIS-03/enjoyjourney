import React from 'react';
import { Car, Users, Briefcase, Star, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { CabItem } from '../../types/travel';

interface CabBookingViewProps {
  cabs: CabItem[];
  searchParams: any;
  onInitiateBooking: (cab: CabItem, totalBase: number) => void;
}

export const CabBookingView: React.FC<CabBookingViewProps> = ({
  cabs,
  searchParams,
  onInitiateBooking,
}) => {
  const pickup = searchParams.pickup || 'Chennai Airport (MAA)';
  const drop = searchParams.drop || 'OMR IT Corridor, Chennai';
  const tripType = searchParams.tripType || 'One Way';
  const passengers = Number(searchParams.passengers) || 2;

  // Estimate distance (demo standard 35 km)
  const estimatedKm = 35;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Car className="w-4 h-4" />
            <span>Cab &amp; Taxi Booking</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {pickup} &rarr; {drop}
          </h2>
          <p className="text-xs text-slate-400">
            {searchParams.date || 'Today'} at {searchParams.time || '10:00 AM'} &bull; {tripType} &bull; Approx. ~{estimatedKm} km
          </p>
        </div>

        <span className="text-xs text-slate-300 font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700">
          {cabs.length} Cab Categories
        </span>
      </div>

      {/* Cab Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cabs.map((cab) => {
          // Estimated fare formula
          const multiplier = tripType === 'Round Trip' ? 1.8 : 1.0;
          const calculatedBase = Math.round((cab.baseFare + cab.perKmRate * estimatedKm) * multiplier);

          return (
            <div
              key={cab.id}
              className="bg-slate-800/90 border border-slate-700/90 hover:border-teal-500/50 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold uppercase tracking-wider">
                      {cab.cabType}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">{cab.modelName}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{cab.rating}</span>
                      <span className="text-slate-400">(Top Rated Chauffeurs)</span>
                    </div>
                  </div>

                  <img
                    src={cab.imageUrl}
                    alt={cab.modelName}
                    className="w-24 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                  />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-700/70 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Up to {cab.capacity} Seats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{cab.luggageCapacity} Bags</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>AC Clean Cab</span>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="py-2.5 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Base Fare (First 5 km included)</span>
                    <span>₹{cab.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per Km Rate thereafter</span>
                    <span>₹{cab.perKmRate} / km</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-3 border-t border-slate-700/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Estimated Fare:</span>
                  <span className="text-2xl font-black text-white">₹{calculatedBase.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onInitiateBooking(cab, calculatedBase)}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Car className="w-4 h-4 text-slate-950" />
                  <span>Book {cab.cabType}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
