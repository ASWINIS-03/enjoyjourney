import React, { useState, useEffect } from 'react';
import { Plane, Clock, ShieldCheck, Ticket, Users, ArrowRight, Check, X } from 'lucide-react';
import { FlightItem } from '../../types/travel';
import { api } from '../../services/api';

interface FlightBookingViewProps {
  flights: FlightItem[];
  searchParams: any;
  onInitiateBooking: (flight: FlightItem, selectedSeats: string[], travelClass: string, totalBase: number) => void;
}

export const FlightBookingView: React.FC<FlightBookingViewProps> = ({
  flights,
  searchParams,
  onInitiateBooking,
}) => {
  const [selectedFlight, setSelectedFlight] = useState<FlightItem | null>(null);
  const [activeSeatModal, setActiveSeatModal] = useState<FlightItem | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [travelClass, setTravelClass] = useState<'Economy' | 'Business'>(
    (searchParams?.travelClass as 'Economy' | 'Business') || 'Economy'
  );

  const passengerCount = Number(searchParams?.passengers) || 1;

  const handleSeatToggle = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= passengerCount) {
        // replace earliest
        setSelectedSeats([...selectedSeats.slice(1), seatId]);
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleConfirmSeatsAndProceed = (flight: FlightItem) => {
    const seatPrice = travelClass === 'Business' ? flight.priceBusiness : flight.priceEconomy;
    const totalBase = seatPrice * passengerCount;
    onInitiateBooking(flight, selectedSeats, travelClass, totalBase);
    setActiveSeatModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Plane className="w-4 h-4" />
            <span>Flight Search Results</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {searchParams.from || 'Chennai'} &rarr; {searchParams.to || 'Delhi'}
          </h2>
          <p className="text-xs text-slate-400">
            {searchParams.date || 'Flexible Date'} &bull; {passengerCount} Traveler(s) &bull; {travelClass} Class
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700">
            {flights.length} Flights Available
          </span>
        </div>
      </div>

      {/* Flight Cards Grid */}
      <div className="space-y-4">
        {flights.map((flight) => {
          const currentPrice = travelClass === 'Business' ? flight.priceBusiness : flight.priceEconomy;
          const availableSeats = travelClass === 'Business' ? flight.availableSeatsBusiness : flight.availableSeatsEconomy;

          return (
            <div
              key={flight.id}
              className="bg-slate-800/90 border border-slate-700/90 hover:border-teal-500/50 rounded-2xl p-5 shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Airline & Aircraft Details */}
                <div className="flex items-start gap-4 min-w-[240px]">
                  <img
                    src={flight.imageUrl}
                    alt={flight.airline}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-black text-white">{flight.airline}</h3>
                    <span className="text-xs text-teal-400 font-mono font-semibold">{flight.flightNumber}</span>
                    <span className="text-[11px] text-slate-400 block">{flight.aircraftType}</span>
                  </div>
                </div>

                {/* Route & Times */}
                <div className="flex-1 flex items-center justify-between max-w-md">
                  <div className="text-left">
                    <span className="text-xl font-black text-white block">{flight.departureTime}</span>
                    <span className="text-xs font-bold text-teal-400">{flight.fromCode}</span>
                    <span className="text-[11px] text-slate-400 block">{flight.fromCity}</span>
                  </div>

                  <div className="flex-1 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-teal-400" />
                      <span>{flight.duration}</span>
                    </div>
                    <div className="relative my-1">
                      <div className="h-0.5 bg-slate-700 w-full" />
                      <Plane className="w-3.5 h-3.5 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-0.5" />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Non-Stop</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-white block">{flight.arrivalTime}</span>
                    <span className="text-xs font-bold text-teal-400">{flight.toCode}</span>
                    <span className="text-[11px] text-slate-400 block">{flight.toCity}</span>
                  </div>
                </div>

                {/* Price & Book Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 min-w-[180px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-700">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Starting from</span>
                    <span className="text-2xl font-black text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-emerald-400 block font-medium">
                      {availableSeats} seats left in {travelClass}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSeatModal(flight);
                      setSelectedSeats(flight.bookedSeats.includes('3A') ? [] : ['3A']);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Ticket className="w-4 h-4 text-slate-950" />
                    <span>Select Seats &amp; Book</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive 2D Flight Seat Selection Modal */}
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
                <Plane className="w-3.5 h-3.5" />
                <span>Interactive Flight Cabin Map</span>
              </div>
              <h3 className="text-lg font-black text-white">
                {activeSeatModal.airline} &bull; {activeSeatModal.aircraftType}
              </h3>
              <p className="text-xs text-slate-400">
                Please pick <strong className="text-white">{passengerCount}</strong> seat(s).
                Selected: <strong className="text-teal-400 font-mono">{selectedSeats.join(', ') || 'None'}</strong>
              </p>
            </div>

            {/* Travel Class Toggle */}
            <div className="flex gap-2 p-1 bg-slate-800 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTravelClass('Economy')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  travelClass === 'Economy' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Economy (Rows 3-6) &bull; ₹{activeSeatModal.priceEconomy}
              </button>
              <button
                type="button"
                onClick={() => setTravelClass('Business')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  travelClass === 'Business' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300'
                }`}
              >
                Business (Rows 1-2) &bull; ₹{activeSeatModal.priceBusiness}
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

            {/* Airplane Fuselage Layout */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 max-w-sm mx-auto shadow-inner">
              <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-3">
                &uarr; Cockpit / Front &uarr;
              </div>

              {/* Rows 1 to 6 */}
              <div className="space-y-2.5">
                {['1', '2', '3', '4', '5', '6'].map((row) => {
                  const isBusinessRow = row === '1' || row === '2';
                  return (
                    <div key={row} className="flex items-center justify-between gap-1">
                      {/* Left Side: A, B, C */}
                      <div className="flex gap-1.5">
                        {['A', 'B', 'C'].map((col) => {
                          const seatId = `${row}${col}`;
                          const isBooked = activeSeatModal.bookedSeats.includes(seatId);
                          const isSelected = selectedSeats.includes(seatId);

                          return (
                            <button
                              key={seatId}
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSeatToggle(seatId, isBooked)}
                              className={`w-8 h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 shadow-md'
                                  : isBooked
                                  ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                                  : isBusinessRow
                                  ? 'bg-indigo-950 border border-indigo-700/60 text-indigo-300 hover:bg-teal-500 hover:text-slate-950'
                                  : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-teal-500 hover:text-slate-950'
                              }`}
                              title={`Seat ${seatId} (${isBusinessRow ? 'Business' : 'Economy'})`}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle */}
                      <span className="w-6 text-center text-[10px] font-mono text-slate-600 font-bold">
                        {row}
                      </span>

                      {/* Right Side: D, E, F */}
                      <div className="flex gap-1.5">
                        {['D', 'E', 'F'].map((col) => {
                          const seatId = `${row}${col}`;
                          const isBooked = activeSeatModal.bookedSeats.includes(seatId);
                          const isSelected = selectedSeats.includes(seatId);

                          return (
                            <button
                              key={seatId}
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSeatToggle(seatId, isBooked)}
                              className={`w-8 h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 shadow-md'
                                  : isBooked
                                  ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                                  : isBusinessRow
                                  ? 'bg-indigo-950 border border-indigo-700/60 text-indigo-300 hover:bg-teal-500 hover:text-slate-950'
                                  : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-teal-500 hover:text-slate-950'
                              }`}
                              title={`Seat ${seatId} (${isBusinessRow ? 'Business' : 'Economy'})`}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Base Fare:</span>
                <span className="text-lg font-black text-white">
                  ₹{((travelClass === 'Business' ? activeSeatModal.priceBusiness : activeSeatModal.priceEconomy) * passengerCount).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleConfirmSeatsAndProceed(activeSeatModal)}
                disabled={selectedSeats.length !== passengerCount}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                Proceed to Checkout ({selectedSeats.length}/{passengerCount} Seats)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
