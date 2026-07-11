import React, { useEffect, useState } from 'react'
import api from '../services/api'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  // const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/bookings/history')
        setHistory(res.data.bookings || [])
      } catch {
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getStatusBadge = (status) => {
    const colors = {
      confirmed: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };

    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${
          colors[status] || 'bg-gray-100 text-gray-700'
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {history.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-gray-500 shadow-sm">
          You haven&apos;t booked any tickets yet.
        </div>
      ) : (
        history.map((booking) => (
          <div
            key={booking.booking_id}
            className="rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
          >
          <button
            type="button"
            // onClick={() =>
            //   setExpandedId(expandedId === booking.booking_id ? null : booking.booking_id)
            // }
            className="flex w-full items-center justify-between p-6"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                🚆
              </div>

              <div className="text-left">
                {/* <h3 className="text-xl font-semibold">
                  {(
                    booking.tickets?.[0]?.train_name?.trim() ||
                    booking.tickets?.[0]?.train?.name?.trim() ||
                    booking.train_name?.trim() ||
                    booking.train?.name?.trim() ||
                    booking.train_number?.trim() ||
                    booking.train?.number?.trim() ||
                    ''
                  ) || 'Unknown Train'}
                </h3> */}

                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <span>PNR {booking.pnr}</span>
                  <span>•</span>
                  <span>{new Date(booking.journey_date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{booking.class_type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div>{getStatusBadge(booking.status)}</div>

              <div className="text-right">
                <p className="text-xs uppercase text-gray-400">Fare</p>
                <p className="text-2xl font-bold">₹{booking.total_fare}</p>
              </div>

              {/* <span className="text-xl">{expandedId === booking.booking_id ? '▲' : '▼'}</span> */}
            </div>
          </button>

          {/* {expandedId === booking.booking_id && (
            <div className="border-t bg-slate-50 p-6">
              <h4 className="mb-4 font-semibold">Passenger Details</h4>

              <div className="space-y-3">
                {booking.tickets.map((ticket) => (
                  <div
                    key={ticket.ticket_id}
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{ticket.passenger_name}</p>
                      <p className="text-sm text-gray-500">Age {ticket.age}</p>
                    </div>

                    {ticket.status === 'confirmed' ? (
                      <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                        Seat {ticket.seat_number}
                      </span>
                    ) : (
                      <span className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
                        WL {ticket.waitlist_number}
                      </span>
                    )}
                  </div>
                ))} */}
              {/* </div> */}
            {/* </div> */}
          {/* // )} */}
        </div>
      ))
      )}
    </div>
  );
}

export default HistoryPage
