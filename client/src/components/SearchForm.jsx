import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { StationCombobox } from './search-components'
import { cn } from '@/lib/utils'

const getTodayValue = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

const ArrowsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M7 16V4m0 0L3 8m4-4l4 4" />
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
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

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SearchForm = () => {
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState(getTodayValue())
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get('/trains/stations')
        const stationData = Array.isArray(res.data) ? res.data : res.data.stations || []
        setStations(stationData)
        setError('')
      } catch (err) {
        console.error('Failed to fetch stations:', err)
        setError('Failed to load stations')
        setStations([])
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [])

  const handleSwap = () => {
    const temp = source
    setSource(destination)
    setDestination(temp)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!source || !destination || !date) {
      alert('Please fill all fields.')
      return
    }

    const params = new URLSearchParams({ source, destination, date })
    navigate(`/search?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="px-8 py-10 flex items-center gap-3 text-gray-400">
        <div className="h-4 w-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
        <span className="text-sm">Loading stations…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-8 py-10 text-sm text-red-500 font-medium">{error}</div>
    )
  }

  return (
    <div className="p-10">
      <div className="flex items-center gap-6 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200">
          <SearchIcon />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">Find Your Train</h2>
          <p className="text-xs text-gray-400 mt-0.5">Search across 500+ routes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 visible">
          <div className="space-y-2 lg:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              From Station
            </label>

            <StationCombobox
              value={source}
              onChange={setSource}
              stations={stations}
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Destination
            </label>

            <StationCombobox
              value={destination}
              onChange={setDestination}
              stations={stations}
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Journey Date
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                <CalendarIcon />
              </span>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cn(
                  'h-12 min-w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300'
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <button
              type="button"
              onClick={handleSwap}
              className="flex h-12 w-full items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
            >
              <ArrowsIcon />
            </button>

            <button
              type="submit"
              className="h-14 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-8 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-violet-700"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchForm
