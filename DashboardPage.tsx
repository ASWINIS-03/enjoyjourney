import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  TrendingUp,
  Wallet,
  Sparkles,
  Plane,
  Bus,
  Car,
  Building2,
  TramFront,
  Train,
  ArrowRight,
  ShieldCheck,
  Award,
  Bell,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { Booking, TravelCategory } from '../types/travel';
import { ActivePage } from '../components/common/NavigationBox';

interface DashboardStats {
  totalBookings: number;
  confirmedCount: number;
  cancelledCount: number;
  totalSpent: number;
  totalSaved: number;
  categoryBreakdown: Record<string, number>;
  recentBookings: Booking[];
  upcomingTrip: Booking | null;
  claimedOffersCount: number;
  claimedOffers: string[];
  unreadNotificationsCount: number;
  loyaltyPoints: number;
  loyaltyTier: string;
}

interface DashboardPageProps {
  onNavigate: (page: ActivePage) => void;
  onSelectCategory: (cat: TravelCategory) => void;
  onOpenBookingVoucher: (booking: Booking) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectCategory,
  onOpenBookingVoucher,
}) => {
  const { user } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useNotifications();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardStats();
      setStats(res);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getCategoryIcon = (cat: string) => {
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
        return Ticket;
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading your travel dashboard...</p>
      </div>
    );
  }

  const breakdown = stats?.categoryBreakdown || {
    flight: 0,
    bus: 0,
    cab: 0,
    hotel: 0,
    metro: 0,
    train: 0,
  };

  const totalServicesBooked = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Dashboard Welcome Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{stats?.loyaltyTier || 'Silver Traveler'}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                &bull; {stats?.loyaltyPoints || 0} Reward Points
              </span>
              {user?.isEmailVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Account</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track your travel spending, active itineraries across all 6 transport services, special concessions, and digital vouchers in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-slate-950" />
              <span>Book New Journey</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>All Orders</span>
            </button>
            <button
              type="button"
              onClick={fetchDashboardData}
              title="Refresh Stats"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Metrics (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Bookings
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {stats?.totalBookings || 0}
            </div>
            <span className="text-[11px] text-emerald-400 block mt-1 font-semibold">
              {stats?.confirmedCount || 0} Confirmed &bull; {stats?.cancelledCount || 0} Cancelled
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Travel Spend
            </span>
            <div className="text-3xl font-black text-white mt-1">
              ₹{(stats?.totalSpent || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Across all confirmed tickets
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Saved through Special Concessions */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Concession Savings
            </span>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              ₹{(stats?.totalSaved || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-300/80 block mt-1 font-semibold">
              {stats?.claimedOffersCount || 0} active discount passes
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Loyalty Tier & Alerts */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              EnjoyJourney Rewards
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono mt-1">
              {stats?.loyaltyPoints || 0} <span className="text-xs text-slate-400">Pts</span>
            </div>
            <span className="text-[11px] text-slate-300 block mt-1">
              Tier: <strong className="text-white">{stats?.loyaltyTier}</strong>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Upcoming Journey Card or Prompt */}
      {stats?.upcomingTrip ? (
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Next Upcoming Journey</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {stats.upcomingTrip.serviceName}
                {stats.upcomingTrip.serviceNumber && ` (${stats.upcomingTrip.serviceNumber})`}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                {(stats.upcomingTrip.origin || stats.upcomingTrip.destination) && (
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {stats.upcomingTrip.origin} &rarr; {stats.upcomingTrip.destination}
                  </span>
                )}
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  {stats.upcomingTrip.travelDate || stats.upcomingTrip.checkInDate}
                  {stats.upcomingTrip.departureTime ? ` at ${stats.upcomingTrip.departureTime}` : ''}
                </span>
                <span>&bull;</span>
                <span>{stats.upcomingTrip.passengersCount} Traveler(s)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Booking Reference</span>
                <span className="text-lg font-mono font-black text-teal-300">{stats.upcomingTrip.bookingReference}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenBookingVoucher(stats.upcomingTrip!)}
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>View E-Ticket Voucher</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Upcoming Trips Planned</h3>
            <p className="text-xs text-slate-400">
              Ready to explore? Book domestic flights, buses, cabs, hotels, metro, or trains with verified seats.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Search Next Destination</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Travel Category Distribution & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Travel Mode Usage
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">All-time bookings</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { id: 'flight', label: 'Flights', count: breakdown.flight, icon: Plane, color: 'bg-teal-400' },
              { id: 'bus', label: 'Buses', count: breakdown.bus, icon: Bus, color: 'bg-cyan-400' },
              { id: 'cab', label: 'Cabs', count: breakdown.cab, icon: Car, color: 'bg-blue-400' },
              { id: 'hotel', label: 'Hotels', count: breakdown.hotel, icon: Building2, color: 'bg-indigo-400' },
              { id: 'metro', label: 'Metro Rail', count: breakdown.metro, icon: TramFront, color: 'bg-purple-400' },
              { id: 'train', label: 'Trains', count: breakdown.train, icon: Train, color: 'bg-emerald-400' },
            ].map((item) => {
              const Icon = item.icon;
              const percent = Math.round((item.count / totalServicesBooked) * 100) || 0;

              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Icon className="w-3.5 h-3.5 text-teal-400" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-white font-mono font-bold">
                      {item.count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(item.count > 0 ? 8 : 0, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>6 Travel Categories Active</span>
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="text-teal-400 font-semibold hover:underline"
            >
              Manage in Booking Orders &rarr;
            </button>
          </div>
        </div>

        {/* Quick Route Launchpad & Favorites (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Quick Re-Book &amp; Route Hub
              </h3>
            </div>
            <span className="text-[11px] text-teal-300 font-medium">1-Click Booking Launch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => onSelectCategory('flight')}
              className="p-3.5 bg-slate-900/70 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 text-[10px] font-bold uppercase">
                  Flight
                </span>
                <span className="text-xs font-mono font-bold text-white">from ₹2,890</span>
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-teal-300 transition-colors">
                Chennai &rarr; Delhi (MAA-DEL)
              </h4>
              <p className="text-[11px] text-slate-400">IndiGo &bull; Airbus A321neo &bull; 2h 45m</p>
            </div>

            <div
              onClick={() => onSelectCategory('train')}
              className="p-3.5 bg-slate-900/70 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase">
                  Train
                </span>
                <span className="text-xs font-mono font-bold text-white">from ₹995</span>
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-teal-300 transition-colors">
                Chennai &rarr; Bengaluru
              </h4>
              <p className="text-[11px] text-slate-400">Vande Bharat Express &bull; AC Chair Car</p>
            </div>

            <div
              onClick={() => onSelectCategory('bus')}
              className="p-3.5 bg-slate-900/70 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase">
                  Bus
                </span>
                <span className="text-xs font-mono font-bold text-white">from ₹950</span>
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-teal-300 transition-colors">
                Chennai &rarr; Madurai
              </h4>
              <p className="text-[11px] text-slate-400">KPN Multi-Axle Sleeper &bull; 8h Overnight</p>
            </div>

            <div
              onClick={() => onSelectCategory('hotel')}
              className="p-3.5 bg-slate-900/70 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase">
                  Hotel
                </span>
                <span className="text-xs font-mono font-bold text-white">from ₹4,200</span>
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-teal-300 transition-colors">
                Ooty Hillview Heritage Resort
              </h4>
              <p className="text-[11px] text-slate-400">5-Star Mountain Luxury &bull; Free Breakfast</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Booking Orders Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-teal-400" />
              <span>Recent Booking Orders</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Your latest travel tickets generated on EnjoyJourney.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-teal-300 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            View All ({stats?.totalBookings || 0}) Orders &rarr;
          </button>
        </div>

        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-900/60 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Sector / Hotel</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {stats.recentBookings.map((b) => {
                  const Icon = getCategoryIcon(b.category);
                  return (
                    <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-300">
                        {b.bookingReference}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{b.serviceName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {b.origin && b.destination ? `${b.origin} → ${b.destination}` : b.category.toUpperCase()}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {b.travelDate || b.checkInDate}
                      </td>
                      <td className="py-3 px-3 font-bold text-white font-mono">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenBookingVoucher(b)}
                          className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-300 border border-teal-500/30 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Voucher
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            No booking records yet. Start by booking a flight, bus, cab, hotel, or train ticket!
          </div>
        )}
      </div>

      {/* 6. Active Concessions & Quick Support Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Concessions */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Claimed Concessions
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('offers')}
              className="text-xs text-teal-400 hover:underline font-semibold"
            >
              Browse All &rarr;
            </button>
          </div>

          {stats?.claimedOffers && stats.claimedOffers.length > 0 ? (
            <div className="space-y-2">
              {stats.claimedOffers.map((code) => (
                <div
                  key={code}
                  className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-mono font-bold text-teal-300">{code}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified for Checkout
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              No concessions claimed yet. Students, Seniors, Doctors, Defence, and Police personnel can claim exclusive travel discounts.
            </p>
          )}
        </div>

        {/* 24/7 Helpline & Support */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Help &amp; Inquiries
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('support')}
              className="text-xs text-teal-400 hover:underline font-semibold"
            >
              Helpdesk &rarr;
            </button>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Support Helpline:</span>
              <span className="font-bold text-white">1800-EJ-JOURNEY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Support Email:</span>
              <span className="font-bold text-teal-300">support@enjoyjourney.demo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Unread Notifications:</span>
              <span className="font-bold text-amber-400">{unreadCount} Alert(s)</span>
            </div>
          </div>

          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate('support')}
              className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold text-center transition-colors"
            >
              Raise Support Ticket
            </button>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex-1 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-300 border border-teal-500/30 text-xs font-bold text-center transition-all"
            >
              View Alerts ({unreadCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
