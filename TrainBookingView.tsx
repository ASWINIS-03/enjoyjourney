import React, { useState } from 'react';
import { Train, Clock, Ticket, ShieldCheck, ArrowRight, X, Sparkles } from 'lucide-react';
import { TrainItem } from '../../types/travel';

interface TrainBookingViewProps {
  trains: TrainItem[];
  searchParams: any;
  onInitiateBooking: (train: TrainItem, selectedClass: string, selectedSeats: string[], totalBase: number) => void;
}

export const TrainBookingView: React.FC<TrainBookingViewProps> = ({
  trains,
  searchParams,
  onInitiateBooking,
}) => {
  const [selectedTrain, setSelectedTrain] = useState<TrainItem | null>(null);
  const [selectedClassCode, setSelectedClassCode] = useState<string>(searchParams?.travelClass || 'CC');
  const [activeSeatModal, setActiveSeatModal] = useState<TrainItem | null>(null);
  const [selectedBerths, setSelectedBerths] = useState<string[]>([]);

  const passengerCount = Number(searchParams?.passengers) || 1;

  const handleBerthToggle = (berthId: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedBerths.includes(berthId)) {
      setSelectedBerths(selectedBerths.filter((b) => b !== berthId));
    } else {
      if (selectedBerths.length >= passengerCount) {
        setSelectedBerths([...selectedBerths.slice(1), berthId]);
      } else {
        setSelectedBerths([...selectedBerths, berthId]);
      }
    }
  };

  const handleConfirmAndProceed = (train: TrainItem) => {
    const cls = train.classes.find((c) => c.code === selectedClassCode) || train.classes[0];
    const totalBase = cls.fare * passengerCount;
    onInitiateBooking(train, cls.code, selectedBerths, totalBase);
    setActiveSeatModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Train className="w-4 h-4" />
            <span>Indian Railways (IRCTC Demo Integration)</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {searchParams.fromStation || 'Chennai'} &rarr; {searchParams.toStation || 'Bengaluru'}
          </h2>
          <p className="text-xs text-slate-400">
            {searchParams.date || 'Flexible Date'} &bull; {passengerCount} Passenger(s) &bull; Class: {selectedClassCode}
          </p>
        </div>

        <span className="text-xs text-slate-300 font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700">
          {trains.length} Trains Available
        </span>
      </div>

      {/* Train Cards List */}
      <div className="space-y-4">
        {trains.map((train) => {
          return (
            <div
              key={train.id}
              className="bg-slate-800/90 border border-slate-700/90 hover:border-teal-500/50 rounded-2xl p-5 shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
                {/* Train Name & Number */}
                <div className="flex items-start gap-4 min-w-[260px]">
                  <img
                    src={train.imageUrl}
                    alt={train.trainName}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-black text-white">{train.trainName}</h3>
                    <span className="text-xs text-teal-400 font-mono font-bold">#{train.trainNumber}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Runs on: {train.runsOnDays}</span>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex-1 flex items-center justify-between max-w-md">
                  <div className="text-left">
                    <span className="text-xl font-black text-white block">{train.departureTime}</span>
                    <span className="text-xs font-semibold text-teal-400">{train.fromStation}</span>
                  </div>

                  <div className="flex-1 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-teal-400" />
                      <span>{train.duration}</span>
                    </div>
                    <div className="relative my-1">
                      <div className="h-0.5 bg-slate-700 w-full" />
                      <Train className="w-3.5 h-3.5 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-0.5" />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Superfast Express</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-white block">{train.arrivalTime}</span>
                    <span className="text-xs font-semibold text-teal-400">{train.toStation}</span>
                  </div>
                </div>
              </div>

              {/* Class Selection & Pricing Grid */}
              <div className="pt-3 border-t border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Select Travel Class &amp; Availability:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {train.classes.map((cls) => {
                    const isSelected = selectedClassCode === cls.code;
                    return (
                      <div
                        key={cls.code}
                        onClick={() => setSelectedClassCode(cls.code)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-400 ring-1 ring-teal-400'
                            : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{cls.code}</span>
                          <span className="text-teal-300 font-black font-mono">₹{cls.fare}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">{cls.name}</span>
                        <div className="mt-1 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <span>AVAILABLE - {cls.availableSeats}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSeatModal(train);
                      setSelectedBerths(['C1-15']);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-slate-950" />
                    <span>Select Berths &amp; Book ({selectedClassCode})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2D Train Berth Preference Modal */}
      {activeSeatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveSeatModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 text-left">
              <div className="inline-flex items-center gap-1 text-teal-400 text-xs font-bold uppercase">
                <Train className="w-3.5 h-3.5" />
                <span>Coach Berth Selection ({selectedClassCode})</span>
              </div>
              <h3 className="text-lg font-black text-white">{activeSeatModal.trainName}</h3>
              <p className="text-xs text-slate-400">
                Please pick <strong className="text-white">{passengerCount}</strong> berth(s).
                Selected: <strong className="text-teal-400 font-mono">{selectedBerths.join(', ') || 'None'}</strong>
              </p>
            </div>

            {/* Coach Berth Grid */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-3 text-center">
                Coach {selectedClassCode}-1 (Bay Layout)
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['C1-10', 'C1-11', 'C1-12', 'C1-13', 'C1-14', 'C1-15', 'C1-16', 'C1-17', 'C1-18', 'C1-19', 'C1-20', 'C1-21'].map(
                  (seatId, idx) => {
                    const bookedList = activeSeatModal.bookedSeatsByClass[selectedClassCode] || [];
                    const isBooked = bookedList.includes(seatId);
                    const isSelected = selectedBerths.includes(seatId);

                    const berthType = idx % 4 === 0 ? 'Lower' : idx % 4 === 1 ? 'Middle' : idx % 4 === 2 ? 'Upper' : 'Side Lower';

                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isBooked}
                        onClick={() => handleBerthToggle(seatId, isBooked)}
                        className={`p-2.5 rounded-xl text-center text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 shadow-md'
                            : isBooked
                            ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                            : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-teal-500 hover:text-slate-950'
                        }`}
                      >
                        <span className="block">{seatId}</span>
                        <span className="text-[9px] font-normal opacity-75 block">{berthType}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Base Fare:</span>
                <span className="text-lg font-black text-white">
                  ₹{(((activeSeatModal.classes.find((c) => c.code === selectedClassCode)?.fare) || 995) * passengerCount).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleConfirmAndProceed(activeSeatModal)}
                disabled={selectedBerths.length !== passengerCount}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                Proceed to Checkout ({selectedBerths.length}/{passengerCount} Berths)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
