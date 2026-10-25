import React from 'react';
import { Compass, Bell, LogOut, User as UserIcon, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenDashboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, onOpenDashboard }) => {
  const { user, logout } = useAuth();
  const { unreadCount, isDrawerOpen, setIsDrawerOpen } = useNotifications();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20">
            <Compass className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Enjoy<span className="text-teal-400">Journey</span>
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                Demo Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Explore More. Travel Better.</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Dashboard Action */}
          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Traveler Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <span>Dashboard</span>
            </button>
          )}

          {/* Notification Bell with Badge */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-slate-950 text-[11px] font-black rounded-full flex items-center justify-center animate-pulse shadow-md">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          {user && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-xs">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-white truncate max-w-[120px]">{user.fullName}</span>
                  {user.isEmailVerified && (
                    <span title="Verified Account" className="inline-flex">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block">{user.email}</span>
              </div>
            </button>
          )}

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
            title="Sign Out of EnjoyJourney"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
