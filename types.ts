export interface UserDocument {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  passwordHash: string;
  isEmailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: string;
  resetPasswordCode?: string;
  resetPasswordExpires?: string;
  city?: string;
  emergencyContact?: string;
  claimedOffers?: string[]; // Array of offer codes claimed
  createdAt: string;
  updatedAt: string;
}

export interface BookingDocument {
  id: string;
  bookingReference: string; // e.g. EJ-FL-83921
  userId: string;
  userEmail: string;
  userName: string;
  userMobile: string;
  category: 'flight' | 'bus' | 'cab' | 'hotel' | 'metro' | 'train';
  serviceName: string; // e.g. "IndiGo 6E-204" or "Ooty Hillview Resort"
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
  passengers: Array<{
    name: string;
    age?: number;
    gender?: string;
    seatOrBerth?: string;
  }>;
  selectedSeats?: string[];
  travelClass?: string;
  roomType?: string;
  cabType?: string;
  baseAmount: number;
  taxesAmount: number;
  discountAmount: number;
  discountCode?: string;
  totalAmount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  cancellationReason?: string;
  cancelledAt?: string;
  qrCodeData?: string;
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfferDocument {
  id: string;
  code: string;
  title: string;
  category: 'Senior Citizens' | 'Doctors' | 'Students' | 'Army Officers and Defence Personnel' | 'Police Officers' | 'Regular Customers';
  discountPercent: number;
  maxDiscount: number;
  minBookingAmount: number;
  description: string;
  eligibilityCriteria: string;
  applicableServices: string[];
  badgeColor: string;
  iconName: string;
  isDemoOffer: boolean;
  active: boolean;
}

export interface NotificationDocument {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'booking' | 'offer' | 'support' | 'account';
  bookingReference?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicketDocument {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: 'Booking' | 'Cancellation & Refund' | 'Seat Selection' | 'Offers & Discounts' | 'Payment Query' | 'General';
  bookingReference?: string;
  subject: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  adminResponse?: string;
  createdAt: string;
}

export interface FlightServiceDocument {
  id: string;
  airline: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  priceEconomy: number;
  priceBusiness: number;
  availableSeatsEconomy: number;
  availableSeatsBusiness: number;
  bookedSeats: string[]; // e.g. ['1A', '2B']
  aircraftType: string;
  imageUrl: string;
}

export interface BusServiceDocument {
  id: string;
  operator: string;
  busType: string; // e.g. "Volvo Multi-Axle AC Sleeper"
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  pricePerSeat: number;
  totalSeats: number;
  bookedSeats: string[]; // e.g. ['L1', 'L2', 'U5']
  rating: number;
  amenities: string[];
  imageUrl: string;
}

export interface CabServiceDocument {
  id: string;
  cabType: 'Sedan' | 'SUV' | 'Hatchback' | 'Luxury';
  modelName: string; // e.g. "Maruti Suzuki Dzire", "Toyota Innova Crysta"
  capacity: number;
  luggageCapacity: number;
  baseFare: number;
  perKmRate: number;
  acAvailable: boolean;
  rating: number;
  imageUrl: string;
  sampleRoutes: Array<{
    pickup: string;
    drop: string;
    estimatedKm: number;
    estimatedFare: number;
  }>;
}

export interface HotelDocument {
  id: string;
  name: string;
  city: string;
  locationDetails: string;
  starRating: number;
  ratingScore: number;
  reviewsCount: number;
  pricePerNight: number;
  roomTypes: Array<{
    id: string;
    name: string;
    pricePerNight: number;
    capacity: number;
    availableRooms: number;
    bedType: string;
  }>;
  amenities: string[];
  imageUrl: string;
  images: string[];
  bookedRoomDates: Record<string, string[]>; // roomId -> array of booked YYYY-MM-DD
}

export interface MetroServiceDocument {
  id: string;
  city: string;
  systemName: string; // e.g. "Chennai Metro", "Namma Metro Bengaluru"
  lineName: string; // e.g. "Blue Line", "Green Line"
  lineColor: string;
  stations: string[];
  frequencyMinutes: number;
  operatingHours: string;
  baseFare: number;
  maxFare: number;
  imageUrl: string;
}

export interface TrainServiceDocument {
  id: string;
  trainNumber: string;
  trainName: string; // e.g. "20607 Vande Bharat Express"
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOnDays: string;
  classes: Array<{
    code: string; // "1A", "2A", "3A", "SL", "CC"
    name: string;
    fare: number;
    availableSeats: number;
  }>;
  bookedSeatsByClass: Record<string, string[]>; // classCode -> seat numbers
  imageUrl: string;
}
