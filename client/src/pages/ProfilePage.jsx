import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || '',
      })
      setLoading(false)
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/profile/update', formData)
      alert('Profile updated successfully!')
    } catch {
      alert('Failed to update profile.')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete('/profile/delete')
      logout()
      navigate('/')
    } catch {
      alert('Failed to delete account.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <p className="text-sm text-gray-600">Update your personal details here.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Update Profile
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">Permanently delete your account and all data.</p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
