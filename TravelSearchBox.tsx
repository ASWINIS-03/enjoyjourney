import React, { useState } from 'react';
import {
  Plane,
  Bus,
  Car,
  Building2,
  TramFront,
  Train,
  Calendar,
  Users,
  MapPin,
  Clock,
  Search,
  Sparkles,
  ArrowRightLeft,
  AlertCircle,
} from 'lucide-react';
import { TravelCategory } from '../../types/travel';

interface TravelSearchBoxProps {
  selectedCategory: TravelCategory;
  onSelectCategory: (cat: TravelCategory) => void;
  onSearch: (category: TravelCategory, searchParams: any) => void;
  initialParams?: any;
}

export const TravelSearchBox: React.FC<TravelSearchBoxProps> = ({
  selectedCategory,
  onSelectCategory,
  onSearch,
  initialParams = {},
}) => {
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [errorMessage, setErrorMessage] = useState('');

  // Flight Fields
  const [flightFrom, setFlightFrom] = useState(initialParams.from || 'Chennai (MAA)');
  const [flightTo, setFlightTo] = useState(initialParams.to || 'Delhi (DEL)');
  const [flightDepart, setFlightDepart] = useState('2026-11-01');
  const [flightReturn, setFlightReturn] = useState('2026-11-08');
  const [flightPassengers, setFlightPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('Economy');

  // Bus Fields
  const [busFrom, setBusFrom] = useState(initialParams.from || 'Chennai');
  const [busTo, setBusTo] = useState(initialParams.to || 'Madurai');
  const [busDate, setBusDate] = useState('2026-11-01');
  const [busTime, setBusTime] = useState('09:30 PM');
  const [busPassengers, setBusPassengers] = useState(1);
  const [busTypePreference, setBusTypePreference] = useState('AC Sleeper');

  // Cab Fields
  const [cabPickup, setCabPickup] = useState(initialParams.from || 'Chennai Airport (MAA)');
  const [cabDrop, setCabDrop] = useState(initialParams.to || 'OMR IT Corridor, Chennai');
  const [cabDate, setCabDate] = useState('2026-11-01');
  const [cabTime, setCabTime] = useState('10:00 AM');
  const [cabTripType, setCabTripType] = useState<'One Way' | 'Round Trip' | 'Local'>('One Way');
  const [cabPassengers, setCabPassengers] = useState(2);
  const [cabType, setCabType] = useState('Sedan');

  // Hotel Fields
  const [hotelDestination, setHotelDestination] = useState(initialParams.city || 'Ooty');
  const [hotelCheckIn, setHotelCheckIn] = useState('2026-11-01');
  const [hotelCheckOut, setHotelCheckOut] = useState('2026-11-03');
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelGuests, setHotelGuests] = useState(2);

  // Metro Fields
  const [metroCity, setMetroCity] = useState('Chennai');
  const [metroFromStation, setMetroFromStation] = useState(initialParams.from || 'Chennai Central');
  const [metroToStation, setMetroToStation] = useState(initialParams.to || 'Chennai International Airport');
  const [metroDate, setMetroDate] = useState('2026-11-01');
  const [metroTime, setMetroTime] = useState('08:30 AM');
  const [metroPassengers, setMetroPassengers] = useState(1);

  // Train Fields
  const [trainFrom, setTrainFrom] = useState(initialParams.from || 'MGR Chennai Central (MAS)');
  const [trainTo, setTrainTo] = useState(initialParams.to || 'KSR Bengaluru City (SBC)');
  const [trainDate, setTrainDate] = useState('2026-11-01');
  const [trainClass, setTrainClass] = useState('CC');
  const [trainPassengers, setTrainPassengers] = useState(1);

  const swapLocations = (type: 'flight' | 'bus' | 'train' | 'metro') => {
    if (type === 'flight') {
      const temp = flightFrom;
      setFlightFrom(flightTo);
      setFlightTo(temp);
    } else if (type === 'bus') {
      const temp = busFrom;
      setBusFrom(busTo);
      setBusTo(temp);
    } else if (type === 'train') {
      const temp = trainFrom;
      setTrainFrom(trainTo);
      setTrainTo(temp);
    } else if (type === 'metro') {
      const temp = metroFromStation;
      setMetroFromStation(metroToStation);
      setMetroToStation(temp);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedCategory === 'flight') {
      if (!flightFrom || !flightTo) {
        setErrorMessage('Please select both Origin and Destination airports.');
        return;
      }
      if (tripType === 'roundtrip' && new Date(flightReturn) <= new Date(flightDepart)) {
        setErrorMessage('Return date must be after departure date.');
        return;
      }
      onSearch('flight', {
        from: flightFrom,
        to: flightTo,
        date: flightDepart,
        returnDate: tripType === 'roundtrip' ? flightReturn : undefined,
        tripType,
        travelClass: flightClass,
        passengers: flightPassengers,
      });
    } else if (selectedCategory === 'bus') {
      if (!busFrom || !busTo) {
        setErrorMessage('Please enter both boarding city and destination.');
        return;
      }
      onSearch('bus', {
        from: busFrom,
        to: busTo,
        date: busDate,
        time: busTime,
        passengers: busPassengers,
        busType: busTypePreference,
      });
    } else if (selectedCategory === 'cab') {
      if (!cabPickup || !cabDrop) {
        setErrorMessage('Please provide both pickup and drop-off locations.');
        return;
      }
      onSearch('cab', {
        pickup: cabPickup,
        drop: cabDrop,
        date: cabDate,
        time: cabTime,
        tripType: cabTripType,
        passengers: cabPassengers,
        cabType,
      });
    } else if (selectedCategory === 'hotel') {
      if (!hotelDestination) {
        setErrorMessage('Please enter destination city or hotel name.');
        return;
      }
      if (new Date(hotelCheckOut) <= new Date(hotelCheckIn)) {
        setErrorMessage('Check-out date must be strictly after Check-in date.');
        return;
      }
      onSearch('hotel', {
        destination: hotelDestination,
        city: hotelDestination,
        checkIn: hotelCheckIn,
        checkOut: hotelCheckOut,
        rooms: hotelRooms,
        guests: hotelGuests,
      });
    } else if (selectedCategory === 'metro') {
      if (!metroFromStation || !metroToStation) {
        setErrorMessage('Please select boarding and destination metro stations.');
        return;
      }
      onSearch('metro', {
        city: metroCity,
        fromStation: metroFromStation,
        toStation: metroToStation,
        date: metroDate,
        time: metroTime,
        passengers: metroPassengers,
      });
    } else if (selectedCategory === 'train') {
      if (!trainFrom || !trainTo) {
        setErrorMessage('Please enter origin and destination railway stations.');
        return;
      }
      onSearch('train', {
        fromStation: trainFrom,
        toStation: trainTo,
        date: trainDate,
        travelClass: trainClass,
        passengers: trainPassengers,
      });
    }
  };

  const serviceTabs: Array<{ id: TravelCategory; label: string; icon: React.ElementType }> = [
    { id: 'flight', label: 'Flights', icon: Plane },
    { id: 'bus', label: 'Buses', icon: Bus },
    { id: 'cab', label: 'Cabs', icon: Car },
    { id: 'hotel', label: 'Hotels', icon: Building2 },
    { id: 'metro', label: 'Metro Train', icon: TramFront },
    { id: 'train', label: 'Trains', icon: Train },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Container Box Visually Distinct from Navigation Bar */}
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-5 sm:p-7 relative overflow-hidden ring-1 ring-slate-700/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Search Box Header & Category Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-700/70 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {serviceTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(tab.id);
                    setErrorMessage('');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-teal-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-teal-300 font-medium bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
              Demonstration Search Engine
            </span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSearchSubmit}>
          {/* CATEGORY 1: FLIGHT SEARCH */}
          {selectedCategory === 'flight' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="flightTrip"
                    checked={tripType === 'oneway'}
                    onChange={() => setTripType('oneway')}
                    className="text-teal-500 focus:ring-teal-400"
                  />
                  <span>One Way</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="flightTrip"
                    checked={tripType === 'roundtrip'}
                    onChange={() => setTripType('roundtrip')}
                    className="text-teal-500 focus:ring-teal-400"
                  />
                  <span>Round Trip</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* From & To with Swap */}
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">From Airport</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={flightFrom}
                      onChange={(e) => setFlightFrom(e.target.value)}
                      placeholder="e.g. Chennai (MAA)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">To Airport</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={flightTo}
                      onChange={(e) => setFlightTo(e.target.value)}
                      placeholder="e.g. Delhi (DEL)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => swapLocations('flight')}
                      title="Swap cities"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-teal-300"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Departure & Return */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {tripType === 'roundtrip' ? 'Depart & Return Dates' : 'Departure Date'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      <input
                        type="date"
                        required
                        value={flightDepart}
                        onChange={(e) => setFlightDepart(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-1 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>
                    {tripType === 'roundtrip' ? (
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        <input
                          type="date"
                          required
                          value={flightReturn}
                          onChange={(e) => setFlightReturn(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-1 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 px-2 text-center text-[11px] text-slate-500 self-center">
                        One Way Trip
                      </div>
                    )}
                  </div>
                </div>

                {/* Class & Passengers */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Class</label>
                    <select
                      value={flightClass}
                      onChange={(e) => setFlightClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Travelers</label>
                    <select
                      value={flightPassengers}
                      onChange={(e) => setFlightPassengers(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                      <option value="5">5 Adults</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sample Routes Prompt */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Sample Routes:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFlightFrom('Chennai (MAA)');
                    setFlightTo('Delhi (DEL)');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300 transition-colors"
                >
                  Chennai &rarr; Delhi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFlightFrom('Chennai (MAA)');
                    setFlightTo('Mumbai (BOM)');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300 transition-colors"
                >
                  Chennai &rarr; Mumbai
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFlightFrom('Chennai (MAA)');
                    setFlightTo('Bengaluru (BLR)');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300 transition-colors"
                >
                  Chennai &rarr; Bengaluru
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Search Flights</span>
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 2: BUS SEARCH */}
          {selectedCategory === 'bus' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">From Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={busFrom}
                      onChange={(e) => setBusFrom(e.target.value)}
                      placeholder="e.g. Chennai (Koyambedu CMBT)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">To Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={busTo}
                      onChange={(e) => setBusTo(e.target.value)}
                      placeholder="e.g. Madurai / Coimbatore"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => swapLocations('bus')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-teal-300"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Journey Date & Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={busDate}
                      onChange={(e) => setBusDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={busTime}
                      onChange={(e) => setBusTime(e.target.value)}
                      placeholder="Time"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Passengers</label>
                    <select
                      value={busPassengers}
                      onChange={(e) => setBusPassengers(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="1">1 Seat</option>
                      <option value="2">2 Seats</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</label>
                    <select
                      value={busTypePreference}
                      onChange={(e) => setBusTypePreference(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="AC Sleeper">AC Sleeper</option>
                      <option value="Semi-Sleeper">Semi-Sleeper</option>
                      <option value="Volvo Multi-Axle">Volvo Multi-Axle</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sample Bus Routes */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Sample Routes:</span>
                <button
                  type="button"
                  onClick={() => {
                    setBusFrom('Chennai');
                    setBusTo('Madurai');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300"
                >
                  Chennai &rarr; Madurai
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBusFrom('Chennai');
                    setBusTo('Coimbatore');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300"
                >
                  Chennai &rarr; Coimbatore
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBusFrom('Chennai');
                    setBusTo('Bengaluru');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300"
                >
                  Chennai &rarr; Bengaluru
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Search Buses</span>
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 3: CAB SEARCH */}
          {selectedCategory === 'cab' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                {(['One Way', 'Round Trip', 'Local'] as const).map((type) => (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="cabTripType"
                      checked={cabTripType === type}
                      onChange={() => setCabTripType(type)}
                      className="text-teal-500 focus:ring-teal-400"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={cabPickup}
                      onChange={(e) => setCabPickup(e.target.value)}
                      placeholder="Airport / Station / Address"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Drop-off Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={cabDrop}
                      onChange={(e) => setCabDrop(e.target.value)}
                      placeholder="Destination / Hotel / City"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Pickup Date & Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={cabDate}
                      onChange={(e) => setCabDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={cabTime}
                      onChange={(e) => setCabTime(e.target.value)}
                      placeholder="Time"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Vehicle Type</label>
                    <select
                      value={cabType}
                      onChange={(e) => setCabType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="Sedan">Sedan (Dzire/Aura)</option>
                      <option value="SUV">SUV (Innova Crysta)</option>
                      <option value="Hatchback">Hatchback (WagonR)</option>
                      <option value="Luxury">Luxury (Mercedes/Audi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Passengers</label>
                    <select
                      value={cabPassengers}
                      onChange={(e) => setCabPassengers(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="4">4 Persons</option>
                      <option value="6">6 Persons (SUV)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Search Cabs</span>
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 4: HOTEL SEARCH */}
          {selectedCategory === 'hotel' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Destination / City</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={hotelDestination}
                      onChange={(e) => setHotelDestination(e.target.value)}
                      placeholder="e.g. Ooty, Kodaikanal, Goa"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={hotelCheckIn}
                      onChange={(e) => setHotelCheckIn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={hotelCheckOut}
                      onChange={(e) => setHotelCheckOut(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Rooms</label>
                    <select
                      value={hotelRooms}
                      onChange={(e) => setHotelRooms(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Guests</label>
                    <select
                      value={hotelGuests}
                      onChange={(e) => setHotelGuests(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sample Destinations Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Top Holiday Cities:</span>
                {['Ooty', 'Kodaikanal', 'Goa', 'Kerala', 'Jaipur', 'Chennai'].map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => setHotelDestination(place)}
                    className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300"
                  >
                    {place}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Search Hotels</span>
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 5: METRO TRAIN SEARCH */}
          {selectedCategory === 'metro' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Metro Network</label>
                  <select
                    value={metroCity}
                    onChange={(e) => {
                      setMetroCity(e.target.value);
                      if (e.target.value === 'Chennai') {
                        setMetroFromStation('Chennai Central');
                        setMetroToStation('Chennai International Airport');
                      } else {
                        setMetroFromStation('Krantivira Sangolli Rayanna (Majestic)');
                        setMetroToStation('Whitefield (Kadugodi)');
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                  >
                    <option value="Chennai">Chennai Metro (CMRL)</option>
                    <option value="Bengaluru">Bengaluru Namma Metro (BMRCL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">From Metro Station</label>
                  <div className="relative">
                    <TramFront className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={metroFromStation}
                      onChange={(e) => setMetroFromStation(e.target.value)}
                      placeholder="Starting Station"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">To Metro Station</label>
                  <div className="relative">
                    <TramFront className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={metroToStation}
                      onChange={(e) => setMetroToStation(e.target.value)}
                      placeholder="Destination Station"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => swapLocations('metro')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-teal-300"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Travel Date</label>
                    <input
                      type="date"
                      required
                      value={metroDate}
                      onChange={(e) => setMetroDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Passengers</label>
                    <select
                      value={metroPassengers}
                      onChange={(e) => setMetroPassengers(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="1">1 Token / QR</option>
                      <option value="2">2 Tokens / QR</option>
                      <option value="3">3 Tokens / QR</option>
                      <option value="4">4 Tokens / QR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Search Metro Routes</span>
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 6: TRAIN SEARCH */}
          {selectedCategory === 'train' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">From Railway Station</label>
                  <div className="relative">
                    <Train className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={trainFrom}
                      onChange={(e) => setTrainFrom(e.target.value)}
                      placeholder="e.g. Chennai Central (MAS)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">To Railway Station</label>
                  <div className="relative">
                    <Train className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={trainTo}
                      onChange={(e) => setTrainTo(e.target.value)}
                      placeholder="e.g. Bengaluru / Madurai / New Delhi"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => swapLocations('train')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-teal-300"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Journey Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={trainDate}
                      onChange={(e) => setTrainDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Class</label>
                    <select
                      value={trainClass}
                      onChange={(e) => setTrainClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="CC">AC Chair Car (CC)</option>
                      <option value="EC">Executive Chair (EC)</option>
                      <option value="3A">Third AC (3A)</option>
                      <option value="2A">Second AC (2A)</option>
                      <option value="1A">First AC (1A)</option>
                      <option value="SL">Sleeper (SL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Passengers</label>
                    <select
                      value={trainPassengers}
                      onChange={(e) => setTrainPassengers(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sample Train Routes */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Express Routes:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrainFrom('MGR Chennai Central (MAS)');
                    setTrainTo('KSR Bengaluru City (SBC)');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300"
                >
                  Chennai &rarr; Bengaluru (Vande Bharat)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrainFrom('Chennai Egmore (MS)');
                    setTrainTo('Madurai Junction (MDU)');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300"
                >
                  Chennai &rarr; Madurai (Tejas)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrainFrom('MGR Chennai Central (MAS)');
                    setTrainTo('New Delhi Railway Station (NDLS)');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-700/50 hover:bg-teal-500/20 hover:text-teal-300"
                >
                  Chennai &rarr; New Delhi (Tamil Nadu SF)
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Search Trains</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
