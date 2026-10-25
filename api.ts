import {
  User,
  Booking,
  Offer,
  NotificationItem,
  SupportTicket,
  PopularDestination,
  FlightItem,
  BusItem,
  CabItem,
  HotelItem,
  MetroItem,
  TrainItem,
  TravelCategory,
} from '../types/travel';

const TOKEN_KEY = 'enjoyjourney_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg) as Error & { status?: number; data?: any };
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: any) => request<{ message: string; email: string; emailStatus: any }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  verifyEmail: (email: string, code: string) => request<{ message: string; user: User; token: string }>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  }),
  resendCode: (email: string) => request<{ message: string; emailStatus: any }>('/api/auth/resend-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  login: (email: string, password: string) => request<{ message: string; user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  forgotPassword: (email: string) => request<{ message: string; email: string; emailStatus: any }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  resetPassword: (body: any) => request<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  getMe: () => request<{ user: User }>('/api/auth/me'),
  updateProfile: (body: any) => request<{ message: string; user: User }>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  changePassword: (body: any) => request<{ message: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(body),
  }),

  // Services
  getDestinations: () => request<{ destinations: PopularDestination[] }>('/api/services/destinations'),
  getFlights: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<{ flights: FlightItem[]; isDemoData: boolean }>(`/api/services/flights?${query}`);
  },
  getBuses: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<{ buses: BusItem[]; isDemoData: boolean }>(`/api/services/buses?${query}`);
  },
  getCabs: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<{ cabs: CabItem[]; isDemoData: boolean }>(`/api/services/cabs?${query}`);
  },
  getHotels: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<{ hotels: HotelItem[]; isDemoData: boolean }>(`/api/services/hotels?${query}`);
  },
  getMetro: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<{ metroLines: MetroItem[]; isDemoData: boolean }>(`/api/services/metro?${query}`);
  },
  getTrains: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<{ trains: TrainItem[]; isDemoData: boolean }>(`/api/services/trains?${query}`);
  },
  getSeatMap: (category: TravelCategory, id: string) =>
    request<{ serviceId: string; category: string; bookedSeats?: string[]; seats?: any[]; classes?: any[]; bookedSeatsByClass?: any }>(
      `/api/services/seat-map/${category}/${id}`
    ),

  // Bookings
  createBooking: (body: any) => request<{ message: string; booking: Booking }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  getMyBookings: () => request<{ bookings: Booking[] }>('/api/bookings'),
  getDashboardStats: () => request<{
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
  }>('/api/bookings/dashboard-stats'),
  getBookingById: (id: string) => request<{ booking: Booking }>(`/api/bookings/${id}`),
  cancelBooking: (id: string, reason?: string) => request<{ message: string; booking: Booking }>(`/api/bookings/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  // Offers
  getOffers: () => request<{ offers: Offer[] }>('/api/offers'),
  validateOffer: (code: string, amount: number, category: string) =>
    request<{ valid: boolean; code: string; title: string; discountPercent: number; discountAmount: number; finalAmount: number; message: string }>(
      '/api/offers/validate',
      {
        method: 'POST',
        body: JSON.stringify({ code, amount, category }),
      }
    ),
  claimOffer: (code: string, idCardNumber?: string, institutionOrUnit?: string) =>
    request<{ message: string; claimedOffers: string[]; offer: Offer }>('/api/offers/claim', {
      method: 'POST',
      body: JSON.stringify({ code, idCardNumber, institutionOrUnit }),
    }),

  // Notifications
  getNotifications: () => request<{ notifications: NotificationItem[]; unreadCount: number }>('/api/notifications'),
  markNotificationRead: (id: string) => request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => request<{ success: boolean; updatedCount: number }>('/api/notifications/mark-all-read', { method: 'POST' }),

  // Support
  getSupportInfo: () => request<{ email: string; helpline: string; hours: string; headquarters: string; faqs: any[] }>('/api/support/info'),
  getMyTickets: () => request<{ tickets: SupportTicket[] }>('/api/support/tickets'),
  createTicket: (body: any) => request<{ message: string; ticket: SupportTicket }>('/api/support/tickets', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
};
