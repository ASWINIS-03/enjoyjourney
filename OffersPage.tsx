import React, { useState, useEffect } from 'react';
import {
  BadgePercent,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  Stethoscope,
  GraduationCap,
  Shield,
  Award,
  ArrowRight,
  X,
  FileCheck,
  Plane,
  Bus,
  Car,
  Building2,
  TramFront,
  Train,
} from 'lucide-react';
import { Offer, TravelCategory } from '../types/travel';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const OffersPage: React.FC<{ onNavigateToCategory: (cat: TravelCategory) => void }> = ({
  onNavigateToCategory,
}) => {
  const { user, refreshUser } = useAuth();
  const { refreshNotifications } = useNotifications();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const [claimModalOffer, setClaimModalOffer] = useState<Offer | null>(null);
  const [idNumber, setIdNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimError, setClaimError] = useState('');

  const fetchOffers = async () => {
    try {
      const res = await api.getOffers();
      setOffers(res.offers || []);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleClaimOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimModalOffer) return;
    setClaimLoading(true);
    setClaimError('');
    setClaimSuccess('');

    try {
      const res = await api.claimOffer(claimModalOffer.code, idNumber, institution);
      setClaimSuccess(res.message);
      await refreshUser();
      await refreshNotifications();
      setTimeout(() => {
        setClaimModalOffer(null);
        setClaimSuccess('');
      }, 1500);
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim offer.');
    } finally {
      setClaimLoading(false);
    }
  };

  const getOfferIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Stethoscope':
        return Stethoscope;
      case 'GraduationCap':
        return GraduationCap;
      case 'Shield':
        return Shield;
      case 'Award':
        return Award;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
          <BadgePercent className="w-4 h-4 text-amber-400" />
          <span>Exclusive Travel Concessions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Special Discounts &amp; Offers
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          EnjoyJourney is proud to honor Senior Citizens, Healthcare Warriors, Students, Armed Forces, and Police Personnel with dedicated domestic travel concessions.
        </p>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading offers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const Icon = getOfferIcon(offer.iconName);
            const isClaimed = user?.claimedOffers?.includes(offer.code);

            return (
              <div
                key={offer.id}
                className="bg-slate-800/90 border border-slate-700/80 hover:border-teal-500/50 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-teal-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                        {offer.code}
                      </span>
                      <span className="text-2xl font-black text-white block mt-1">
                        {offer.discountPercent}% OFF
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight">{offer.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{offer.description}</p>

                  {/* Eligibility box */}
                  <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Eligibility Criteria:
                    </span>
                    <span className="text-slate-300 leading-snug">{offer.eligibilityCriteria}</span>
                  </div>

                  {/* Applicable categories */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-semibold">Valid On:</span>
                    {offer.applicableServices.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded-md bg-slate-700/60 text-teal-300 text-[10px] font-bold uppercase"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-5 mt-5 border-t border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Savings:</span>
                    <span className="text-xs font-bold text-white">Up to ₹{offer.maxDiscount}</span>
                  </div>

                  {isClaimed ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified &amp; Claimed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setClaimModalOffer(offer)}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4 text-slate-950" />
                      <span>Claim Concession</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CLAIM CONCESSION MODAL */}
      {claimModalOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              type="button"
              onClick={() => setClaimModalOffer(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-2 border border-teal-500/30">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">{claimModalOffer.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Verify eligibility to link <strong className="text-teal-300 font-mono">{claimModalOffer.code}</strong> to your account.
              </p>
            </div>

            {claimSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{claimSuccess}</span>
              </div>
            )}

            {claimError && (
              <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <span>{claimError}</span>
              </div>
            )}

            <form onSubmit={handleClaimOffer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ID Card / Roll / Service Number
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. STU-2026-8812 / MED-49102 / DEF-771"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institution / Unit / Issuing Department
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Madras University / Govt Hospital / Indian Army"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={claimLoading}
                  className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {claimLoading ? 'Verifying...' : `Claim & Link ${claimModalOffer.code}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
