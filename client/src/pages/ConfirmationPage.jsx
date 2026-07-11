import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

// ── Inline icons ───────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-emerald-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
  </svg>
)

const BookingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const booking = state?.booking;

  return (
    <div className="max-w-xl mx-auto space-y-8 px-4 py-12">

      {/* ── Success hero ── */}
      <div className="flex flex-col items-center text-center gap-5">
        {/* Animated success ring */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
          <div className="absolute inset-0 rounded-full bg-emerald-50" />
          <div className="relative z-10">
            <CheckCircleIcon />
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Your train ticket has been successfully booked. Have a great journey!
          </p>
        </div>

        {/* Booking ID chip */}
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 ring-1 ring-indigo-200 px-5 py-2">
          <TicketIcon />
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Booking ID</span>
          <span className="font-mono text-sm font-bold text-indigo-700">{bookingId}</span>
        </div>
      </div>

      {/* ── Passenger seat details ── */}
      {booking?.tickets?.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-gray-100 shadow-lg">
          {/* Top gradient stripe */}
          <div className="h-1 w-full bg-linear-to-r from-indigo-500 to-violet-600" />

          <div className="px-6 py-5">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-200">
                <UserIcon />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Passenger Details</h3>
              <span className="ml-auto text-xs text-gray-400">{booking.tickets.length} passenger{booking.tickets.length > 1 ? 's' : ''}</span>
            </div>

            {/* Ticket rows */}
            <div className="space-y-2.5">
              {booking.tickets.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-950 ring-1 ring-gray-100 px-4 py-3"
                >
                  {/* Passenger number + name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {t.passenger_name}
                    </span>
                  </div>

                  {/* Seat / WL badge */}
                  {t.status === 'confirmed' ? (
                    <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-emerald-100 ring-1 ring-emerald-300 px-3 py-1 text-xs font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      Seat {t.seat_number}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-amber-100 ring-1 ring-amber-300 px-3 py-1 text-xs font-bold text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                      WL {t.waitlist_number}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Boarding-pass divider */}
            <div className="relative flex items-center my-5">
              <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700" />
              <div className="absolute -left-6 h-5 w-5 rounded-full bg-slate-50 ring-1 ring-gray-100" />
              <div className="absolute -right-6 h-5 w-5 rounded-full bg-slate-50 ring-1 ring-gray-100" />
            </div>

            {/* Travel tip */}
            <p className="text-xs text-center text-gray-400">
              Please carry a valid government-issued photo ID for travel verification.
            </p>
          </div>
        </div>
      )}

      {/* ── CTA buttons ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/history"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300 active:scale-95"
        >
          <BookingsIcon />
          View My Bookings
        </Link>

        <Link
          to="/"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-3.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 active:scale-95"
        >
          Book Another Ticket
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;