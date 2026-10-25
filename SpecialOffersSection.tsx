import React from 'react';
import { BadgePercent, HeartHandshake, Stethoscope, GraduationCap, Shield, Award, Sparkles, ArrowRight } from 'lucide-react';

interface SpecialOffersSectionProps {
  onViewOffers: () => void;
}

export const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({ onViewOffers }) => {
  const highlights = [
    {
      title: 'Senior Citizens',
      discount: 'Up to 25% OFF',
      code: 'SENIOR25',
      icon: HeartHandshake,
      desc: 'Exclusive concessions for travelers aged 60+ on flights, trains, and buses.',
    },
    {
      title: 'Doctors & Healthcare',
      discount: 'Up to 20% OFF',
      code: 'DOC20',
      icon: Stethoscope,
      desc: 'Gratitude discount for registered medical professionals and nurses.',
    },
    {
      title: 'Students Concession',
      discount: 'Flat 15% OFF',
      code: 'STUDENT15',
      icon: GraduationCap,
      desc: 'Special student fare + priority sleeper allocations with valid College ID.',
    },
    {
      title: 'Defence & Armed Forces',
      discount: 'Up to 25% OFF',
      code: 'DEFENCE25',
      icon: Shield,
      desc: 'National Pride concession for Army, Navy, Air Force & dependent families.',
    },
    {
      title: 'Police Officers',
      discount: 'Flat 18% OFF',
      code: 'POLICE18',
      icon: Award,
      desc: 'Honoring state and central police personnel across all travel bookings.',
    },
    {
      title: 'Regular Customers',
      discount: 'Flat 10% OFF',
      code: 'REGULAR10',
      icon: Sparkles,
      desc: 'Instant loyalty discount for frequent EnjoyJourney travelers on any route.',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
              <span>Special Concessions &amp; Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Honoring Our Community &amp; Heroes
            </h2>
          </div>

          <button
            type="button"
            onClick={onViewOffers}
            className="self-start sm:self-auto px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>View All Concessions</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl p-4 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                  </div>
                  <span className="text-[11px] font-black text-amber-400 font-mono">{item.discount}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Promo Code:</span>
                  <span className="font-mono font-bold text-teal-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
