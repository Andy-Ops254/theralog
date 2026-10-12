import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

function Referrals() {
  const [referrals, setReferrals] = useState([])
  const [patients, setPatients] = useState([])
  const [sessions, setSessions] = useState([])
  const [search, setSearch] = useState('')
  const [selectedReferral, setSelectedReferral] = useState(null)
  const [editingReferral, setEditingReferral] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: '',
    referred_to: '',
    reason: '',
    summary: '',
    sessions_completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const hasToken = Boolean(localStorage.getItem('token'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    Promise.all([
      fetch('http://127.0.0.1:5000/referrals', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch('http://127.0.0.1:5000/patients', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch('http://127.0.0.1:5000/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(async ([referralResponse, patientResponse, sessionResponse]) => {
        if (!referralResponse.ok) throw new Error('Failed to fetch referrals')
        if (!patientResponse.ok) throw new Error('Failed to fetch patients')
        const [referralData, patientData, sessionData] = await Promise.all([
          referralResponse.json(),
          patientResponse.json(),
          sessionResponse.ok ? sessionResponse.json() : Promise.resolve({ sessions: [] }),
        ])
        setReferrals(referralData.referrals || [])
        setPatients(patientData.patients || [])
        setSessions(sessionData.sessions || [])
      })
      .catch((fetchError) => setError(fetchError.message || 'Failed to load referrals'))
      .finally(() => setLoading(false))
  }, [])

  function getReferralPatient(referral) {
    return patients.find((item) =>
      String(item.id) === String(referral.patient_id ?? referral.id)
    )
  }

  function getPatientName(referral) {
    const patient = getReferralPatient(referral)
    return referral.patient_name || referral.patient?.full_name || patient?.full_name || ''
  }

  const filteredReferrals = referrals.filter((referral) =>
    `${getPatientName(referral)} ${referral.referred_to || ''} ${referral.reason || ''} ${referral.summary || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function completedSessionsFor(patientId) {
    return sessions.filter((session) =>
      String(session.patient_id) === String(patientId) &&
      String(session.status || '').toLowerCase() === 'complete'
    ).length
  }

  function getReasonPreview(reason) {
    const words = String(reason || '').trim().split(/\s+/).filter(Boolean)
    return words.length > 10 ? `${words.slice(0, 10).join(' ')}...` : reason || '—'
  }

  function openNewReferral() {
    const firstPatient = patients[0]
    setEditingReferral(null)
    setFormData({
      patient_id: firstPatient?.id || '',
      referred_to: '',
      reason: '',
      summary: '',
      sessions_completed: firstPatient ? completedSessionsFor(firstPatient.id) : 0,
    })
    setError('')
    setIsFormOpen(true)
  }

  function openEditReferral(referral) {
    setEditingReferral(referral)
    setFormData({
      patient_id: referral.patient_id || getReferralPatient(referral)?.id || '',
      referred_to: referral.referred_to || '',
      reason: referral.reason || '',
      summary: referral.summary || '',
      sessions_completed: referral.sessions_completed || 0,
    })
    setSelectedReferral(null)
    setError('')
    setIsFormOpen(true)
  }

  function handlePatientChange(event) {
    const patientId = event.target.value
    setFormData((current) => ({
      ...current,
      patient_id: patientId,
      sessions_completed: completedSessionsFor(patientId),
    }))
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleSaveReferral(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Not Authorized!')
      return
    }

    setSaving(true)
    setError('')
    fetch(
      editingReferral
        ? `http://127.0.0.1:5000/referrals/${editingReferral.id}`
        : 'http://127.0.0.1:5000/referrals',
      {
        method: editingReferral ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          patient_id: Number(formData.patient_id),
          sessions_completed: Number(formData.sessions_completed),
        }),
      }
    )
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Failed to save referral')
        return data
      })
      .then((savedReferral) => {
        if (!savedReferral || savedReferral.id == null) {
          throw new Error('The API returned no referral ID. Restart the server to load the latest referral routes.')
        }

        if (editingReferral) {
          setReferrals((current) => current.map((referral) =>
            referral.id === savedReferral.id ? savedReferral : referral
          ))
          setSelectedReferral(savedReferral)
        } else {
          setReferrals((current) => [savedReferral, ...current])
        }
        setIsFormOpen(false)
        setEditingReferral(null)
      })
      .catch((saveError) => setError(saveError.message || 'Failed to save referral'))
      .finally(() => setSaving(false))
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingReferral(null)
    setError('')
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-4xl border border-white/40 bg-white/50 px-6 py-5 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#12223E]">Referrals</h2>
          <p className="mt-1 text-sm text-[#4A6EA0]">Review and manage client referrals</p>
        </div>
        <button
          type="button"
          onClick={openNewReferral}
          disabled={!patients.length}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[#12223E] px-4 py-2 font-semibold text-white shadow-[6px_6px_12px_rgba(18,34,62,0.2),-6px_-6px_12px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-2xl leading-none">+</span>
          <span>New referral</span>
        </button>
      </div>

      <label className="inline-flex w-full max-w-lg items-center gap-3 rounded-3xl border border-white/40 bg-white/50 px-4 py-3 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
        <Search className="h-4 w-4 shrink-0 text-[#4A6EA0]" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by client, provider, or reason..."
          className="min-w-0 flex-1 bg-transparent text-sm text-[#12223E] outline-none placeholder:text-[#4A6EA0]"
        />
      </label>

      {(error || !hasToken) && !isFormOpen && (
        <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error || 'Not Authorized!'}</p>
      )}

      <div className="overflow-x-auto rounded-4xl border border-white/40 bg-white/60 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
        <table className="min-w-full divide-y divide-[#12223E]/10 text-left text-sm text-[#12223E]">
          <thead className="bg-[#12223E]/5 text-xs font-semibold uppercase tracking-[0.2em] text-[#4A6EA0]">
            <tr>
              <th className="px-4 py-3 sm:px-6">Client</th>
              <th className="px-4 py-3 sm:px-6">Referred to</th>
              <th className="px-4 py-3 sm:px-6">Reason</th>
              <th className="px-4 py-3 sm:px-6">Sessions</th>
              <th className="px-4 py-3 sm:px-6">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#12223E]/10 bg-white/40">
            {!hasToken ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-[#4A6EA0]">Not Authorized!</td></tr>
            ) : loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-[#4A6EA0]">Loading referrals...</td></tr>
            ) : filteredReferrals.length ? filteredReferrals.map((referral, index) => (
              <tr
                key={referral.id ?? `referral-${referral.patient_id ?? index}`}
                tabIndex={0}
                role="button"
                onClick={() => setSelectedReferral(referral)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedReferral(referral)
                  }
                }}
                className="cursor-pointer transition-colors hover:bg-cyan-50/60 focus:bg-cyan-50/60 focus:outline-none"
              >
                <td className="px-4 py-3 font-medium sm:px-6">{getPatientName(referral) || '—'}</td>
                <td className="px-4 py-3 sm:px-6">{referral.referred_to || '—'}</td>
                <td className="max-w-xs px-4 py-3 sm:px-6" title={referral.reason || ''}>{getReasonPreview(referral.reason)}</td>
                <td className="px-4 py-3 sm:px-6">{referral.sessions_completed ?? 0}</td>
                <td className="px-4 py-3 sm:px-6">{referral.created_at ? new Date(referral.created_at).toLocaleDateString() : '—'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-sm text-[#4A6EA0] sm:px-6">
                  <p className="font-medium">{search ? 'No matching referrals' : 'No referrals yet'}</p>
                  <p className="mt-1 text-xs text-[#4A6EA0]/70">
                    {search ? 'Try a different client, provider, or reason.' : 'Create a referral to see it listed here.'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12223E]/35 p-4" onClick={() => setSelectedReferral(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="referral-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/60 bg-[#E8EEFA] p-6 shadow-[16px_16px_40px_rgba(15,23,42,0.2),-12px_-12px_30px_rgba(255,255,255,0.75)] sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="referral-title" className="text-xl font-semibold text-[#12223E]">Referral details</h2>
                <p className="mt-1 text-sm text-[#4A6EA0]">{getPatientName(selectedReferral) || 'Client'}</p>
              </div>
              <button type="button" aria-label="Close details" onClick={() => setSelectedReferral(null)} className="rounded-xl p-2 text-[#4A6EA0] hover:bg-white/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-semibold uppercase text-[#4A6EA0]">Referred to</dt><dd className="mt-1 text-sm text-[#12223E]">{selectedReferral.referred_to || '—'}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-[#4A6EA0]">Sessions completed</dt><dd className="mt-1 text-sm text-[#12223E]">{selectedReferral.sessions_completed ?? 0}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-[#4A6EA0]">Reason</dt><dd className="mt-1 whitespace-pre-wrap text-sm text-[#12223E]">{selectedReferral.reason || '—'}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-[#4A6EA0]">Summary</dt><dd className="mt-1 whitespace-pre-wrap text-sm text-[#12223E]">{selectedReferral.summary || '—'}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-[#4A6EA0]">Created</dt><dd className="mt-1 text-sm text-[#12223E]">{selectedReferral.created_at ? new Date(selectedReferral.created_at).toLocaleString() : '—'}</dd></div>
            </dl>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={() => openEditReferral(selectedReferral)} className="rounded-2xl bg-[#12223E] px-5 py-3 text-sm font-semibold text-white shadow-[6px_6px_16px_rgba(15,23,42,0.18),-6px_-6px_16px_rgba(255,255,255,0.75)] transition hover:scale-[1.02]">
                Edit referral
              </button>
            </div>
          </section>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#12223E]/35 p-4" onClick={closeForm}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="referral-form-title"
            onClick={(event) => event.stopPropagation()}
            className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/60 bg-[#E8EEFA] p-6 shadow-[16px_16px_40px_rgba(15,23,42,0.2),-12px_-12px_30px_rgba(255,255,255,0.75)] sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="referral-form-title" className="text-xl font-semibold text-[#12223E]">{editingReferral ? 'Edit referral' : 'New referral'}</h2>
                <p className="mt-1 text-sm text-[#4A6EA0]">Referral information is saved to the client record.</p>
              </div>
              <button type="button" aria-label="Close form" onClick={closeForm} className="rounded-xl p-2 text-[#4A6EA0] hover:bg-white/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveReferral} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-[#12223E]">
                  Client
                  <select required name="patient_id" value={formData.patient_id} onChange={handlePatientChange} className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] outline-none focus:ring-2 focus:ring-[#12223E]/30">
                    <option value="">Select a client</option>
                    {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.full_name}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#12223E]">
                  Referred to
                  <input required name="referred_to" value={formData.referred_to} onChange={handleFormChange} placeholder="Provider or service" className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] outline-none focus:ring-2 focus:ring-[#12223E]/30" />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm font-medium text-[#12223E]">
                Reason for referral
                <span className="text-xs font-normal text-[#4A6EA0]">Keep this brief, up to 10 words. {formData.reason.trim().split(/\s+/).filter(Boolean).length}/10 words</span>
                <textarea required name="reason" value={formData.reason} onChange={(event) => {
                  const value = event.target.value
                  if (value.trim().split(/\s+/).filter(Boolean).length <= 10) handleFormChange(event)
                }} rows="2" className="resize-y rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] outline-none focus:ring-2 focus:ring-[#12223E]/30" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[#12223E]">
                Clinical summary
                <span className="text-xs font-normal text-[#4A6EA0]">Explain the relevant context, what has been tried, and what support is being requested.</span>
                <textarea name="summary" value={formData.summary} onChange={handleFormChange} rows="4" className="resize-y rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] outline-none focus:ring-2 focus:ring-[#12223E]/30" />
              </label>
              <label className="flex max-w-xs flex-col gap-2 text-sm font-medium text-[#12223E]">
                Sessions completed
                <input type="number" min="0" name="sessions_completed" value={formData.sessions_completed} onChange={handleFormChange} className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] outline-none focus:ring-2 focus:ring-[#12223E]/30" />
              </label>
              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
              <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#12223E]/10 pt-5 sm:flex-row">
                <button type="button" onClick={closeForm} className="rounded-2xl px-5 py-3 text-sm font-medium text-[#12223E] shadow-[6px_6px_16px_rgba(15,23,42,0.10),-6px_-6px_16px_rgba(255,255,255,0.8)]">Cancel</button>
                <button type="submit" disabled={saving || !patients.length} className="rounded-2xl bg-[#12223E] px-5 py-3 text-sm font-semibold text-white shadow-[6px_6px_16px_rgba(15,23,42,0.18),-6px_-6px_16px_rgba(255,255,255,0.75)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? 'Saving...' : editingReferral ? 'Save changes' : 'Create referral'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Referrals
