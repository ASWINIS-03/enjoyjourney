import React, { useState } from 'react';
import { Building2, Star, MapPin, Calendar, Users, Check, Sparkles, BedDouble, ShieldCheck } from 'lucide-react';
import { HotelItem } from '../../types/travel';

interface HotelBookingViewProps {
  hotels: HotelItem[];
  searchParams: any;
  onInitiateBooking: (
    hotel: HotelItem,
    roomType: string,
    nightsCount: number,
    roomsCount: number,
    totalBase: number
  ) => void;
}

export const HotelBookingView: React.FC<HotelBookingViewProps> = ({
  hotels,
  searchParams,
  onInitiateBooking,
}) => {
  const checkIn = searchParams.checkIn || '2026-11-01';
  const checkOut = searchParams.checkOut || '2026-11-03';
  const roomsCount = Number(searchParams.rooms) || 1;
  const guestsCount = Number(searchParams.guests) || 2;

  // Auto calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.max(1, checkOutDate.getTime() - checkInDate.getTime());
  const nightsCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const [selectedRoomTypes, setSelectedRoomTypes] = useState<Record<string, string>>({});

  const handleSelectRoomType = (hotelId: string, roomId: string) => {
    setSelectedRoomTypes((prev) => ({ ...prev, [hotelId]: roomId }));
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Hotels &amp; Resorts in {searchParams.destination || 'Popular Destinations'}</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {searchParams.destination || 'All Destinations'} ({nightsCount} Night{nightsCount > 1 ? 's' : ''})
          </h2>
          <p className="text-xs text-slate-400">
            Check-in: {checkIn} &bull; Check-out: {checkOut} &bull; {roomsCount} Room(s), {guestsCount} Guest(s)
          </p>
        </div>

        <div className="text-xs text-slate-300 font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700">
          {hotels.length} Properties Found
        </div>
      </div>

      {/* Hotel Cards List */}
      <div className="space-y-6">
        {hotels.map((hotel) => {
          const chosenRoomId = selectedRoomTypes[hotel.id] || hotel.roomTypes[0]?.id || 'r1';
          const chosenRoom = hotel.roomTypes.find((r) => r.id === chosenRoomId) || hotel.roomTypes[0];
          const calculatedBase = (chosenRoom ? chosenRoom.pricePerNight : hotel.pricePerNight) * nightsCount * roomsCount;

          return (
            <div
              key={hotel.id}
              className="bg-slate-800/90 border border-slate-700/90 hover:border-teal-500/50 rounded-3xl p-5 sm:p-6 shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Hotel Image & Gallery Preview */}
                <div className="lg:col-span-4 relative rounded-2xl overflow-hidden min-h-[220px] bg-slate-900">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover brightness-95"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.starRating} Star Luxury</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 px-2.5 py-1 rounded-lg text-[11px] text-teal-300 font-semibold border border-slate-700">
                    Score: {hotel.ratingScore}/5 ({hotel.reviewsCount} reviews)
                  </div>
                </div>

                {/* Hotel Information */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xl font-black text-white">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{hotel.locationDetails}</span>
                    </div>

                    {/* Amenities Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-3">
                      {hotel.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 text-[10px] font-medium border border-slate-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Room Type Selection */}
                  <div className="pt-3 border-t border-slate-700/70">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      Select Room Type:
                    </span>
                    <div className="space-y-1.5">
                      {hotel.roomTypes.map((room) => {
                        const isSelected = room.id === chosenRoomId;
                        return (
                          <div
                            key={room.id}
                            onClick={() => handleSelectRoomType(hotel.id, room.id)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-teal-500/10 border-teal-500 text-white font-semibold'
                                : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <BedDouble className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                                <span>{room.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block ml-5">
                                {room.bedType} &bull; Up to {room.capacity} Guests &bull; {room.availableRooms} rooms left
                              </span>
                            </div>

                            <span className="text-xs font-bold font-mono text-teal-300">
                              ₹{room.pricePerNight} / night
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Price & Booking Callout */}
                <div className="lg:col-span-3 flex flex-col justify-between bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80">
                  <div className="space-y-2">
                    <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider block">
                      Price Calculation
                    </span>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Nightly Rate:</span>
                        <span className="text-white font-mono">₹{chosenRoom ? chosenRoom.pricePerNight : hotel.pricePerNight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span className="text-white font-semibold">{nightsCount} Night(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rooms:</span>
                        <span className="text-white font-semibold">{roomsCount} Room(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Total Room Cost:</span>
                      <span className="text-2xl font-black text-white">
                        ₹{calculatedBase.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">+ 5% GST calculated at checkout</span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onInitiateBooking(
                          hotel,
                          chosenRoom ? chosenRoom.name : 'Deluxe Room',
                          nightsCount,
                          roomsCount,
                          calculatedBase
                        )
                      }
                      className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-slate-950" />
                      <span>Book Hotel Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
