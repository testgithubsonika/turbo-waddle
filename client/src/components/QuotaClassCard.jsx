import React from 'react';
import { useNavigate } from 'react-router-dom';

// ── Status config ──────────────────────────────────────────────────
const STATUS = {
  AVAILABLE: {
    stripe: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    dotColor: '#10b981',
    label: 'Available',
    labelColor: 'text-emerald-700',
    labelBg: 'bg-emerald-100 ring-emerald-300',
  },
  WAITLIST: {
    stripe: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    dotColor: '#f59e0b',
    label: 'Waitlist',
    labelColor: 'text-amber-700',
    labelBg: 'bg-amber-100 ring-amber-300',
  },
  NOT_AVAILABLE: {
    stripe: 'from-red-400 to-rose-500',
    bg: 'bg-red-50',
    ring: 'ring-red-200',
    dotColor: '#ef4444',
    label: 'Not Available',
    labelColor: 'text-red-600',
    labelBg: 'bg-red-100 ring-red-300',
  },
};

// ── Inline icons ───────────────────────────────────────────────────
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function QuotaClassCard({ option, train, searchDate }) {
  const navigate = useNavigate();
  const status = STATUS[option.availability_status] ?? STATUS.NOT_AVAILABLE;
  const wlPct = option.wl_probability != null ? Math.round(option.wl_probability * 100) : null;
  const isTatkal = option.quota === 'TATKAL';
  const isDisabled = option.availability_status === 'NOT_AVAILABLE';

  const handleBook = () => {
    navigate(`/book/${train.train_id}`, {
      state: {
        journey_date: searchDate,
        quota: option.quota,
        classType: option.class_type,
        train,
      },
    });
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 ring-1 ${status.ring} shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}>

      {/* Left gradient status stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b ${status.stripe}`} />

      <div className="pl-5 pr-5 pt-5 pb-4 space-y-4">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {option.class_type}
              </h3>

              {/* Quota badge */}
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                isTatkal
                  ? 'bg-blue-600 text-white'
                  : 'bg-linear-to-r from-indigo-500 to-violet-600 text-white'
              }`}>
                {isTatkal && <ClockIcon />}
                {option.quota}
              </span>
            </div>

            {/* Tatkal timing note */}
            {isTatkal && option.opens_in_days != null && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-blue-600">
                <ClockIcon />
                Opens {option.opens_in_days} day{option.opens_in_days !== 1 ? 's' : ''} before journey
              </p>
            )}
          </div>

          {/* Availability status pill */}
          <span className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-3 py-1 text-xs font-bold ${status.labelColor} ${status.labelBg} shrink-0`}>
            <span
              className="h-1.5 w-1.5 rounded-full inline-block"
              style={{ backgroundColor: status.dotColor }}
            />
            {status.label}
          </span>
        </div>

        {/* ── Fare row ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-400 font-medium">Fare</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              ₹{option.fare?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* ── AI WL Probability chip ── */}
        {wlPct != null && (
          <div className={`rounded-2xl ${
            wlPct >= 60
              ? 'bg-emerald-50 ring-1 ring-emerald-200'
              : wlPct >= 35
              ? 'bg-amber-50 ring-1 ring-amber-200'
              : 'bg-red-50 ring-1 ring-red-200'
          } px-4 py-3`}>

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {/* Pulse dot */}
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${
                    wlPct >= 60 ? 'bg-emerald-500' : wlPct >= 35 ? 'bg-amber-400' : 'bg-red-500'
                  }`} />
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${
                    wlPct >= 60 ? 'bg-emerald-500' : wlPct >= 35 ? 'bg-amber-400' : 'bg-red-500'
                  }`} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <SparkleIcon />
                  AI · WL Confirmation
                </span>
              </div>
              <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ring-1 ${
                wlPct >= 60
                  ? 'text-emerald-700 bg-emerald-100 ring-emerald-300'
                  : wlPct >= 35
                  ? 'text-amber-700 bg-amber-100 ring-amber-300'
                  : 'text-red-600 bg-red-100 ring-red-300'
              }`}>
                {wlPct >= 60 ? 'Likely' : wlPct >= 35 ? 'Uncertain' : 'Unlikely'}
              </span>
            </div>

            {/* Bar */}
            <div className="h-1.5 w-full rounded-full bg-black/8 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  wlPct >= 60 ? 'bg-emerald-500' : wlPct >= 35 ? 'bg-amber-400' : 'bg-red-500'
                }`}
                style={{ width: `${wlPct}%` }}
              />
            </div>

            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-extrabold leading-none ${
                wlPct >= 60 ? 'text-emerald-700' : wlPct >= 35 ? 'text-amber-700' : 'text-red-600'
              }`}>{wlPct}%</span>
              <span className="text-xs text-gray-400">chance of confirmation</span>
            </div>
          </div>
        )}

        {/* ── Book button ── */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={handleBook}
          className={`w-full rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-95 ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300'
          }`}
        >
          {isDisabled ? 'Not Available' : 'Book Now →'}
        </button>
      </div>
    </div>
  );
}
