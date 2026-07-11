import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

// ── Inline icons ───────────────────────────────────────────────────
const TrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="4" y="3" width="16" height="16" rx="2" />
    <path d="M4 11h16M12 3v8M8 19l-2 3M18 22l-2-3M8 15h0M16 15h0" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

// ── Reusable field ─────────────────────────────────────────────────
const Field = ({ label, icon, type, name, placeholder, value, onChange, required }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400">
        {icon ? icon() : null}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-400/30 hover:border-gray-300"
      />
    </div>
  </div>
)

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup, loginWithGoogle } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(formData.email, formData.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(formData.name, formData.email, formData.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle(credentialResponse.credential)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }

  const isLogin = activeTab === 'login'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">

        {/* ── Brand badge ── */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
            <TrainIcon />
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
              BookMyTrain
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Your AI-powered travel companion</p>
          </div>
        </div>

        {/* ── Tab switcher ── */}
        <div className="mb-4 grid grid-cols-2 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-sm ring-1 ring-gray-100">
          {['login', 'signup'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setError('') }}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* ── Main card ── */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg ring-1 ring-gray-100">

          {/* Card header */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isLogin ? 'Sign in to continue your journey' : 'Join BookMyTrain and travel smarter'}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          {/* ── Login form ── */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="Email" icon={MailIcon} type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              <Field label="Password" icon={LockIcon} type="password" name="password" placeholder="Your password" value={formData.password} onChange={handleChange} required />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300 active:scale-95 disabled:cursor-not-allowed disabled:from-indigo-300 disabled:to-violet-300 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging in…
                  </>
                ) : 'Login →'}
              </button>
            </form>
          ) : (
            /* ── Signup form ── */
            <form onSubmit={handleSignup} className="space-y-4">
              <Field label="Full Name" icon={UserIcon} type="text" name="name" placeholder="Priya Sharma" value={formData.name} onChange={handleChange} required />
              <Field label="Email" icon={MailIcon} type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              <Field label="Password" icon={LockIcon} type="password" name="password" placeholder="Choose a strong password" value={formData.password} onChange={handleChange} required />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300 active:scale-95 disabled:cursor-not-allowed disabled:from-indigo-300 disabled:to-violet-300 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating account…
                  </>
                ) : 'Create Account →'}
              </button>
            </form>
          )}

          {/* ── Divider ── */}
          <div className="relative my-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gray-100" />
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-900 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                or continue with
              </span>
            </div>
          </div>

          {/* ── Google login ── */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div>

        {/* ── Footer note ── */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing you agree to our{' '}
          <span className="font-medium text-indigo-500 cursor-pointer hover:underline">Terms</span>
          {' '}and{' '}
          <span className="font-medium text-indigo-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

export default AuthPage