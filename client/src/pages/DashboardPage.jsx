import React from 'react'
import { useNavigate } from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import image1 from '../assets/images/image1.png'
import image2 from '../assets/images/image2.png'
import image3 from '../assets/images/image3.png'
import image4 from '../assets/images/image4.png'
import image5 from '../assets/images/image.png'

const popularRoutes = [
  {
    from: 'NDLS',
    to: 'BCT',
    title: 'New Delhi to Mumbai Central',
    description: 'Premium Rajdhani and express connections on India’s busiest corridor.',
    image: image1,
  },
  {
    from: 'HWH',
    to: 'NDLS',
    title: 'Howrah to New Delhi',
    description: 'East-West premium services with high-demand seat predictions.',
    image: image2,
  },
  {
    from: 'NDLS',
    to: 'LKO',
    title: 'New Delhi to Lucknow',
    description: 'Fast Shatabdi and express trains for quick business and leisure travel.',
    image: image3,
  },
  {
    from: 'BCT',
    to: 'ADI',
    title: 'Mumbai Central to Ahmedabad',
    description: 'Western corridor routes with modern comfort and fast connections.',
    image: image4,
  },
  {
    from: 'BPL',
    to: 'NGP',
    title: 'Bhopal to Nagpur',
    description: 'Central India route with reliable daytime services and seat forecasts.',
    image: image5,
  },
]

const DashboardPage = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-20">
      <section className="relative rounded-3xl min-h-720px flex flex-col overflow-visible">

        <img
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1920&q=80"
          alt="Train journey"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-b from-indigo-900/70 via-indigo-900/60 to-indigo-950/90" />

        <div className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-10 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-16 pb-8 text-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-100 mb-5 backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Powered Train Booking
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Your Journey,
            <span className="bg-linear-to-r from-violet-300 to-indigo-200 bg-clip-text text-transparent">
              {" "}Perfectly Planned
            </span>
          </h1>

          <p className="max-w-xl text-base md:text-lg text-indigo-200 mt-5">
            Search thousands of routes, check AI confirmation predictions,
            and book your seat with confidence.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-10">

            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3">
              <h3 className="text-2xl font-bold text-white">500+</h3>
              <p className="text-indigo-200 text-xs">Routes Covered</p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3">
              <h3 className="text-2xl font-bold text-white">2M+</h3>
              <p className="text-indigo-200 text-xs">Happy Travellers</p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3">
              <h3 className="text-2xl font-bold text-white">99.4%</h3>
              <p className="text-indigo-200 text-xs">Prediction Accuracy</p>
            </div>

          </div>

        </div>

        <div className="relative z-30 mx-auto w-full max-w-6xl px-5  pb-20">

<div className="relative rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-white/60 p-10">
            <SearchForm />

          </div>

        </div>

      </section>

      <div className="h-8" />

      <section className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200/80 bg-slate-50 p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-indigo-600">Top 5 popular routes</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Instant route access with verified search links</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Pick a popular corridor and go immediately to search results using exact route query parameters.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map(({ from, to, title, description, image }) => (
            <button
              key={`${from}-${to}`}
              type="button"
              onClick={() => navigate(`/search?from=${from}&to=${to}`)}
              className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white ring-1 ring-white/10">
                    {from} → {to}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-5 text-left">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                  <span>Search route</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
