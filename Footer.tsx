import React from 'react';
import { Compass, ShieldCheck, Mail, Phone, Heart } from 'lucide-react';
import { ActivePage } from './NavigationBox';

export const Footer: React.FC<{ onNavigate: (page: ActivePage) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-black">
                <Compass className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Enjoy<span className="text-teal-400">Journey</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explore More. Travel Better. A full-stack travel booking web application designed for comprehensive domestic travel planning with seat reservations and special concessions.
            </p>
            <div className="text-[10px] text-amber-400/90 font-medium bg-amber-400/10 border border-amber-400/20 p-2 rounded-xl">
              Demonstration Platform &bull; Developed for BCA College Project &amp; Portfolio
            </div>
          </div>

          {/* Travel Services Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Travel Categories
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button type="button" onClick={() => onNavigate('flights')} className="hover:text-teal-300">
                  Domestic Flights
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('buses')} className="hover:text-teal-300">
                  Intercity AC Buses &amp; Sleepers
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('cabs')} className="hover:text-teal-300">
                  Airport &amp; Outstation Cabs
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('hotels')} className="hover:text-teal-300">
                  Hotels &amp; Hill Station Resorts
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('metro')} className="hover:text-teal-300">
                  Metro Rail QR Tokens
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('trains')} className="hover:text-teal-300">
                  Vande Bharat &amp; Express Trains
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links & Account */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Account &amp; Offers
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button type="button" onClick={() => onNavigate('bookings')} className="hover:text-teal-300">
                  My Booking Orders &amp; Vouchers
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('offers')} className="hover:text-teal-300">
                  Special Concessions (Senior/Student/Defence)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('profile')} className="hover:text-teal-300">
                  My Traveler Profile
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('support')} className="hover:text-teal-300">
                  Help Desk &amp; FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>support@enjoyjourney.demo</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>1800-EJ-JOURNEY (Toll Free)</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-2 leading-relaxed">
                EnjoyJourney Tech Campus, Anna Salai, Chennai, Tamil Nadu, 600002.
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Project Footer Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            &copy; 2026 <strong className="text-white">EnjoyJourney</strong> Travel Booking System. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">Terms &amp; Conditions</span>
            <span>&bull;</span>
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-200 cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
