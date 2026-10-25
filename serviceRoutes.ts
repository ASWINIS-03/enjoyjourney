import express from 'express';
import { dbStore } from '../db.js';

const router = express.Router();

export const POPULAR_DESTINATIONS = [
  {
    id: 'dest-ooty',
    name: 'Ooty',
    tagline: 'Queen of Hill Stations',
    state: 'Tamil Nadu',
    category: 'Mountains & Tea Gardens',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Breathtaking Nilgiri mountain railway, aromatic tea estates, lush pine forests, and misty valleys.',
    defaultCategory: 'hotel',
    searchParams: { city: 'Ooty', from: 'Chennai', to: 'Ooty' },
  },
  {
    id: 'dest-kodai',
    name: 'Kodaikanal',
    tagline: 'Princess of Hill Stations',
    state: 'Tamil Nadu',
    category: 'Lakes & Waterfalls',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    description: 'Star-shaped serene Kodai Lake, Pillar Rocks, Bryant Park, and tranquil eucalyptus mountain trails.',
    defaultCategory: 'hotel',
    searchParams: { city: 'Kodaikanal', from: 'Madurai', to: 'Kodaikanal' },
  },
  {
    id: 'dest-madurai',
    name: 'Madurai',
    tagline: 'The Soul of Ancient Tamil Culture',
    state: 'Tamil Nadu',
    category: 'Heritage & Temples',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'World-famous Meenakshi Amman Temple with towering sculpted gopurams, rich jasmine markets, and culinary delights.',
    defaultCategory: 'train',
    searchParams: { city: 'Madurai', from: 'Chennai', to: 'Madurai' },
  },
  {
    id: 'dest-chennai',
    name: 'Chennai',
    tagline: 'Gateway to South India',
    state: 'Tamil Nadu',
    category: 'Beaches & Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description: 'Marina Beach breezes, historic San Thome Cathedral, vibrant Carnatic art, and bustling metro hubs.',
    defaultCategory: 'flight',
    searchParams: { city: 'Chennai', from: 'Delhi', to: 'Chennai' },
  },
  {
    id: 'dest-coimbatore',
    name: 'Coimbatore',
    tagline: 'Manchester of South India',
    state: 'Tamil Nadu',
    category: 'Hill Gateways & Temples',
    imageUrl: 'https://images.unsplash.com/photo-1609137144822-26154e195f13?auto=format&fit=crop&w=800&q=80',
    description: 'Adiyogi Shiva statue, foothill breezes of the Western Ghats, textile heritage, and tasty Siruvani water.',
    defaultCategory: 'bus',
    searchParams: { city: 'Coimbatore', from: 'Chennai', to: 'Coimbatore' },
  },
  {
    id: 'dest-blr',
    name: 'Bengaluru',
    tagline: 'Silicon Valley & Garden City',
    state: 'Karnataka',
    category: 'Parks & Tech Metros',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    description: 'Lush Lalbagh Botanical Garden, historic Bangalore Palace, craft cafes, and dynamic Purple Line Metro.',
    defaultCategory: 'train',
    searchParams: { city: 'Bengaluru', from: 'Chennai', to: 'Bengaluru' },
  },
  {
    id: 'dest-hyd',
    name: 'Hyderabad',
    tagline: 'City of Pearls & Nizams',
    state: 'Telangana',
    category: 'Monuments & Cuisine',
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Charminar, Golconda Fort echoes, world-renowned Hyderabadi Dum Biryani, and Hussain Sagar lake.',
    defaultCategory: 'flight',
    searchParams: { city: 'Hyderabad', from: 'Chennai', to: 'Hyderabad' },
  },
  {
    id: 'dest-delhi',
    name: 'Delhi',
    tagline: 'The Heart of the Nation',
    state: 'Delhi NCR',
    category: 'Heritage & Capitals',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    description: 'India Gate, Red Fort, Humayun Tomb, bustling Chandni Chowk lanes, and world-class metro connectivity.',
    defaultCategory: 'flight',
    searchParams: { city: 'Delhi', from: 'Chennai', to: 'Delhi' },
  },
  {
    id: 'dest-mumbai',
    name: 'Mumbai',
    tagline: 'City of Dreams',
    state: 'Maharashtra',
    category: 'Coastline & Glamour',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    description: 'The historic Gateway of India, glittering Queen Necklace at Marine Drive, Bollywood energy, and Arabian Sea sunsets.',
    defaultCategory: 'flight',
    searchParams: { city: 'Mumbai', from: 'Chennai', to: 'Mumbai' },
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    tagline: 'Sun, Sand & Portuguese Charm',
    state: 'Goa',
    category: 'Beaches & Nightlife',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Golden palm-fringed sands at Calangute and Baga, ancient churches of Old Goa, beach shacks, and water sports.',
    defaultCategory: 'hotel',
    searchParams: { city: 'Goa', from: 'Bengaluru', to: 'Goa' },
  },
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    tagline: 'The Pink City of Royalty',
    state: 'Rajasthan',
    category: 'Palaces & Forts',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'Honeycomb facade of Hawa Mahal, majestic Amer Fort hill views, City Palace courtyards, and vibrant bazaars.',
    defaultCategory: 'hotel',
    searchParams: { city: 'Jaipur', from: 'Delhi', to: 'Jaipur' },
  },
  {
    id: 'dest-kerala',
    name: 'Kerala',
    tagline: 'Gods Own Country',
    state: 'Kerala',
    category: 'Backwaters & Ayurvedic Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Tranquil houseboat cruises on Alleppey backwaters, tea plantations of Munnar, and authentic Ayurvedic wellness.',
    defaultCategory: 'hotel',
    searchParams: { city: 'Kerala', from: 'Chennai', to: 'Kerala' },
  },
];

// 1. Popular Destinations
router.get('/destinations', (req, res) => {
  return res.json({
    destinations: POPULAR_DESTINATIONS,
    isDemoData: true,
  });
});

// 2. Flight Search
router.get('/flights', (req, res) => {
  const { from, to, date, travelClass, passengers } = req.query;
  let flights = dbStore.getFlights();

  if (from) {
    const f = String(from).toLowerCase().trim();
    flights = flights.filter((item) => item.fromCity.toLowerCase().includes(f) || item.fromCode.toLowerCase().includes(f));
  }
  if (to) {
    const t = String(to).toLowerCase().trim();
    flights = flights.filter((item) => item.toCity.toLowerCase().includes(t) || item.toCode.toLowerCase().includes(t));
  }

  return res.json({
    flights,
    searchParams: { from, to, date, travelClass, passengers },
    isDemoData: true,
    disclaimer: 'Demonstration flight schedules and fares. Connect to airline GDS/NDCs for live reservations.',
  });
});

// 3. Bus Search
router.get('/buses', (req, res) => {
  const { from, to, date } = req.query;
  let buses = dbStore.getBuses();

  if (from) {
    const f = String(from).toLowerCase().trim();
    buses = buses.filter((b) => b.fromCity.toLowerCase().includes(f));
  }
  if (to) {
    const t = String(to).toLowerCase().trim();
    buses = buses.filter((b) => b.toCity.toLowerCase().includes(t));
  }

  return res.json({
    buses,
    searchParams: { from, to, date },
    isDemoData: true,
    disclaimer: 'Demonstration bus schedules and seat layouts.',
  });
});

// 4. Cab Search
router.get('/cabs', (req, res) => {
  const { pickup, drop, tripType, cabType } = req.query;
  let cabs = dbStore.getCabs();

  if (cabType) {
    cabs = cabs.filter((c) => c.cabType.toLowerCase() === String(cabType).toLowerCase());
  }

  return res.json({
    cabs,
    searchParams: { pickup, drop, tripType, cabType },
    isDemoData: true,
    disclaimer: 'Demonstration cab rates and vehicle classifications.',
  });
});

// 5. Hotel Search
router.get('/hotels', (req, res) => {
  const { destination, city, checkIn, checkOut, rooms, guests } = req.query;
  let hotels = dbStore.getHotels();

  const queryLoc = String(destination || city || '').toLowerCase().trim();
  if (queryLoc) {
    hotels = hotels.filter((h) => h.city.toLowerCase().includes(queryLoc) || h.locationDetails.toLowerCase().includes(queryLoc) || h.name.toLowerCase().includes(queryLoc));
  }

  return res.json({
    hotels,
    searchParams: { destination: destination || city, checkIn, checkOut, rooms, guests },
    isDemoData: true,
    disclaimer: 'Demonstration hotel inventory, amenities, and pricing.',
  });
});

// 6. Metro Search
router.get('/metro', (req, res) => {
  const { city, fromStation, toStation } = req.query;
  let metroLines = dbStore.getMetro();

  if (city) {
    metroLines = metroLines.filter((m) => m.city.toLowerCase().includes(String(city).toLowerCase()));
  }

  return res.json({
    metroLines,
    searchParams: { city, fromStation, toStation },
    isDemoData: true,
    disclaimer: 'Demonstration metro routes, timetables, and station charts.',
  });
});

// 7. Train Search
router.get('/trains', (req, res) => {
  const { fromStation, toStation, date, travelClass } = req.query;
  let trains = dbStore.getTrains();

  if (fromStation) {
    const f = String(fromStation).toLowerCase().trim();
    trains = trains.filter((t) => t.fromStation.toLowerCase().includes(f));
  }
  if (toStation) {
    const target = String(toStation).toLowerCase().trim();
    trains = trains.filter((trainItem) => trainItem.toStation.toLowerCase().includes(target));
  }

  return res.json({
    trains,
    searchParams: { fromStation, toStation, date, travelClass },
    isDemoData: true,
    disclaimer: 'Demonstration railway schedules, classes, and coach availability.',
  });
});

// 8. Interactive Seat Maps and Inventory
router.get('/seat-map/:category/:id', (req, res) => {
  const { category, id } = req.params;

  if (category === 'flight') {
    const flight = dbStore.getFlightById(id);
    if (!flight) return res.status(404).json({ error: 'Flight not found.' });

    // 6 rows of 6 seats: 1A-6F (Row 1-2 Business, Row 3-6 Economy)
    const rows = ['1', '2', '3', '4', '5', '6'];
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seats = [];

    for (const r of rows) {
      for (const c of cols) {
        const seatId = `${r}${c}`;
        const isBusiness = r === '1' || r === '2';
        const isBooked = flight.bookedSeats.includes(seatId);
        seats.push({
          seatId,
          row: r,
          column: c,
          travelClass: isBusiness ? 'Business' : 'Economy',
          price: isBusiness ? flight.priceBusiness : flight.priceEconomy,
          isBooked,
          type: c === 'A' || c === 'F' ? 'Window' : c === 'C' || c === 'D' ? 'Aisle' : 'Middle',
        });
      }
    }

    return res.json({ serviceId: id, category, bookedSeats: flight.bookedSeats, seats });
  }

  if (category === 'bus') {
    const bus = dbStore.getBusById(id);
    if (!bus) return res.status(404).json({ error: 'Bus not found.' });

    // 15 berths: Lower deck (L1-L15) and Upper deck (U1-U15)
    const seats = [];
    for (let i = 1; i <= 15; i++) {
      const lowerId = `L${i}`;
      const upperId = `U${i}`;
      seats.push({
        seatId: lowerId,
        deck: 'Lower Deck',
        price: bus.pricePerSeat,
        isBooked: bus.bookedSeats.includes(lowerId),
        type: i % 3 === 1 ? 'Single Window' : 'Double Berth',
      });
      seats.push({
        seatId: upperId,
        deck: 'Upper Deck',
        price: bus.pricePerSeat,
        isBooked: bus.bookedSeats.includes(upperId),
        type: i % 3 === 1 ? 'Single Window' : 'Double Berth',
      });
    }

    return res.json({ serviceId: id, category, bookedSeats: bus.bookedSeats, seats });
  }

  if (category === 'train') {
    const train = dbStore.getTrainById(id);
    if (!train) return res.status(404).json({ error: 'Train not found.' });

    return res.json({
      serviceId: id,
      category,
      classes: train.classes,
      bookedSeatsByClass: train.bookedSeatsByClass,
    });
  }

  return res.status(400).json({ error: 'Unsupported category for seat map.' });
});

export default router;
