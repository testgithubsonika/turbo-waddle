import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationBadge from './ConfirmationBadge';

function normalizeClasses(train) {
  // If train has classes with predictions from the search endpoint
  if (Array.isArray(train?.classes) && train.classes.length > 0) {
    return train.classes.map((cls) => ({
      class: cls.class ?? cls.name ?? cls,
      status: cls.status ?? (typeof cls.availableSeats === 'number' && cls.availableSeats > 0 ? 'Available' : 'Limited'),
      confirmationProbability: typeof cls.probability === 'number' ? cls.probability : (typeof cls.confirmationProbability === 'number' ? cls.confirmationProbability : null),
      prediction_stale: cls.prediction_stale ?? false,
    }));
  }

  // Fall back to available_classes if no detailed class info
  if (Array.isArray(train?.available_classes) && train.available_classes.length > 0) {
    return train.available_classes.map((cls) => ({
      class: cls,
      status: 'Available',
      confirmationProbability: null,
      prediction_stale: true,
    }));
  }

  return [];
}

export default function TrainCard({ train, aiServiceAvailable = true, loading = false, searchDate }) {
  const navigate = useNavigate();
  const id = train?.train_id ?? train?.id;

  const classes = useMemo(() => normalizeClasses(train), [train]);
  const initialClass = classes[0]?.class ?? '';
  const [selectedClass, setSelectedClass] = useState(initialClass);

  useEffect(() => {
    if (!classes.some((cls) => cls.class === selectedClass)) {
      setSelectedClass(classes[0]?.class ?? '');
    }
  }, [classes, selectedClass]);

  if (!id) return null;

  const handleBook = () => {
    if (!selectedClass) {
      alert('Please select a class before booking.');
      return;
    }

    const requiredFields = ['route_id', 'from_sequence', 'to_sequence', 'distance_km'];
    for (const field of requiredFields) {
      if (train[field] == null) {
        alert(`Missing booking data: ${field}. Please search again.`);
        return;
      }
    }

    navigate(`/book/${id}`, {
      state: {
        journey_date: searchDate,
        classType: selectedClass,
        train: {
          train_id: train.train_id,
          train_name: train.train_name,
          train_number: train.train_number,
          route_id: train.route_id,
          from_sequence: train.from_sequence,
          to_sequence: train.to_sequence,
          distance_km: train.distance_km,
          base_fare_per_km: train.base_fare_per_km,
        },
      },
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{train.train_name}</h3>
            <p className="text-sm text-gray-500">Train No: {train.train_number}</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            {train.train_type ?? train.trainType ?? 'Express'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Departure</p>
            <p className="text-xl font-bold">{train.departure_time}</p>
            <p className="text-xs text-gray-500">{train.source}</p>
          </div>

          <div className="relative mx-6 flex-1 border-t">
            <span className="absolute left-1/2 -top-3 -translate-x-1/2 rounded-full bg-white px-2 text-xs text-gray-500 dark:bg-slate-900">
              {/* {train.distance_km} km */}
            </span>
          </div>

          <div className=" text-right">
            <p className="text-xs text-gray-500">Arrival</p>
            <p className="text-xl font-bold">{train.arrival_time}</p>
            <p className="text-xs text-gray-500">{train.destination}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600">Choose class</p>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <span
                    key={cls.class}
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                      cls.class === selectedClass
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {cls.class}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Prediction</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {classes.find((cls) => cls.class === selectedClass)?.confirmationProbability != null
                  ? `${Math.round(classes.find((cls) => cls.class === selectedClass).confirmationProbability)}% confirmed`
                  : 'Calculating...'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => {
              const isSelected = cls.class === selectedClass;
              return (
                <button
                  key={cls.class}
                  type="button"
                  onClick={() => setSelectedClass(cls.class)}
                  className={`group flex flex-col gap-3 rounded-3xl border px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{cls.class}</p>
                      <p className="text-xs text-slate-500">{cls.status}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cls.confirmationProbability != null
                        ? `${Math.round(cls.confirmationProbability)}%`
                        : 'Pending'}
                    </span>
                  </div>


<div className="mt-3 flex items-start justify-between gap-4">
  {/* Left */}
  <div className="flex-1">
    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
      Approx Fare
    </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">
                ₹{Math.max(1, Math.round((Number(train.base_fare_per_km || 1) * Number(train.distance_km || 0)) * (selectedClass === '3A' ? 2.5 : selectedClass === '2A' ? 3.5 : selectedClass === 'SLEEPER' || selectedClass === 'Sleeper' ? 1.0 : 1.0))).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-slate-500">per passenger</p>
              
    {/* </p> */}
  </div>
                  
                   {/* </div> */}
                    <ConfirmationBadge
                    probability={loading ? undefined : cls.confirmationProbability}
                    aiServiceAvailable={aiServiceAvailable}
                  />
              {/* <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Approx fare</p> */}
            
            </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           

            <button
              type="button"
              onClick={handleBook}
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700"
            >
              Book {selectedClass || 'ticket'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
