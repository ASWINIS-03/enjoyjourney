import React, { useState } from 'react';
import {
  Home,
  LayoutDashboard,
  Plane,
  Bus,
  Car,
  Building2,
  TramFront,
  Train,
  TicketCheck,
  UserCheck,
  BadgePercent,
  Headphones,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type ActivePage =
  | 'home'
  | 'dashboard'
  | 'flights'
  | 'buses'
  | 'cabs'
  | 'hotels'
  | 'metro'
  | 'trains'
  | 'bookings'
  | 'profile'
  | 'offers'
  | 'support';

interface NavigationBoxProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
}

export const NavigationBox: React.FC<NavigationBoxProps> = ({ activePage, onSelectPage }) => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{
    id: ActivePage | 'signout';
    label: string;
    icon: React.ElementType;
    isAction?: boolean;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'cabs', label: 'Cabs', icon: Car },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'metro', label: 'Metro Train', icon: TramFront },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'bookings', label: 'My Booking Orders', icon: TicketCheck },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'offers', label: 'Offers', icon: BadgePercent },
    { id: 'support', label: 'Customer Support', icon: Headphones },
    { id: 'signout', label: 'Sign Out', icon: LogOut, isAction: true },
  ];

  const handleNavClick = (id: ActivePage | 'signout') => {
    if (id === 'signout') {
      logout();
    } else {
      onSelectPage(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Mobile Bar: Toggle Button & Active Page Label */}
      <div className="md:hidden flex items-center justify-between p-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Current Page:</span>
          <span className="text-sm font-bold text-white capitalize">{activePage.replace('-', ' ')}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-700 text-slate-200 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Dedicated Navigation Box */}
      <nav
        aria-label="Main Navigation Box"
        className="hidden md:block bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 shadow-xl transition-all"
      >
        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const isSignOut = item.id === 'signout';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-teal-500/20 ring-1 ring-teal-400'
                    : isSignOut
                    ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                    : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : isSignOut ? 'text-rose-400' : 'text-teal-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border border-slate-700 rounded-2xl p-3 shadow-2xl space-y-1 mb-4 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const isSignOut = item.id === 'signout';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : isSignOut
                    ? 'text-rose-400 hover:bg-rose-500/10'
                    : 'text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : isSignOut ? 'text-rose-400' : 'text-teal-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/20 font-bold">Active</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
