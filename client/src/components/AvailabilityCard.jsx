import React from 'react';

// ── Tier config ────────────────────────────────────────────────────
const getTier = (probVal, isStale) => {
  if (isStale) {
    return {
      label: 'Updating…',
      badge: 'Refreshing',
      color: 'text-slate-500',
      bg: 'bg-slate-50',
      ring: 'ring-slate-200',
      bar: 'bg-slate-400',
      dotColor: '#94a3b8',
      isStale: true,
    };
  }
  if (probVal == null) {
    return {
      label: 'Unknown',
      badge: '—',
      color: 'text-slate-500',
      bg: 'bg-slate-50',
      ring: 'ring-slate-200',
      bar: 'bg-slate-300',
      dotColor: '#94a3b8',
    };
  }
  if (probVal >= 75) {
    return {
      label: 'High Chance',
      badge: 'High',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-200',
      bar: 'bg-emerald-500',
      dotColor: '#10b981',
    };
  }
  if (probVal >= 45) {
    return {
      label: 'Moderate',
      badge: 'Moderate',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      ring: 'ring-amber-200',
      bar: 'bg-amber-400',
      dotColor: '#f59e0b',
    };
  }
  return {
    label: 'Low Chance',
    badge: 'Low',
    color: 'text-red-600',
    bg: 'bg-red-50',
    ring: 'ring-red-200',
    bar: 'bg-red-500',
    dotColor: '#ef4444',
  };
};

// ── Inline availability label ───────────────────────────────────────
const AvailLabel = ({ cls }) => {
  if (cls.wl > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2 py-0.5 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
        WL {cls.wl}
      </span>
    );
  }
  if (cls.rac > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 ring-1 ring-blue-200 px-2 py-0.5 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" />
        RAC {cls.rac}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 rounded-full">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
      {cls.available} Available
    </span>
  );
};

/**
 * Display seat availability with prediction 
 * @param {Object} cls - Class availability data
 */
export function AvailabilityDisplay({ cls }) {
  const prediction = cls.prediction || {};
  const probVal = typeof prediction.probability === 'number' ? prediction.probability : null;
  const updatedAt = prediction.updatedAt || null;
  const isStale =
    prediction.stale ??
    (!updatedAt || Date.now() - new Date(updatedAt) > 1000 * 60 * 60);

  const tier = getTier(probVal, isStale);
  const pct = probVal != null ? Math.round(probVal) : 0;

  return (
    <div className={`rounded-2xl ${tier.bg} ring-1 ${tier.ring} p-4 transition hover:shadow-sm`}>
      <div className="flex items-start justify-between gap-4">

        {/* Left: class info + availability */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {cls.class}
            {cls.quota && (
              <span className="ml-2 text-xs font-semibold text-slate-500">• {cls.quota}</span>
            )}
          </div>
          <AvailLabel cls={cls} />
        </div>

        {/* Right: AI chip */}
        <div className={`flex flex-col items-end gap-1.5 shrink-0`}>
          {/* Header */}
          <div className="flex items-center gap-1.5">
            {/* Animated pulse dot */}
            <span className="relative flex h-2 w-2">
              {!isStale ? (
                <>
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ backgroundColor: tier.dotColor }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: tier.dotColor }}
                  />
                </>
              ) : (
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-400" />
              )}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              AI Prediction
            </span>
          </div>

          {/* Percentage + label */}
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold leading-none ${tier.color}`}>
              {probVal != null ? `${pct}%` : '—'}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ring-1 ${tier.bg} ${tier.ring} ${tier.color}`}
            >
              {tier.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {probVal != null && !isStale && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-black/8 overflow-hidden">
          <div
            className={`h-full rounded-full ${tier.bar} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Stale notice */}
      {isStale && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Prediction refreshing — check back shortly
        </div>
      )}
    </div>
  );
}

/**
 * Display all available classes for a train with predictions.
 * @param {Array} classes - Array of class availability objects
 */
export function ClassAvailabilityList({ classes }) {
  if (!Array.isArray(classes) || classes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6 text-gray-400">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">No availability information</p>
        <p className="mt-1 text-xs text-gray-400">Try a different date or class</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {classes.map((cls, idx) => (
        <AvailabilityDisplay key={idx} cls={cls} />
      ))}
    </div>
  );
}

export default AvailabilityDisplay;
