import React, { useState } from 'react';
import { Bus, Clock, Star, ShieldCheck, Ticket, Users, ArrowRight, X, Wifi, BatteryCharging, ShieldAlert } from 'lucide-react';
import { BusItem } from '../../types/travel';

interface BusBookingViewProps {
  buses: BusItem[];
  searchParams: any;
  onInitiateBooking: (bus: BusItem, selectedSeats: string[], totalBase: number) => void;
}

export const BusBookingView: React.FC<BusBookingViewProps> = ({
  buses,
  searchParams,
  onInitiateBooking,
}) => {
  const [activeSeatModal, setActiveSeatModal] = useState<BusItem | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeDeck, setActiveDeck] = useState<'Lower' | 'Upper'>('Lower');

  const passengerCount = Number(searchParams?.passengers) || 1;

  const handleSeatToggle = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= passengerCount) {
        setSelectedSeats([...selectedSeats.slice(1), seatId]);
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleConfirmSeatsAndProceed = (bus: BusItem) => {
    const totalBase = bus.pricePerSeat * passengerCount;
    onInitiateBooking(bus, selectedSeats, totalBase);
    setActiveSeatModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Bus className="w-4 h-4" />
            <span>Bus Search Results</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {searchParams.from || 'Chennai'} &rarr; {searchParams.to || 'Madurai'}
          </h2>
          <p className="text-xs text-slate-400">
            {searchParams.date || 'Flexible Date'} &bull; {passengerCount} Passenger(s)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700">
            {buses.length} Buses Available
          </span>
        </div>
      </div>

      {/* Bus Cards List */}
      <div className="space-y-4">
        {buses.map((bus) => {
          const availableSeatsCount = bus.totalSeats - bus.bookedSeats.length;

          return (
            <div
              key={bus.id}
              className="bg-slate-800/90 border border-slate-700/90 hover:border-teal-500/50 rounded-2xl p-5 shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Operator info */}
                <div className="flex items-start gap-4 min-w-[260px]">
                  <img
                    src={bus.imageUrl}
                    alt={bus.operator}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{bus.operator}</h3>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{bus.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs text-teal-400 font-semibold block mt-0.5">{bus.busType}</span>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {bus.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timing & Route */}
                <div className="flex-1 flex items-center justify-between max-w-md">
                  <div className="text-left">
                    <span className="text-xl font-black text-white block">{bus.departureTime}</span>
                    <span className="text-xs font-semibold text-teal-400">{bus.fromCity}</span>
                  </div>

                  <div className="flex-1 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-teal-400" />
                      <span>{bus.duration}</span>
                    </div>
                    <div className="relative my-1">
                      <div className="h-0.5 bg-slate-700 w-full" />
                      <Bus className="w-3.5 h-3.5 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-0.5" />
                    </div>
                    <span className="text-[10px] text-slate-400">Overnight Sleeper</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-white block">{bus.arrivalTime}</span>
                    <span className="text-xs font-semibold text-teal-400">{bus.toCity}</span>
                  </div>
                </div>

                {/* Fare & Select Seats Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 min-w-[180px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-700">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Seat from</span>
                    <span className="text-2xl font-black text-white">₹{bus.pricePerSeat}</span>
                    <span className="text-[11px] text-emerald-400 block font-medium">
                      {availableSeatsCount} seats available
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSeatModal(bus);
                      setSelectedSeats(bus.bookedSeats.includes('L1') ? [] : ['L1']);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Ticket className="w-4 h-4 text-slate-950" />
                    <span>Select Berths &amp; Book</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive 2D Sleeper Bus Berth Selector Modal */}
      {activeSeatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveSeatModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 text-left">
              <div className="inline-flex items-center gap-1 text-teal-400 text-xs font-bold uppercase">
                <Bus className="w-3.5 h-3.5" />
                <span>2D Interactive Sleeper Berth Map</span>
              </div>
              <h3 className="text-lg font-black text-white">{activeSeatModal.operator}</h3>
              <p className="text-xs text-slate-400">
                Please pick <strong className="text-white">{passengerCount}</strong> berth(s).
                Selected: <strong className="text-teal-400 font-mono">{selectedSeats.join(', ') || 'None'}</strong>
              </p>
            </div>

            {/* Deck Toggle: Lower Deck vs Upper Deck */}
            <div className="flex gap-2 p-1 bg-slate-800 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveDeck('Lower')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeDeck === 'Lower' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Lower Deck (L1 - L15)
              </button>
              <button
                type="button"
                onClick={() => setActiveDeck('Upper')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeDeck === 'Upper' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Upper Deck (U1 - U15)
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-slate-800 border border-slate-600" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-teal-500 text-slate-950 font-bold" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-slate-700/40 border border-slate-700 text-slate-600" />
                <span>Booked</span>
              </div>
            </div>

            {/* Bus Coach Outline */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 max-w-sm mx-auto shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-4 px-2">
                <span>Driver Cabin &bull; Entry</span>
                <span>{activeDeck} Deck</span>
              </div>

              {/* 5 Rows of Sleeper Berths (Single Window on Left, Double Berth on Right) */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rowIdx) => {
                  const prefix = activeDeck === 'Lower' ? 'L' : 'U';
                  const singleSeat = `${prefix}${rowIdx * 3 - 2}`;
                  const doubleSeat1 = `${prefix}${rowIdx * 3 - 1}`;
                  const doubleSeat2 = `${prefix}${rowIdx * 3}`;

                  const isBookedSingle = activeSeatModal.bookedSeats.includes(singleSeat);
                  const isSelectedSingle = selectedSeats.includes(singleSeat);

                  const isBookedD1 = activeSeatModal.bookedSeats.includes(doubleSeat1);
                  const isSelectedD1 = selectedSeats.includes(doubleSeat1);

                  const isBookedD2 = activeSeatModal.bookedSeats.includes(doubleSeat2);
                  const isSelectedD2 = selectedSeats.includes(doubleSeat2);

                  return (
                    <div key={rowIdx} className="flex items-center justify-between gap-3">
                      {/* Left: Single Window Sleeper */}
                      <button
                        type="button"
                        disabled={isBookedSingle}
                        onClick={() => handleSeatToggle(singleSeat, isBookedSingle)}
                        className={`w-14 h-10 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                          isSelectedSingle
                            ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 shadow-md'
                            : isBookedSingle
                            ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                            : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-teal-500 hover:text-slate-950'
                        }`}
                        title={`${singleSeat} (Single Window Berth)`}
                      >
                        <span>{singleSeat}</span>
                        <span className="text-[8px] opacity-75">Window</span>
                      </button>

                      {/* Aisle Space */}
                      <span className="text-[10px] text-slate-600 font-mono font-semibold">Row {rowIdx}</span>

                      {/* Right: Double Berth */}
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          disabled={isBookedD1}
                          onClick={() => handleSeatToggle(doubleSeat1, isBookedD1)}
                          className={`w-12 h-10 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                            isSelectedD1
                              ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 shadow-md'
                              : isBookedD1
                              ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                              : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-teal-500 hover:text-slate-950'
                          }`}
                          title={`${doubleSeat1} (Aisle Berth)`}
                        >
                          <span>{doubleSeat1}</span>
                          <span className="text-[8px] opacity-75">Aisle</span>
                        </button>

                        <button
                          type="button"
                          disabled={isBookedD2}
                          onClick={() => handleSeatToggle(doubleSeat2, isBookedD2)}
                          className={`w-12 h-10 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                            isSelectedD2
                              ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 shadow-md'
                              : isBookedD2
                              ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                              : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-teal-500 hover:text-slate-950'
                          }`}
                          title={`${doubleSeat2} (Window Berth)`}
                        >
                          <span>{doubleSeat2}</span>
                          <span className="text-[8px] opacity-75">Window</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Base Fare:</span>
                <span className="text-lg font-black text-white">
                  ₹{(activeSeatModal.pricePerSeat * passengerCount).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleConfirmSeatsAndProceed(activeSeatModal)}
                disabled={selectedSeats.length !== passengerCount}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                Proceed to Checkout ({selectedSeats.length}/{passengerCount} Berths)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
