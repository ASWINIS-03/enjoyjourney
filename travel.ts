export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  isEmailVerified: boolean;
  city?: string;
  emergencyContact?: string;
  claimedOffers?: string[];
  createdAt: string;
}

export type TravelCategory = 'flight' | 'bus' | 'cab' | 'hotel' | 'metro' | 'train';

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  userEmail: string;
  userName: string;
  userMobile: string;
  category: TravelCategory;
  serviceName: string;
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
}

export interface Offer {
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

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'booking' | 'offer' | 'support' | 'account';
  bookingReference?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: string;
  bookingReference?: string;
  subject: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  adminResponse?: string;
  createdAt: string;
}

export interface PopularDestination {
  id: string;
  name: string;
  tagline: string;
  state: string;
  category: string;
  imageUrl: string;
  description: string;
  defaultCategory: TravelCategory;
  searchParams: {
    city?: string;
    from?: string;
    to?: string;
  };
}

export interface FlightItem {
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
  bookedSeats: string[];
  aircraftType: string;
  imageUrl: string;
}

export interface BusItem {
  id: string;
  operator: string;
  busType: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  pricePerSeat: number;
  totalSeats: number;
  bookedSeats: string[];
  rating: number;
  amenities: string[];
  imageUrl: string;
}

export interface CabItem {
  id: string;
  cabType: 'Sedan' | 'SUV' | 'Hatchback' | 'Luxury';
  modelName: string;
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

export interface HotelItem {
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
}

export interface MetroItem {
  id: string;
  city: string;
  systemName: string;
  lineName: string;
  lineColor: string;
  stations: string[];
  frequencyMinutes: number;
  operatingHours: string;
  baseFare: number;
  maxFare: number;
  imageUrl: string;
}

export interface TrainItem {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOnDays: string;
  classes: Array<{
    code: string;
    name: string;
    fare: number;
    availableSeats: number;
  }>;
  bookedSeatsByClass: Record<string, string[]>;
  imageUrl: string;
}
