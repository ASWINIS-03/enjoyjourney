import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Ticket, Sparkles, Tag, AlertCircle, CheckCircle, User as UserIcon } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Booking, TravelCategory } from '../../types/travel';

interface BookingCheckoutModalProps {
  category: TravelCategory;
  serviceId: string;
  serviceName: string;
  serviceNumber?: string;
  origin?: string;
  destination?: string;
  travelDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  returnDate?: string;
  checkInDate?: string;
  checkOutDate?: string;
  nightsCount?: number;
  passengersCount: number;
  selectedSeats?: string[];
  travelClass?: string;
  roomType?: string;
  cabType?: string;
  baseAmount: number;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  category,
  serviceId,
  serviceName,
  serviceNumber,
  origin,
  destination,
  travelDate,
  departureTime,
  arrivalTime,
  returnDate,
  checkInDate,
  checkOutDate,
  nightsCount,
  passengersCount,
  selectedSeats = [],
  travelClass,
  roomType,
  cabType,
  baseAmount,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications();

  // Passenger form
  const [passengers, setPassengers] = useState<Array<{ name: string; age?: number; gender?: string }>>(() => {
    const list = [];
    for (let i = 0; i < passengersCount; i++) {
      list.push({
        name: i === 0 && user ? user.fullName : '',
        age: 28,
        gender: 'Male',
      });
    }
    return list;
  });

  // Offers
  const [offerCode, setOfferCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [offerMessage, setOfferMessage] = useState('');
  const [validatingOffer, setValidatingOffer] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-apply student or regular offer if user has it
  useEffect(() => {
    if (user?.claimedOffers && user.claimedOffers.length > 0 && !appliedOffer) {
      const firstCode = user.claimedOffers[0];
      handleValidateOffer(firstCode);
    }
  }, [user]);

  const handleValidateOffer = async (codeToTest?: string) => {
    const code = (codeToTest || offerCode).trim().toUpperCase();
    if (!code) return;

    setValidatingOffer(true);
    setOfferMessage('');
    try {
      const res = await api.validateOffer(code, baseAmount, category);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
        setAppliedOffer(res.code);
        setOfferCode(res.code);
        setOfferMessage(res.message);
      }
    } catch (err: any) {
      setOfferMessage(err.message || 'Offer code not applicable.');
      setDiscountAmount(0);
      setAppliedOffer(null);
    } finally {
      setValidatingOffer(false);
    }
  };

  const removeOffer = () => {
    setOfferCode('');
    setDiscountAmount(0);
    setAppliedOffer(null);
    setOfferMessage('');
  };

  const handlePassengerChange = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const discountedBase = Math.max(0, baseAmount - discountAmount);
  const taxesAmount = Math.round(discountedBase * 0.05);
  const totalFare = discountedBase + taxesAmount;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate passenger names
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || passengers[i].name.trim().length === 0) {
        setErrorMessage(`Please enter the full name for Traveler #${i + 1}.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await api.createBooking({
        category,
        serviceId,
        serviceName,
        serviceNumber,
        origin,
        destination,
        travelDate,
        departureTime,
        arrivalTime,
        returnDate,
        checkInDate,
        checkOutDate,
        nightsCount,
        passengersCount,
        passengers,
        selectedSeats,
        travelClass,
        roomType,
        cabType,
        baseAmount,
        appliedOfferCode: appliedOffer || undefined,
      });

      await refreshNotifications();
      onSuccess(res.booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking validation failed. Please check seat/room availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-8 text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/10 text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Ticket className="w-3.5 h-3.5" />
            <span>Booking Summary &amp; Checkout</span>
          </div>
          <h2 className="text-xl font-black text-white">{serviceName}</h2>
          <p className="text-xs text-slate-400">
            {origin && destination ? `${origin} → ${destination}` : `${category.toUpperCase()} Reservation`}
          </p>
        </div>

        {/* Selected Service Breakdown Card */}
        <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl mb-4 text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Service Date</span>
              <span className="font-bold text-white">
                {travelDate || checkInDate} {departureTime ? `at ${departureTime}` : ''}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Passengers / Rooms</span>
              <span className="font-bold text-white">
                {passengersCount} {category === 'hotel' ? 'Room(s)' : 'Traveler(s)'}
              </span>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="text-teal-300 font-medium">
              Selected Seats/Berths: <strong className="font-mono text-white">{selectedSeats.join(', ')}</strong>{' '}
              {travelClass && `(${travelClass})`}
            </div>
          )}

          {nightsCount && <div className="text-slate-300">Total Nights: {nightsCount} Night(s)</div>}
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleConfirmBooking} className="space-y-4">
          {/* Passenger Information */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-teal-400" />
              <span>Traveler / Guest Details</span>
            </h3>

            {passengers.map((p, idx) => (
              <div key={idx} className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-1">
                    Traveler #{idx + 1} Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={p.name}
                    onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                    placeholder="e.g. Alex Traveler"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Age &amp; Gender</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="number"
                      min={1}
                      max={110}
                      value={p.age || 25}
                      onChange={(e) => handlePassengerChange(idx, 'age', Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                    <select
                      value={p.gender || 'Male'}
                      onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="Male">M</option>
                      <option value="Female">F</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Offers & Promo Code Section */}
          <div className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Special Concession &amp; Promo Code</span>
              </span>
              {appliedOffer && (
                <button
                  type="button"
                  onClick={removeOffer}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  Remove Offer
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                placeholder="e.g. STUDENT15 or SENIOR25"
                disabled={Boolean(appliedOffer)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-wider text-teal-300 uppercase focus:border-teal-400 focus:outline-none disabled:opacity-60"
              />
              {!appliedOffer ? (
                <button
                  type="button"
                  onClick={() => handleValidateOffer()}
                  disabled={validatingOffer || !offerCode}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-teal-300 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {validatingOffer ? 'Checking...' : 'Apply Code'}
                </button>
              ) : (
                <div className="flex items-center px-3 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/30 gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Applied</span>
                </div>
              )}
            </div>

            {offerMessage && (
              <p
                className={`text-[11px] mt-1.5 ${
                  appliedOffer ? 'text-emerald-400 font-semibold' : 'text-amber-400'
                }`}
              >
                {offerMessage}
              </p>
            )}

            {/* Claimed offers list shortcut */}
            {user?.claimedOffers && user.claimedOffers.length > 0 && !appliedOffer && (
              <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">Your Claimed Offers:</span>
                {user.claimedOffers.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleValidateOffer(code)}
                    className="px-2 py-0.5 rounded-md bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 text-[10px] font-bold font-mono transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Base Fare / Room Cost</span>
              <span>₹{baseAmount.toLocaleString('en-IN')}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Special Concession ({appliedOffer})</span>
                <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Taxes &amp; GST (5%)</span>
              <span>₹{taxesAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black text-white">
              <span>Total Payable</span>
              <span className="text-teal-400 text-base">₹{totalFare.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5 text-slate-950" />
            <span>{loading ? 'Processing & Validating Availability...' : 'Confirm & Book Reservation'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
