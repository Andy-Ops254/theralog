import { useEffect, useState } from 'react'
import { LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const hasToken = Boolean(localStorage.getItem('token'))
  const [loading, setLoading] = useState(hasToken)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://127.0.0.1:5000/clinician/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Could not load profile')
        return data
      })
      .then((data) => {
        setProfile(data)
        setFormData({ name: data.name || '', email: data.email || '' })
        const savedClinician = JSON.parse(localStorage.getItem('clinician') || '{}')
        localStorage.setItem('clinician', JSON.stringify({ ...savedClinician, ...data }))
      })
      .catch((requestError) => setError(requestError.message || 'Could not load profile'))
      .finally(() => setLoading(false))
  }, [])

  const initials = (profile?.name || profile?.email || 'U')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setSuccess('')
  }

  function handleSave(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Not authorized. Please sign in again.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')
    fetch('http://127.0.0.1:5000/clinician/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Could not save profile')
        return data
      })
      .then((data) => {
        setProfile(data)
        setFormData({ name: data.name || '', email: data.email || '' })
        const savedClinician = JSON.parse(localStorage.getItem('clinician') || '{}')
        localStorage.setItem('clinician', JSON.stringify({ ...savedClinician, ...data }))
        setSuccess('Profile updated.')
      })
      .catch((requestError) => setError(requestError.message || 'Could not save profile'))
      .finally(() => setSaving(false))
  }

  function handleLogout() {
    const token = localStorage.getItem('token')
    if (!token) {
      localStorage.removeItem('clinician')
      navigate('/signin', { replace: true })
      return
    }

    setLoggingOut(true)
    setError('')
    fetch('http://127.0.0.1:5000/logout', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Could not log out')
        localStorage.removeItem('token')
        localStorage.removeItem('clinician')
        navigate('/signin', { replace: true })
      })
      .catch((requestError) => {
        setError(requestError.message || 'Could not log out')
        setLoggingOut(false)
      })
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="rounded-4xl border border-white/40 bg-white/50 px-6 py-5 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
        <h1 className="text-lg font-semibold text-[#12223E]">Profile settings</h1>
        <p className="mt-1 text-sm text-[#4A6EA0]">Manage your account details</p>
      </header>

      {(error || !hasToken) && <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error || 'Not authorized. Please sign in again.'}</p>}
      {success && <p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}

      {loading ? (
        <p className="py-10 text-center text-sm text-[#4A6EA0]">Loading profile...</p>
      ) : profile ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.4fr)]">
          <section className="rounded-4xl border border-white/40 bg-white/55 p-6 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-[#E8EEFA] text-2xl font-semibold text-[#12223E] shadow-[inset_6px_6px_14px_rgba(15,23,42,0.10),inset_-6px_-6px_14px_rgba(255,255,255,0.9)]" aria-label={`${profile.name || 'User'} initials`}>
                {initials}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[#12223E]">{profile.name}</h2>
              <p className="mt-1 text-sm text-[#4A6EA0]">{profile.role || 'Clinician'}</p>
            </div>

            <dl className="mt-8 space-y-4 border-t border-[#12223E]/10 pt-5">
              <div className="flex items-center gap-3 text-sm text-[#12223E]">
                <Mail className="h-4 w-4 shrink-0 text-[#4A6EA0]" />
                <dd className="min-w-0 break-all">{profile.email}</dd>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#12223E]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#4A6EA0]" />
                <dd>{profile.is_active === false ? 'Inactive account' : 'Active account'}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[6px_6px_16px_rgba(127,29,29,0.20)] transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:cursor-wait disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? 'Signing out...' : 'Log out'}
            </button>
          </section>

          <section className="rounded-4xl border border-white/40 bg-white/55 p-6 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-[#12223E]/10 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8EEFA] text-[#12223E] shadow-[inset_4px_4px_9px_rgba(15,23,42,0.08),inset_-4px_-4px_9px_rgba(255,255,255,0.9)]">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#12223E]">Personal details</h2>
                <p className="mt-1 text-sm text-[#4A6EA0]">Update the name and email on your account.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <label className="flex flex-col gap-2 text-sm font-medium text-[#12223E]">
                Full name
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] outline-none focus:ring-2 focus:ring-[#12223E]/30"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[#12223E]">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] outline-none focus:ring-2 focus:ring-[#12223E]/30"
                />
              </label>
              <div className="flex justify-end border-t border-[#12223E]/10 pt-5">
                <button
                  type="submit"
                  disabled={saving || loggingOut}
                  className="rounded-2xl bg-[#12223E] px-5 py-3 text-sm font-semibold text-white shadow-[6px_6px_16px_rgba(15,23,42,0.18),-6px_-6px_16px_rgba(255,255,255,0.75)] transition hover:bg-[#1a3260] disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default Settings
