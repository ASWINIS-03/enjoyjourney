import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import {
  UserDocument,
  BookingDocument,
  OfferDocument,
  NotificationDocument,
  SupportTicketDocument,
  FlightServiceDocument,
  BusServiceDocument,
  CabServiceDocument,
  HotelDocument,
  MetroServiceDocument,
  TrainServiceDocument,
} from './types.js';
import {
  SEED_USERS,
  SEED_OFFERS,
  SEED_FLIGHTS,
  SEED_BUSES,
  SEED_CABS,
  SEED_HOTELS,
  SEED_METRO,
  SEED_TRAINS,
  SEED_NOTIFICATIONS,
} from './seedData.js';

// Define Mongoose Schemas for MongoDB compliance
const userMongooseSchema = new mongoose.Schema<UserDocument>({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: String,
  resetPasswordCode: String,
  resetPasswordExpires: String,
  city: String,
  emergencyContact: String,
  claimedOffers: [String],
}, { timestamps: true });

const bookingMongooseSchema = new mongoose.Schema<BookingDocument>({
  id: { type: String, required: true, unique: true },
  bookingReference: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  userMobile: { type: String, required: true },
  category: { type: String, required: true, enum: ['flight', 'bus', 'cab', 'hotel', 'metro', 'train'] },
  serviceName: { type: String, required: true },
  serviceNumber: String,
  origin: String,
  destination: String,
  travelDate: String,
  departureTime: String,
  arrivalTime: String,
  returnDate: String,
  checkInDate: String,
  checkOutDate: String,
  nightsCount: Number,
  passengersCount: { type: Number, required: true },
  passengers: [{ name: String, age: Number, gender: String, seatOrBerth: String }],
  selectedSeats: [String],
  travelClass: String,
  roomType: String,
  cabType: String,
  baseAmount: { type: Number, required: true },
  taxesAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  discountCode: String,
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'], default: 'Confirmed' },
  cancellationReason: String,
  cancelledAt: String,
  qrCodeData: String,
  isDemoData: { type: Boolean, default: true },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', userMongooseSchema);
export const BookingModel = mongoose.models.Booking || mongoose.model<BookingDocument>('Booking', bookingMongooseSchema);

// In-Memory / File Persistent Store for Demo & Sandbox operation
const DATA_FILE = path.resolve(process.cwd(), '.enjoyjourney_data.json');

interface DatabaseStore {
  users: UserDocument[];
  bookings: BookingDocument[];
  offers: OfferDocument[];
  notifications: NotificationDocument[];
  supportTickets: SupportTicketDocument[];
  flights: FlightServiceDocument[];
  buses: BusServiceDocument[];
  cabs: CabServiceDocument[];
  hotels: HotelDocument[];
  metro: MetroServiceDocument[];
  trains: TrainServiceDocument[];
}

let store: DatabaseStore = {
  users: [...SEED_USERS],
  bookings: [],
  offers: [...SEED_OFFERS],
  notifications: [...SEED_NOTIFICATIONS],
  supportTickets: [],
  flights: [...SEED_FLIGHTS],
  buses: [...SEED_BUSES],
  cabs: [...SEED_CABS],
  hotels: [...SEED_HOTELS],
  metro: [...SEED_METRO],
  trains: [...SEED_TRAINS],
};

function saveStoreToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[EnjoyJourney Store] Could not write to disk, using in-memory only:', err);
  }
}

function loadStoreFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        store = {
          ...store,
          ...parsed,
        };
        return;
      }
    }
  } catch (err) {
    console.warn('[EnjoyJourney Store] Reading data file failed, resetting to seed defaults:', err);
  }
  saveStoreToFile();
}

export async function initDatabase() {
  loadStoreFromFile();

  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && !mongoUri.includes('<username>')) {
    try {
      console.log('[EnjoyJourney MongoDB] Connecting to MongoDB...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
      console.log('[EnjoyJourney MongoDB] Connected to MongoDB Atlas successfully.');
    } catch (err) {
      console.warn('[EnjoyJourney MongoDB] Connection failed. Using robust embedded database store with seed data.', err instanceof Error ? err.message : err);
    }
  } else {
    console.log('[EnjoyJourney] Running with demonstration persistent database store (Set valid MONGODB_URI in .env to connect to live MongoDB Atlas).');
  }
}

export const dbStore = {
  // Users
  getUserByEmail: (email: string) => store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  getUserById: (id: string) => store.users.find((u) => u.id === id),
  createUser: (user: UserDocument) => {
    store.users.push(user);
    saveStoreToFile();
    return user;
  },
  updateUser: (id: string, updates: Partial<UserDocument>) => {
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      store.users[idx] = { ...store.users[idx], ...updates, updatedAt: new Date().toISOString() };
      saveStoreToFile();
      return store.users[idx];
    }
    return null;
  },

  // Bookings
  getBookingsByUserId: (userId: string) => store.bookings.filter((b) => b.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getBookingById: (id: string, userId: string) => store.bookings.find((b) => b.id === id && b.userId === userId),
  getBookingByReference: (ref: string, userId?: string) => store.bookings.find((b) => b.bookingReference === ref && (!userId || b.userId === userId)),
  createBooking: (booking: BookingDocument) => {
    store.bookings.unshift(booking);
    saveStoreToFile();
    return booking;
  },
  cancelBooking: (id: string, userId: string, reason?: string) => {
    const booking = store.bookings.find((b) => b.id === id && b.userId === userId);
    if (!booking) return null;
    if (booking.status === 'Cancelled') {
      return { booking, alreadyCancelled: true };
    }
    booking.status = 'Cancelled';
    booking.cancellationReason = reason || 'Cancelled by user';
    booking.cancelledAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    // Release seats if flight, bus, or train
    if (booking.category === 'flight' && booking.selectedSeats) {
      const flight = store.flights.find((f) => f.flightNumber === booking.serviceNumber || f.airline === booking.serviceName);
      if (flight) {
        flight.bookedSeats = flight.bookedSeats.filter((s) => !booking.selectedSeats?.includes(s));
        if (booking.travelClass === 'Business') {
          flight.availableSeatsBusiness += booking.passengersCount;
        } else {
          flight.availableSeatsEconomy += booking.passengersCount;
        }
      }
    } else if (booking.category === 'bus' && booking.selectedSeats) {
      const bus = store.buses.find((b) => b.id === booking.serviceNumber || b.operator === booking.serviceName);
      if (bus) {
        bus.bookedSeats = bus.bookedSeats.filter((s) => !booking.selectedSeats?.includes(s));
      }
    } else if (booking.category === 'train' && booking.selectedSeats) {
      const train = store.trains.find((t) => t.trainNumber === booking.serviceNumber);
      if (train && booking.travelClass && train.bookedSeatsByClass[booking.travelClass]) {
        train.bookedSeatsByClass[booking.travelClass] = train.bookedSeatsByClass[booking.travelClass].filter(
          (s) => !booking.selectedSeats?.includes(s)
        );
      }
    }

    saveStoreToFile();
    return { booking, alreadyCancelled: false };
  },

  // Services
  getFlights: () => store.flights,
  getFlightById: (id: string) => store.flights.find((f) => f.id === id),
  reserveFlightSeats: (flightId: string, seats: string[], travelClass: string) => {
    const flight = store.flights.find((f) => f.id === flightId);
    if (!flight) return { success: false, message: 'Flight not found' };
    const conflict = seats.find((s) => flight.bookedSeats.includes(s));
    if (conflict) {
      return { success: false, message: `Seat ${conflict} is already booked. Please choose another seat.` };
    }
    flight.bookedSeats.push(...seats);
    if (travelClass === 'Business') {
      flight.availableSeatsBusiness = Math.max(0, flight.availableSeatsBusiness - seats.length);
    } else {
      flight.availableSeatsEconomy = Math.max(0, flight.availableSeatsEconomy - seats.length);
    }
    saveStoreToFile();
    return { success: true };
  },

  getBuses: () => store.buses,
  getBusById: (id: string) => store.buses.find((b) => b.id === id),
  reserveBusSeats: (busId: string, seats: string[]) => {
    const bus = store.buses.find((b) => b.id === busId);
    if (!bus) return { success: false, message: 'Bus service not found' };
    const conflict = seats.find((s) => bus.bookedSeats.includes(s));
    if (conflict) {
      return { success: false, message: `Seat ${conflict} is already reserved. Please select another seat.` };
    }
    bus.bookedSeats.push(...seats);
    saveStoreToFile();
    return { success: true };
  },

  getCabs: () => store.cabs,
  getCabById: (id: string) => store.cabs.find((c) => c.id === id),

  getHotels: () => store.hotels,
  getHotelById: (id: string) => store.hotels.find((h) => h.id === id),
  reserveHotelRoom: (hotelId: string, roomId: string, checkIn: string, checkOut: string, roomCount: number) => {
    const hotel = store.hotels.find((h) => h.id === hotelId);
    if (!hotel) return { success: false, message: 'Hotel not found' };
    const room = hotel.roomTypes.find((r) => r.id === roomId);
    if (!room) return { success: false, message: 'Room type not found' };
    if (room.availableRooms < roomCount) {
      return { success: false, message: `Only ${room.availableRooms} rooms available for the selected type.` };
    }
    room.availableRooms -= roomCount;
    saveStoreToFile();
    return { success: true };
  },

  getMetro: () => store.metro,
  getMetroById: (id: string) => store.metro.find((m) => m.id === id),

  getTrains: () => store.trains,
  getTrainById: (id: string) => store.trains.find((t) => t.id === id),
  reserveTrainSeats: (trainId: string, classCode: string, seats: string[]) => {
    const train = store.trains.find((t) => t.id === trainId);
    if (!train) return { success: false, message: 'Train not found' };
    if (!train.bookedSeatsByClass[classCode]) {
      train.bookedSeatsByClass[classCode] = [];
    }
    const currentBooked = train.bookedSeatsByClass[classCode];
    const conflict = seats.find((s) => currentBooked.includes(s));
    if (conflict) {
      return { success: false, message: `Berth/Seat ${conflict} is already booked in class ${classCode}.` };
    }
    currentBooked.push(...seats);
    const cls = train.classes.find((c) => c.code === classCode);
    if (cls) {
      cls.availableSeats = Math.max(0, cls.availableSeats - seats.length);
    }
    saveStoreToFile();
    return { success: true };
  },

  // Offers
  getOffers: () => store.offers.filter((o) => o.active),
  getOfferByCode: (code: string) => store.offers.find((o) => o.code.toUpperCase() === code.toUpperCase() && o.active),

  // Notifications
  getUserNotifications: (userId: string) => store.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  createNotification: (notif: NotificationDocument) => {
    store.notifications.unshift(notif);
    saveStoreToFile();
    return notif;
  },
  markNotificationRead: (id: string, userId: string) => {
    const n = store.notifications.find((notif) => notif.id === id && notif.userId === userId);
    if (n) {
      n.isRead = true;
      saveStoreToFile();
      return true;
    }
    return false;
  },
  markAllNotificationsRead: (userId: string) => {
    let count = 0;
    store.notifications.forEach((n) => {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    if (count > 0) saveStoreToFile();
    return count;
  },

  // Support Tickets
  getUserSupportTickets: (userId: string) => store.supportTickets.filter((t) => t.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  createSupportTicket: (ticket: SupportTicketDocument) => {
    store.supportTickets.unshift(ticket);
    saveStoreToFile();
    return ticket;
  },
};
