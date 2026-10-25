import React, { useState, useEffect } from 'react';
import {
  TicketCheck,
  Calendar,
  MapPin,
  Clock,
  Printer,
  XCircle,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Building2,
  Plane,
  Bus,
  Car,
  TramFront,
  Train,
} from 'lucide-react';
import { Booking, TravelCategory } from '../types/travel';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const [activeTicketModal, setActiveTicketModal] = useState<Booking | null>(null);
  const [activeCancelModal, setActiveCancelModal] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Change of travel plan');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const { refreshNotifications } = useNotifications();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!activeCancelModal) return;
    setActionLoading(true);
    setActionMessage('');
    try {
      const res = await api.cancelBooking(activeCancelModal.id, cancellationReason);
      setActionMessage(res.message);
      await refreshNotifications();
      await fetchBookings();
      setTimeout(() => {
        setActiveCancelModal(null);
        setActionMessage('');
      }, 1200);
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (selectedFilter === 'all') return true;
    return b.category === selectedFilter;
  });

  const getCategoryIcon = (cat: TravelCategory) => {
    switch (cat) {
      case 'flight':
        return Plane;
      case 'bus':
        return Bus;
      case 'cab':
        return Car;
      case 'hotel':
        return Building2;
      case 'metro':
        return TramFront;
      case 'train':
        return Train;
      default:
        return TicketCheck;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TicketCheck className="w-4 h-4" />
            <span>Booking Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">My Booking Orders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your confirmed itineraries, download formatted travel vouchers, or manage cancellations.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'flight', label: 'Flights' },
            { id: 'bus', label: 'Buses' },
            { id: 'cab', label: 'Cabs' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'metro', label: 'Metro' },
            { id: 'train', label: 'Trains' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List or Empty State */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading your travel reservations...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
          <TicketCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
            You don't have any {selectedFilter !== 'all' ? selectedFilter : ''} bookings yet. Browse flights, buses, hotels, or trains to make your first reservation!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const Icon = getCategoryIcon(b.category);
            const isCancelled = b.status === 'Cancelled';

            return (
              <div
                key={b.id}
                className={`bg-slate-800/90 border rounded-2xl p-5 shadow-lg transition-all ${
                  isCancelled ? 'border-rose-900/50 opacity-80' : 'border-slate-700/80 hover:border-teal-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Category & Service Details */}
                  <div className="flex items-start gap-4 min-w-[280px]">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCancelled ? 'bg-rose-500/10 text-rose-400' : 'bg-teal-500/10 text-teal-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {b.bookingReference}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white mt-1">{b.serviceName}</h3>

                      {(b.origin || b.destination) && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>
                            {b.origin} &rarr; {b.destination}
                          </span>
                        </div>
                      )}

                      <span className="text-[11px] text-slate-400 block mt-1">
                        Booked on {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Travel Date & Passengers */}
                  <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs max-w-sm">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Journey / Stay Date</span>
                      <span className="font-bold text-white">
                        {b.travelDate || b.checkInDate || 'Flexible'}
                      </span>
                      {b.departureTime && (
                        <span className="text-[10px] text-slate-400 block">at {b.departureTime}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Quantity</span>
                      <span className="font-bold text-white">
                        {b.passengersCount} {b.category === 'hotel' ? 'Room(s)' : 'Traveler(s)'}
                      </span>
                      {b.selectedSeats && b.selectedSeats.length > 0 && (
                        <span className="text-[10px] text-teal-300 block font-mono">
                          Seats: {b.selectedSeats.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-700">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Paid</span>
                      <span className="text-xl font-black text-white">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </span>
                      {b.discountAmount > 0 && (
                        <span className="text-[10px] text-emerald-400 block">
                          Saved ₹{b.discountAmount.toLocaleString('en-IN')} ({b.discountCode})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTicketModal(b)}
                        className="px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Voucher</span>
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setActiveCancelModal(b)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TICKET DETAILS MODAL */}
      {activeTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-100">
            <button
              type="button"
              onClick={() => setActiveTicketModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-5 border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block mb-1">
                EnjoyJourney Official Travel Voucher
              </span>
              <h2 className="text-xl font-black text-white">{activeTicketModal.serviceName}</h2>
              <div className="text-xs font-mono font-bold text-teal-300 mt-1">
                Reference: {activeTicketModal.bookingReference}
              </div>
            </div>

            {/* Ticket Contents */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Traveler / Guest</span>
                  <span className="font-bold text-white">{activeTicketModal.userName}</span>
                  <span className="text-[10px] text-slate-400 block">{activeTicketModal.userEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Contact Mobile</span>
                  <span className="font-bold text-white">{activeTicketModal.userMobile}</span>
                  <span className="text-[10px] text-teal-400 block font-semibold">Verified Member</span>
                </div>
              </div>

              {(activeTicketModal.origin || activeTicketModal.destination) && (
                <div className="p-3 bg-slate-800/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Sector</span>
                  <div className="text-sm font-bold text-white">
                    {activeTicketModal.origin} &rarr; {activeTicketModal.destination}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Date &amp; Time</span>
                  <span className="font-bold text-white">
                    {activeTicketModal.travelDate || activeTicketModal.checkInDate}
                  </span>
                  {activeTicketModal.departureTime && (
                    <span className="text-[10px] text-slate-400 block">at {activeTicketModal.departureTime}</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Quantity &amp; Seats</span>
                  <span className="font-bold text-white">{activeTicketModal.passengersCount} Ticket(s)</span>
                  {activeTicketModal.selectedSeats && (
                    <span className="text-[10px] text-teal-300 font-mono block">
                      Seats: {activeTicketModal.selectedSeats.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Price Details */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Base Amount</span>
                  <span>₹{activeTicketModal.baseAmount.toLocaleString('en-IN')}</span>
                </div>
                {activeTicketModal.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount Applied ({activeTicketModal.discountCode})</span>
                    <span>- ₹{activeTicketModal.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>GST &amp; Service Taxes (5%)</span>
                  <span>₹{activeTicketModal.taxesAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black text-white">
                  <span>Total Paid</span>
                  <span className="text-teal-400">₹{activeTicketModal.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION CONFIRMATION DIALOG */}
      {activeCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              type="button"
              onClick={() => setActiveCancelModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-2 border border-rose-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Cancel Booking?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to cancel booking{' '}
                <strong className="text-teal-300 font-mono">{activeCancelModal.bookingReference}</strong>? The reserved seats/rooms will be released back into inventory.
              </p>
            </div>

            {actionMessage && (
              <div className="mb-4 p-3 bg-teal-500/15 border border-teal-500/30 rounded-xl text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionMessage}</span>
              </div>
            )}

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-slate-300">Select Cancellation Reason</label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              >
                <option value="Change of travel plan">Change of travel plan</option>
                <option value="Booked by mistake">Booked by mistake</option>
                <option value="Found alternative mode of transport">Found alternative mode of transport</option>
                <option value="Personal emergency">Personal emergency</option>
              </select>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setActiveCancelModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
