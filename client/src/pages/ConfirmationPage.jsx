import React, { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-14 w-14 text-emerald-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const TrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M4 10h16" />
    <path d="M8 6h8" />
    <path d="M6 16a2 2 0 1 0 4 0" />
    <path d="M14 16a2 2 0 1 0 4 0" />
    <path d="M7 20l-2 2" />
    <path d="M17 20l2 2" />
    <path d="M6 4h12a2 2 0 0 1 2 2v9a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V6a2 2 0 0 1 2-2Z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
  </svg>
);

const StatusPill = ({ status }) => {
  const s = String(status || "CONFIRMED").toUpperCase();
  const cls =
    s === "CNF" || s === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
      : s === "RAC"
      ? "bg-amber-100 text-amber-700 ring-amber-200"
      : "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s}
    </span>
  );
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "-";
  return String(value).slice(0, 5);
};

const QRBlock = ({ pnr }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
      <TicketIcon />
      Ticket QR
    </div>
    <div className="grid grid-cols-5 gap-1 rounded-xl bg-slate-950 p-3">
      {Array.from({ length: 25 }).map((_, idx) => {
        const x = idx % 5;
        const y = Math.floor(idx / 5);
        const filled = (x === 0 || x === 4 || y === 0 || y === 4) || ((x + y + pnr.length) % 3 === 0);
        return (
          <div
            key={idx}
            className={`aspect-square rounded-[3px] ${filled ? "bg-white" : "bg-slate-950"}`}
          />
        );
      })}
    </div>
    <p className="mt-3 text-center text-xs text-slate-500">PNR: {pnr || "-"}</p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="text-sm text-slate-500">{label}</div>
    <div className="text-sm font-semibold text-slate-900 text-right">{value || "-"}</div>
  </div>
);

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const booking = state?.booking;

  const journey = useMemo(() => {
    const firstTicket = booking?.tickets?.[0];
    const trainName = firstTicket?.train_name || booking?.train_name || "Train";
    const trainNumber = firstTicket?.train_number || booking?.train_number || "-";
    const from = booking?.source_station || booking?.source || booking?.from_station || "Origin";
    const to = booking?.destination_station || booking?.destination || booking?.to_station || "Destination";
    const journeyDate = booking?.journey_date || booking?.date || booking?.journeyDate;
    const status = booking?.status || booking?.booking_status || "CONFIRMED";
    const totalFare = booking?.total_fare || booking?.fare || 0;

    return {
      trainName,
      trainNumber,
      from,
      to,
      journeyDate,
      status,
      totalFare,
    };
  }, [booking]);

  const aiProbability = booking?.ai_probability ?? booking?.rtc_probability ?? booking?.prediction?.probability;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-slate-950/40 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="space-y-6">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-40" />
                  <div className="absolute inset-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40" />
                  <div className="relative z-10">
                    <CheckCircleIcon />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
                    <SparkIcon />
                    Booking successful
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Your ticket is confirmed
                  </h1>
                  <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Your journey is booked. Keep your PNR and ticket details handy for verification at the station.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Booking ID</div>
                  <div className="mt-2 font-mono text-lg font-bold text-slate-900 dark:text-white">{bookingId || booking?.id || "-"}</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">PNR</div>
                  <div className="mt-2 font-mono text-lg font-bold text-slate-900 dark:text-white">{booking?.pnr || "-"}</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</div>
                  <div className="mt-2">
                    <StatusPill status={journey.status} />
                  </div>
                </div>
              </div>

              {/* <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 dark:border-slate-800 dark:from-indigo-950/30 dark:via-slate-950 dark:to-violet-950/20">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <TrainIcon />
                  Journey summary
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.7fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Train</div>
                        <div className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{journey.trainName}</div>
                        <div className="mt-1 text-sm text-slate-500">#{journey.trainNumber}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        <TrainIcon />
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">From</div>
                          <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">{journey.from}</div>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">To</div>
                          <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">{journey.to}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                          <div className="text-slate-500">Journey date</div>
                          <div className="mt-1 font-semibold text-slate-900 dark:text-white">{formatDate(journey.journeyDate)}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                          <div className="text-slate-500">Total fare</div>
                          <div className="mt-1 font-semibold text-slate-900 dark:text-white">₹{Number(journey.totalFare || 0).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <QRBlock pnr={booking?.pnr || ""} />

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <SparkIcon />
                        AI confirmation insight
                      </div>
                      <div className="mt-3">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <div className="text-xs text-slate-500">Prediction probability</div>
                            <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
                              {typeof aiProbability === "number" ? `${Math.round(aiProbability * 100)}%` : "N/A"}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-900">
                            {typeof aiProbability === "number" && aiProbability >= 0.75 ? "High chance" : "Estimated"}
                          </div>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400"
                            style={{ width: `${Math.min(100, Math.max(0, Math.round((aiProbability ?? 0.82) * 100)))}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          This estimate is based on current availability, quota, and booking conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {booking?.tickets?.length > 0 && (
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <UserIcon />
                      Passenger details
                    </div>
                    <div className="text-xs text-slate-500">{booking.tickets.length} passenger{booking.tickets.length > 1 ? "s" : ""}</div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {booking.tickets.map((t, idx) => {
                      const confirmed = String(t.status || journey.status).toUpperCase() === "CNF" || String(t.status).toLowerCase() === "confirmed";
                      return (
                        <div
                          key={`${t.id || idx}-${idx}`}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                                {idx + 1}
                              </span>
                              <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{t.passenger_name}</div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-500 sm:grid-cols-4">
                              <div>Age: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.passenger_age ?? "-"}</span></div>
                              <div>Gender: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.passenger_gender ?? "-"}</span></div>
                              <div>Coach: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.Seat?.coach || "-"}</span></div>
                              <div>Class: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.Seat?.class_type || "GN"}</span></div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {confirmed ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Seat {t.Seat?.seat_number || "Assigned"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                WL {t.waitlist_number || t.wl_number || "-"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-sm font-bold text-slate-900 dark:text-white">Quick details</div>
                <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
                  <DetailRow label="Booking ID" value={bookingId || booking?.id || "-"} />
                  <DetailRow label="PNR" value={booking?.pnr || "-"} />
                  <DetailRow label="Journey date" value={formatDate(journey.journeyDate)} />
                  <DetailRow label="Train" value={`${journey.trainName} (${journey.trainNumber})`} />
                  <DetailRow label="Status" value={<StatusPill status={journey.status} />} />
                  <DetailRow label="Fare" value={`₹${Number(journey.totalFare || 0).toFixed(2)}`} />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="text-sm font-bold text-slate-900 dark:text-white">Travel tips</div>
                <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex gap-2"><span>•</span><span>Carry a valid government photo ID.</span></li>
                  <li className="flex gap-2"><span>•</span><span>Reach the station at least 30 minutes early.</span></li>
                  <li className="flex gap-2"><span>•</span><span>Check platform updates before departure.</span></li>
                  <li className="flex gap-2"><span>•</span><span>Keep your PNR ready for verification.</span></li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-indigo-200 bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg shadow-indigo-200/60 dark:shadow-none">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CalendarIcon />
                  Add to calendar
                </div>
                <p className="mt-2 text-sm text-indigo-100">
                  Save your journey date so you do not miss your train.
                </p>
                <a
                  href={`data:text/calendar;charset=utf-8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(`TripSure Train Journey - ${journey.trainName}`)}%0ADTSTART:${new Date(journey.journeyDate || Date.now()).toISOString().replace(/[-:]/g, "").split(".")[0]}Z%0AEND:VEVENT%0AEND:VCALENDAR`}
                  download={`tripSure-${booking?.pnr || "ticket"}.ics`}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                >
                  <DownloadIcon />
                  Download calendar
                </a>
              </div>
            </aside>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/history"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 active:scale-[0.99]"
            >
              <TicketIcon />
              View My Bookings
            </Link>

            <Link
              to="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Book Another Ticket
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;