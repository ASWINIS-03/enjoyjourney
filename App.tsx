import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/common/Header';
import { NavigationBox, ActivePage } from './components/common/NavigationBox';
import { TravelSearchBox } from './components/search/TravelSearchBox';
import { LandingHero } from './components/home/LandingHero';
import { PopularDestinations } from './components/home/PopularDestinations';
import { TravelServicesSection } from './components/home/TravelServicesSection';
import { SpecialOffersSection } from './components/home/SpecialOffersSection';
import { FlightBookingView } from './components/booking/FlightBookingView';
import { BusBookingView } from './components/booking/BusBookingView';
import { CabBookingView } from './components/booking/CabBookingView';
import { HotelBookingView } from './components/booking/HotelBookingView';
import { MetroBookingView } from './components/booking/MetroBookingView';
import { TrainBookingView } from './components/booking/TrainBookingView';
import { BookingCheckoutModal } from './components/booking/BookingCheckoutModal';
import { BookingSuccessModal } from './components/booking/BookingSuccessModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { Footer } from './components/common/Footer';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { DashboardPage } from './pages/DashboardPage';
import { OffersPage } from './pages/OffersPage';
import { CustomerSupportPage } from './pages/CustomerSupportPage';
import { ProfilePage } from './pages/ProfilePage';
import {
  TravelCategory,
  Booking,
  PopularDestination,
  FlightItem,
  BusItem,
  CabItem,
  HotelItem,
  MetroItem,
  TrainItem,
} from './types/travel';
import { api } from './services/api';
import { Compass } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory>('flight');

  // Search Data State
  const [destinations, setDestinations] = useState<PopularDestination[]>([]);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [buses, setBuses] = useState<BusItem[]>([]);
  const [cabs, setCabs] = useState<CabItem[]>([]);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [metroLines, setMetroLines] = useState<MetroItem[]>([]);
  const [trains, setTrains] = useState<TrainItem[]>([]);

  // Search Parameters
  const [currentSearchParams, setCurrentSearchParams] = useState<any>({
    from: 'Chennai',
    to: 'Delhi',
    destination: 'Ooty',
  });

  // Booking Flow Modals
  const [checkoutData, setCheckoutData] = useState<any | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [destRes, flRes, busRes, cabRes, htRes, mtRes, trRes] = await Promise.all([
          api.getDestinations().catch(() => ({ destinations: [] })),
          api.getFlights().catch(() => ({ flights: [] })),
          api.getBuses().catch(() => ({ buses: [] })),
          api.getCabs().catch(() => ({ cabs: [] })),
          api.getHotels().catch(() => ({ hotels: [] })),
          api.getMetro().catch(() => ({ metroLines: [] })),
          api.getTrains().catch(() => ({ trains: [] })),
        ]);

        setDestinations(destRes.destinations || []);
        setFlights(flRes.flights || []);
        setBuses(busRes.buses || []);
        setCabs(cabRes.cabs || []);
        setHotels(htRes.hotels || []);
        setMetroLines(mtRes.metroLines || []);
        setTrains(trRes.trains || []);
      } catch (err) {
        console.error('Initial data loading error:', err);
      }
    };

    loadInitialData();
  }, []);

  // Handle Dynamic Search Submission
  const handleSearch = async (category: TravelCategory, params: any) => {
    setCurrentSearchParams(params);
    setSelectedCategory(category);

    try {
      if (category === 'flight') {
        const res = await api.getFlights(params);
        setFlights(res.flights);
        setActivePage('flights');
      } else if (category === 'bus') {
        const res = await api.getBuses(params);
        setBuses(res.buses);
        setActivePage('buses');
      } else if (category === 'cab') {
        const res = await api.getCabs(params);
        setCabs(res.cabs);
        setActivePage('cabs');
      } else if (category === 'hotel') {
        const res = await api.getHotels(params);
        setHotels(res.hotels);
        setActivePage('hotels');
      } else if (category === 'metro') {
        const res = await api.getMetro(params);
        setMetroLines(res.metroLines);
        setActivePage('metro');
      } else if (category === 'train') {
        const res = await api.getTrains(params);
        setTrains(res.trains);
        setActivePage('trains');
      }
    } catch (err) {
      console.error('Search request failed:', err);
    }
  };

  // Handle Destination Card Click
  const handleSelectDestination = (dest: PopularDestination) => {
    setCurrentSearchParams({
      ...dest.searchParams,
      destination: dest.name,
      city: dest.name,
    });
    setSelectedCategory(dest.defaultCategory);
    handleSearch(dest.defaultCategory, {
      ...dest.searchParams,
      destination: dest.name,
      city: dest.name,
    });
  };

  // If loading session, display branding splash
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-3 animate-pulse shadow-lg">
          <Compass className="w-7 h-7 text-teal-400 animate-spin" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          Enjoy<span className="text-teal-400">Journey</span>
        </span>
        <p className="text-xs text-slate-400 mt-1 font-medium">Explore More. Travel Better.</p>
      </div>
    );
  }

  // Display authentication page first if not signed in (Prompt Section 3)
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* 1. Header with branding, notifications, and profile */}
      <Header
        onOpenProfile={() => setActivePage('profile')}
        onOpenDashboard={() => setActivePage('dashboard')}
      />

      {/* 2. Strictly Separate Navigation Box */}
      <NavigationBox
        activePage={activePage}
        onSelectPage={(page) => {
          setActivePage(page);
          if (
            page === 'flights' ||
            page === 'buses' ||
            page === 'cabs' ||
            page === 'hotels' ||
            page === 'metro' ||
            page === 'trains'
          ) {
            setSelectedCategory(page.replace('s', '') as TravelCategory);
          }
        }}
      />

      {/* 3. Main Dynamic Content Area */}
      <main className="flex-1">
        {/* VIEW A: HOME LANDING PAGE */}
        {activePage === 'home' && (
          <div className="space-y-6">
            <LandingHero
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
              onExploreOffers={() => setActivePage('offers')}
              onOpenDashboard={() => setActivePage('dashboard')}
            />

            {/* Strictly Separate Travel Search Box below navigation */}
            <TravelSearchBox
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onSearch={handleSearch}
              initialParams={currentSearchParams}
            />

            <PopularDestinations
              destinations={destinations}
              onSelectDestination={handleSelectDestination}
            />

            <TravelServicesSection
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
            />

            <SpecialOffersSection onViewOffers={() => setActivePage('offers')} />
          </div>
        )}

        {/* VIEW: TRAVELER & BOOKING DASHBOARD */}
        {activePage === 'dashboard' && (
          <DashboardPage
            onNavigate={(page) => setActivePage(page)}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
            }}
            onOpenBookingVoucher={(b) => setConfirmedBooking(b)}
          />
        )}

        {/* VIEW B: FLIGHTS SEARCH & SEATS */}
        {activePage === 'flights' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
            <TravelSearchBox
              selectedCategory="flight"
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
              onSearch={handleSearch}
              initialParams={currentSearchParams}
            />
            <FlightBookingView
              flights={flights}
              searchParams={currentSearchParams}
              onInitiateBooking={(flight, seats, tClass, base) => {
                setCheckoutData({
                  category: 'flight',
                  serviceId: flight.id,
                  serviceName: flight.airline,
                  serviceNumber: flight.flightNumber,
                  origin: flight.fromCity,
                  destination: flight.toCity,
                  travelDate: currentSearchParams.date || '2026-11-01',
                  departureTime: flight.departureTime,
                  arrivalTime: flight.arrivalTime,
                  passengersCount: seats.length || Number(currentSearchParams.passengers) || 1,
                  selectedSeats: seats,
                  travelClass: tClass,
                  baseAmount: base,
                });
              }}
            />
          </div>
        )}

        {/* VIEW C: BUSES SEARCH & SEATS */}
        {activePage === 'buses' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
            <TravelSearchBox
              selectedCategory="bus"
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
              onSearch={handleSearch}
              initialParams={currentSearchParams}
            />
            <BusBookingView
              buses={buses}
              searchParams={currentSearchParams}
              onInitiateBooking={(bus, seats, base) => {
                setCheckoutData({
                  category: 'bus',
                  serviceId: bus.id,
                  serviceName: bus.operator,
                  serviceNumber: bus.busType,
                  origin: bus.fromCity,
                  destination: bus.toCity,
                  travelDate: currentSearchParams.date || '2026-11-01',
                  departureTime: bus.departureTime,
                  arrivalTime: bus.arrivalTime,
                  passengersCount: seats.length || Number(currentSearchParams.passengers) || 1,
                  selectedSeats: seats,
                  baseAmount: base,
                });
              }}
            />
          </div>
        )}

        {/* VIEW D: CABS SEARCH */}
        {activePage === 'cabs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
            <TravelSearchBox
              selectedCategory="cab"
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
              onSearch={handleSearch}
              initialParams={currentSearchParams}
            />
            <CabBookingView
              cabs={cabs}
              searchParams={currentSearchParams}
              onInitiateBooking={(cab, base) => {
                setCheckoutData({
                  category: 'cab',
                  serviceId: cab.id,
                  serviceName: `${cab.cabType} - ${cab.modelName}`,
                  serviceNumber: cab.cabType,
                  origin: currentSearchParams.pickup || 'Chennai Airport (MAA)',
                  destination: currentSearchParams.drop || 'OMR IT Corridor, Chennai',
                  travelDate: currentSearchParams.date || '2026-11-01',
                  departureTime: currentSearchParams.time || '10:00 AM',
                  passengersCount: Number(currentSearchParams.passengers) || 2,
                  cabType: cab.cabType,
                  baseAmount: base,
                });
              }}
            />
          </div>
        )}

        {/* VIEW E: HOTELS SEARCH & ROOMS */}
        {activePage === 'hotels' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
            <TravelSearchBox
              selectedCategory="hotel"
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
              onSearch={handleSearch}
              initialParams={currentSearchParams}
            />
            <HotelBookingView
              hotels={hotels}
              searchParams={currentSearchParams}
              onInitiateBooking={(hotel, roomType, nights, rooms, base) => {
                setCheckoutData({
                  category: 'hotel',
                  serviceId: hotel.id,
                  serviceName: hotel.name,
                  origin: hotel.city,
                  destination: hotel.locationDetails,
                  checkInDate: currentSearchParams.checkIn || '2026-11-01',
                  checkOutDate: currentSearchParams.checkOut || '2026-11-03',
                  nightsCount: nights,
                  passengersCount: rooms,
                  roomType,
                  baseAmount: base,
                });
              }}
            />
          </div>
        )}

        {/* VIEW F: METRO TRAIN */}
        {activePage === 'metro' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
            <TravelSearchBox
              selectedCategory="metro"
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
              onSearch={handleSearch}
              initialParams={currentSearchParams}
            />
            <MetroBookingView
              metroLines={metroLines}
              searchParams={currentSearchParams}
              onInitiateBooking={(line, ticketType, base) => {
                setCheckoutData({
                  category: 'metro',
                  serviceId: line.id,
                  serviceName: `${line.systemName} - ${line.lineName}`,
                  origin: currentSearchParams.fromStation || 'Chennai Central',
                  destination: currentSearchParams.toStation || 'Airport',
                  travelDate: currentSearchParams.date || '2026-11-01',
                  departureTime: 'Immediate Boarding',
                  passengersCount: Number(currentSearchParams.passengers) || 1,
                  baseAmount: base,
                });
              }}
            />
          </div>
        )}

        {/* VIEW G: TRAINS SEARCH & COACHES */}
        {activePage === 'trains' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
            <TravelSearchBox
              selectedCategory="train"
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
              }}
              onSearch={handleSearch}
              initialParams={currentSearchParams}
            />
            <TrainBookingView
              trains={trains}
              searchParams={currentSearchParams}
              onInitiateBooking={(train, cls, berths, base) => {
                setCheckoutData({
                  category: 'train',
                  serviceId: train.id,
                  serviceName: train.trainName,
                  serviceNumber: train.trainNumber,
                  origin: train.fromStation,
                  destination: train.toStation,
                  travelDate: currentSearchParams.date || '2026-11-01',
                  departureTime: train.departureTime,
                  arrivalTime: train.arrivalTime,
                  passengersCount: berths.length || Number(currentSearchParams.passengers) || 1,
                  selectedSeats: berths,
                  travelClass: cls,
                  baseAmount: base,
                });
              }}
            />
          </div>
        )}

        {/* VIEW H: MY BOOKING ORDERS */}
        {activePage === 'bookings' && <MyBookingsPage />}

        {/* VIEW I: OFFERS & CONCESSIONS */}
        {activePage === 'offers' && (
          <OffersPage
            onNavigateToCategory={(cat) => {
              setSelectedCategory(cat);
              setActivePage((cat + (cat === 'metro' ? '' : 's')) as ActivePage);
            }}
          />
        )}

        {/* VIEW J: CUSTOMER SUPPORT */}
        {activePage === 'support' && <CustomerSupportPage />}

        {/* VIEW K: MY PROFILE */}
        {activePage === 'profile' && <ProfilePage />}
      </main>

      {/* 4. Booking Checkout Modal */}
      {checkoutData && (
        <BookingCheckoutModal
          {...checkoutData}
          onClose={() => setCheckoutData(null)}
          onSuccess={(b) => {
            setCheckoutData(null);
            setConfirmedBooking(b);
          }}
        />
      )}

      {/* 5. Booking Confirmation & Celebration Voucher Modal */}
      {confirmedBooking && (
        <BookingSuccessModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onViewOrders={() => {
            setConfirmedBooking(null);
            setActivePage('bookings');
          }}
        />
      )}

      {/* 6. Notifications Slide-Over Drawer */}
      <NotificationDrawer
        onNavigateToBookings={() => {
          setActivePage('bookings');
        }}
      />

      {/* 7. Footer */}
      <Footer onNavigate={(page) => setActivePage(page)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
