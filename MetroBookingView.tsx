import React from 'react';
import { TramFront, Clock, MapPin, QrCode, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { MetroItem } from '../../types/travel';

interface MetroBookingViewProps {
  metroLines: MetroItem[];
  searchParams: any;
  onInitiateBooking: (line: MetroItem, ticketType: string, totalBase: number) => void;
}

export const MetroBookingView: React.FC<MetroBookingViewProps> = ({
  metroLines,
  searchParams,
  onInitiateBooking,
}) => {
  const city = searchParams.city || 'Chennai';
  const fromStation = searchParams.fromStation || 'Chennai Central';
  const toStation = searchParams.toStation || 'Chennai International Airport';
  const passengers = Number(searchParams.passengers) || 1;
  const farePerPassenger = 40; // Standard metro fare
  const totalBase = farePerPassenger * passengers;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <TramFront className="w-4 h-4" />
            <span>Metro Rail Ticket Booking</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {fromStation} &rarr; {toStation}
          </h2>
          <p className="text-xs text-slate-400">
            {city} Metro Rail &bull; {passengers} QR Ticket(s) &bull; Trains run every 4-7 minutes
          </p>
        </div>

        <span className="text-xs text-slate-300 font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700">
          Instant QR Token Ticket
        </span>
      </div>

      {/* Metro Lines Info */}
      <div className="space-y-4">
        {metroLines.map((line) => (
          <div
            key={line.id}
            className="bg-slate-800/90 border border-slate-700/90 hover:border-teal-500/50 rounded-2xl p-5 shadow-lg transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Line Branding */}
              <div className="flex items-start gap-4 min-w-[260px]">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md font-black"
                  style={{ backgroundColor: line.lineColor }}
                >
                  <TramFront className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{line.systemName}</h3>
                  <span className="text-xs font-bold text-teal-300 block">{line.lineName}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>Every {line.frequencyMinutes} Mins ({line.operatingHours})</span>
                  </div>
                </div>
              </div>

              {/* Station Route Preview */}
              <div className="flex-1 max-w-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Key Corridor Stations ({line.stations.length} Stops):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {line.stations.slice(0, 5).map((st, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300"
                    >
                      {st}
                    </span>
                  ))}
                  {line.stations.length > 5 && (
                    <span className="text-[10px] text-teal-400 font-semibold">
                      +{line.stations.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 min-w-[160px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-700">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Base Fare:</span>
                  <span className="text-2xl font-black text-white">₹{totalBase}</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">Valid for all day travel</span>
                </div>

                <button
                  type="button"
                  onClick={() => onInitiateBooking(line, 'QR Digital Ticket', totalBase)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-slate-950" />
                  <span>Book QR Ticket</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
