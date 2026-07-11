import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

// ── Inline icons ───────────────────────────────────────────────────
const TrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="4" y="3" width="16" height="16" rx="2" />
    <path d="M4 11h16M12 3v8M8 19l-2 3M18 22l-2-3M8 15h0M16 15h0" />
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

// ── Field component ────────────────────────────────────────────────
const PassengerInput = ({ placeholder, value, onChange, type = 'text' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50  px-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-400/30 hover:border-gray-300"
  />
)

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const train = state?.train;
  const journeyDate = state?.journey_date;
  const selectedClass = state?.classType || '';
  const quota = state?.quota || 'GN';
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!train || !journeyDate) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-center text-sm font-medium text-red-700">
          Invalid booking session. Please search again.
        </div>
      </div>
    );
  }

  const handlePassengerChange = (i, field, value) => {
    const updated = [...passengers];
    updated[i][field] = value;
    setPassengers(updated);
  };

  const handleAddPassenger = () =>
    setPassengers([...passengers, { name: '', age: '', gender: '' }]);

  const handleRemovePassenger = (i) =>
    setPassengers(passengers.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedClass) {
      setError('Please select a class before booking.');
      return;
    }
    if (passengers.some(p => !p.name || !p.age || !p.gender)) {
      setError('All passenger details are required.');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        train_id: train.train_id,
        route_id: train.route_id,
        journey_date: journeyDate,
        class_type: selectedClass,
        quota,
        distance_km: train.distance_km,
        from_sequence: train.from_sequence,
        to_sequence: train.to_sequence,
        passengers,
      };
      const res = await api.post('/bookings/book', bookingData);
      navigate(`/confirmation/${res.data.booking.id}`, {
        state: { booking: res.data.booking }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4 py-8">

      {/* ── Page header ── */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Confirm Booking</h1>
        <p className="text-sm text-gray-400">Almost there — just fill in the passenger details</p>
      </div>

      {/* ── Train summary card (boarding-pass style) ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-gray-100 shadow-lg">
        {/* Left gradient stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-500 to-violet-600" />

        <div className="pl-5 pr-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
              <TrainIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {train.train_name}
                <span className="ml-2 font-mono text-xs text-gray-400">#{train.train_number}</span>
              </h2>

              {/* Meta pills */}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 ring-1 ring-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  <CalendarIcon />
                  {journeyDate}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 ring-1 ring-violet-200 px-2.5 py-1 text-xs font-semibold text-violet-700">
                  <TagIcon />
                  {selectedClass}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 ring-1 ring-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <TagIcon />
                  {quota}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      {/* ── Passenger form ── */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Section header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-200">
            <UsersIcon />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Passenger Details</h2>
        </div>

        {/* Passenger cards */}
        {passengers.map((p, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-gray-100 shadow-sm">
            {/* Numbered left tab */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-400 to-violet-500" />

            <div className="pl-5 pr-5 py-4 space-y-3">
              {/* Passenger header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-gray-800">Passenger {i + 1}</span>
                </div>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePassenger(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                    aria-label="Remove passenger"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>

              {/* Fields */}
              <div className="grid gap-3 md:grid-cols-3">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">
                    <UserIcon />
                  </span>
                  <input
                    placeholder="Full name"
                    value={p.name}
                    onChange={(e) => handlePassengerChange(i, 'name', e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50  pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-400/30 hover:border-gray-300"
                  />
                </div>
                <PassengerInput
                  type="number"
                  placeholder="Age"
                  value={p.age}
                  onChange={(e) => handlePassengerChange(i, 'age', e.target.value)}
                />
                <select
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(i, 'gender', e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50  px-4 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-400/30 hover:border-gray-300 cursor-pointer"
                >
                  <option value="">Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Add passenger */}
        <button
          type="button"
          onClick={handleAddPassenger}
          className="flex items-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-100 active:scale-95"
        >
          <PlusIcon />
          Add Another Passenger
        </button>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={submitting || !selectedClass}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300 active:scale-95 disabled:cursor-not-allowed disabled:from-indigo-300 disabled:to-violet-300 disabled:shadow-none"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing Booking…
            </>
          ) : (
            <>
              <span className="text-base font-bold">₹</span>
              Confirm &amp; Book Ticket
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;