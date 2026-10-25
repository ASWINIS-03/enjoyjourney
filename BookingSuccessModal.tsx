import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, Calendar, MapPin, User, Download, Printer, X, Sparkles } from 'lucide-react';
import { Booking } from '../../types/travel';

interface BookingSuccessModalProps {
  booking: Booking;
  onClose: () => void;
  onViewOrders: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  onClose,
  onViewOrders,
}) => {
  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-500/20">
            <CheckCircle2 className="w-8 h-8 text-teal-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Booking Confirmed &amp; Verified</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">EnjoyYour Journey!</h2>
          <p className="text-xs text-slate-400 mt-1">
            Your travel reservation has been saved in the EnjoyJourney database.
          </p>
        </div>

        {/* Digital Boarding Pass / Ticket Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-5 text-xs space-y-3 relative">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Booking ID</span>
              <div className="text-base font-black font-mono text-teal-300 tracking-wider">
                {booking.bookingReference}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold uppercase text-[10px]">
              {booking.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Service</span>
              <span className="font-bold text-white text-xs">{booking.serviceName}</span>
              {booking.serviceNumber && (
                <span className="text-[10px] text-teal-400 block font-mono">({booking.serviceNumber})</span>
              )}
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Date &amp; Time</span>
              <span className="font-semibold text-white">
                {booking.travelDate || booking.checkInDate || 'Confirmed'}
              </span>
              {booking.departureTime && (
                <span className="text-[10px] text-slate-400 block font-mono">at {booking.departureTime}</span>
              )}
            </div>
          </div>

          {(booking.origin || booking.destination) && (
            <div className="flex items-center gap-2 pt-1 text-slate-200">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-semibold text-xs">
                {booking.origin} &rarr; {booking.destination}
              </span>
            </div>
          )}

          {booking.selectedSeats && booking.selectedSeats.length > 0 && (
            <div className="flex items-center gap-2 text-slate-300">
              <Ticket className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Seats/Berths: <strong className="text-white font-mono">{booking.selectedSeats.join(', ')}</strong>
                {booking.travelClass && ` (${booking.travelClass})`}
              </span>
            </div>
          )}

          {booking.nightsCount && (
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Duration: {booking.nightsCount} Night(s)</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
            <span className="text-[11px] text-slate-400">Total Fare (incl. taxes):</span>
            <span className="text-base font-black text-white">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Voucher</span>
          </button>
          <button
            type="button"
            onClick={onViewOrders}
            className="flex-1 py-2.5 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-slate-950" />
            <span>View My Booking Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};
