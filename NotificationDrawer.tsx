import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Ticket,
  BadgePercent,
  Headphones,
  UserCheck,
  Check,
  Clock,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem } from '../../types/travel';

export const NotificationDrawer: React.FC<{ onNavigateToBookings: () => void }> = ({
  onNavigateToBookings,
}) => {
  const { notifications, unreadCount, isDrawerOpen, setIsDrawerOpen, markAsRead, markAllAsRead } =
    useNotifications();

  if (!isDrawerOpen) return null;

  const getNotifIcon = (cat: string) => {
    switch (cat) {
      case 'booking':
        return Ticket;
      case 'offer':
        return BadgePercent;
      case 'support':
        return Headphones;
      default:
        return UserCheck;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Notifications</h2>
                <span className="text-[11px] text-slate-400 font-medium">
                  {unreadCount} Unread Alert{unreadCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = getNotifIcon(n.category);
                return (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border transition-all text-xs ${
                      n.isRead
                        ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                        : 'bg-slate-800/90 border-teal-500/40 text-slate-200 shadow-md ring-1 ring-teal-500/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 shrink-0 ${n.isRead ? 'text-slate-500' : 'text-teal-400'}`} />
                        <h4 className={`font-bold ${n.isRead ? 'text-slate-300' : 'text-white'}`}>
                          {n.title}
                        </h4>
                      </div>

                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(n.id)}
                          title="Mark as read"
                          className="p-1 text-slate-400 hover:text-teal-300 rounded hover:bg-slate-700/60"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-300 pl-6">{n.message}</p>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80 pl-6 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull;{' '}
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>

                      {n.bookingReference && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsDrawerOpen(false);
                            onNavigateToBookings();
                          }}
                          className="text-teal-400 font-bold hover:underline"
                        >
                          View {n.bookingReference} &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
