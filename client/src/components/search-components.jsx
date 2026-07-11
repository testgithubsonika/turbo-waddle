import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// ── Inline icons ───────────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-indigo-600 shrink-0">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const StationCombobox = ({ value, onChange, stations }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef(null)

  const stationArray = useMemo(() => (Array.isArray(stations) ? stations : []), [stations])
  const selectedStation = stationArray.find((station) => station.station_code === value)

  useEffect(() => {
    if (selectedStation) {
      setQuery(`${selectedStation.station_name} (${selectedStation.station_code})`)
      return
    }
    if (!value) setQuery('')
  }, [selectedStation, value])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const filteredStations = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return stationArray
    return stationArray.filter((station) => {
      const name = station.station_name?.toLowerCase() || ''
      const code = station.station_code?.toLowerCase() || ''
      const city = station.city?.toLowerCase() || ''
      const state = station.state?.toLowerCase() || ''
      return [name, code, city, state].some((field) => field.includes(search))
    })
  }, [query, stationArray])

  const handleSelect = (station) => {
    onChange(station.station_code)
    setQuery(`${station.station_name} (${station.station_code})`)
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative  ">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">
          <SearchIcon />
        </span>

        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            onChange('')
            setOpen(true)
          }}
          placeholder="City or station code…"
          className={cn(
            'h-16 w-full min-w-0 rounded-[1.5rem] border border-slate-200 bg-slate-50 pl-14 pr-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 focus:bg-white',
            'hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100',
            open && 'border-indigo-400 bg-white ring-2 ring-indigo-400/40'
          )}
          style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <ChevronIcon open={open} />
        </span>
      </div>

    {open && (
  <div
    className="
      absolute
      left-0
      top-full
      mt-2
      w-full
      z-9999
      max-h-64
      overflow-y-auto
      rounded-2xl
      border
      border-gray-200
      bg-white
      shadow-2xl
    "
  >
          {filteredStations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
              <span className="text-gray-300">
                <MapPinIcon />
              </span>
              <p className="text-md text-gray-400">No stations found</p>
              <p className="text-md text-gray-300">Try a different name or code</p>
            </div>
          ) : (
            <ul className="py-1.5">
              {filteredStations.map((station) => {
                const isSelected = value === station.station_code
                return (
                  <li key={station.id}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(station)}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition',
                        isSelected
                          ? 'bg-indigo-50 text-indigo-900'
                          : 'text-gray-700 hover:bg-slate-50 dark:bg-slate-950'
                      )}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                        {isSelected ? (
                          <CheckIcon />
                        ) : (
                          <span className="text-gray-300">
                            <MapPinIcon />
                          </span>
                        )}
                      </span>

                      <span className="flex flex-col min-w-0">
                        <span className={cn('font-medium truncate', isSelected ? 'text-indigo-700' : 'text-gray-800')}>
                          {station.station_name}
                          <span className={cn('ml-1.5 font-mono text-xs', isSelected ? 'text-indigo-400' : 'text-gray-400')}>
                            ({station.station_code})
                          </span>
                        </span>
                        {station.city && (
                          <span className="text-xs text-gray-400 truncate">
                            {station.city}
                            {station.state ? `, ${station.state}` : ''}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
