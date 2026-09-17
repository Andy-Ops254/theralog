import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { X } from 'lucide-react'

function AddSessionForm({ onSaveDraft, onSave, onCloseModal, patientId, patientName }) {

  const [expanded, setExpanded] = useState(null)
  const [sessionDetails, setSessionDetails] = useState({
    session_date: '',
    duration: '',
  })
  const [notes, setNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState("Scheduled")
  const [sessionType, setSessionType] = useState("Follow-up")
  const token = localStorage.getItem('token')
  const user = token ? jwtDecode(token) : null
  const psychologist = user?.name || ''

  const handleSaveDraft = () => {
    const savedAt = new Date()
    setLastSaved(savedAt)
    onSaveDraft?.({ ...sessionDetails, patient_id: patientId, status, sessionType, psychologist, notes })
  }

  const handleFinalize = () => {
    setSaveError('')
    setIsSaving(true)

    Promise.resolve(onSave?.({ ...sessionDetails, patient_id: patientId, status, sessionType, psychologist, notes }))
      .then(() => onCloseModal())
      .catch((error) => setSaveError(error.message || 'Failed to save session'))
      .finally(() => setIsSaving(false))
  }

  const handleDetailChange = (event) => {
    const { name, value } = event.target
    setSessionDetails((current) => ({ ...current, [name]: value }))
  }

  const updateNote = (key, value) => setNotes((current) => ({ ...current, [key]: value }))

  const SOAP_SECTIONS = [
  
  {
    key: "subjective",
    label: "Subjective",
    hint: "What the client reported — in their own words where relevant.",
  },
  {
    key: "objective",
    label: "Objective",
    hint: "What you observed — affect, presentation, behavior.",
  },
  {
    key: "assessment",
    label: "Assessment",
    hint: "Clinical interpretation, progress toward treatment goals.",
  },
  {
    key: "plan",
    label: "Plan",
    hint: "Next steps, homework, referrals, follow-up cadence.",
  },
];
  return (
    <div className='rounded-[28px] border border-white/50 bg-white/45 p-8 shadow-[16px_16px_40px_rgba(15,23,42,0.10),-16px_-16px_40px_rgba(255,255,255,0.85)] backdrop-blur-md'>
      <div className='mb-8 flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold text-[#12223E]'>New Session</h1>
          <p className='mt-1 text-sm text-[#12223E]/60'>Patient: {patientName}</p>
        </div>
        <div className='flex items-start gap-4'>
          <div className='text-right text-xs font-light text-[#12223E]/60'>
            {lastSaved
              ? `Draft saved ${lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
              : "Not saved yet"
            }
          </div>
          <button
            type='button'
            onClick={onCloseModal}
            aria-label='Close new session form'
            className='rounded-full p-1 text-[#12223E]/60 transition hover:bg-[#12223E]/10 hover:text-[#12223E] focus:outline-none focus:ring-2 focus:ring-[#12223E]/30'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
        <label htmlFor='session_date' className='flex flex-col text-sm font-medium text-[#12223E]'>
          Date
          <input 
            id='session_date'
            type='date'
            name='session_date'
            value={sessionDetails.session_date}
            onChange={handleDetailChange}
            className='mt-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-[#12223E] shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] transition focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 focus:ring-offset-1'
          />
        </label>

        <label htmlFor='duration' className='flex flex-col text-sm font-medium text-[#12223E]'>
          Duration
          <input 
            id='duration'
            type='number'
            name='duration'
            value={sessionDetails.duration}
            onChange={handleDetailChange}
            className='mt-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-[#12223E] shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] transition focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 focus:ring-offset-1'
          />
        </label>

        <label htmlFor='psychologist' className='flex flex-col text-sm font-medium text-[#12223E]'>
          Psychologist
          <input
            id='psychologist'
            type='text'
            name='psychologist'
            value={psychologist}
            readOnly
            className='mt-2 cursor-not-allowed rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-[#12223E] shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] transition focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 focus:ring-offset-1'
          />
        </label>

        <label htmlFor='sessionType' className='flex flex-col text-sm font-medium text-[#12223E]'>
          Session type
          <select
            id='sessionType'
            name='sessionType'
            value={sessionType}
            onChange={(event) => setSessionType(event.target.value)}
            className='mt-2 cursor-pointer rounded-2xl border border-white/60 bg-[#F1F5FE]/80 px-4 py-3 text-[#12223E] shadow-[6px_6px_14px_rgba(15,23,42,0.08),-6px_-6px_14px_rgba(255,255,255,0.8)] transition hover:border-[#12223E]/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 focus:ring-offset-1'
          >
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              Individual
            </option>
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              Group
            </option>
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              Follow-up
            </option>
          </select>
        </label>

        <label htmlFor='status' className='flex flex-col text-sm font-medium text-[#12223E]'>
          Status
          <select
            id='status'
            name='status'
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className='mt-2 cursor-pointer rounded-2xl border border-white/60 bg-[#F1F5FE]/80 px-4 py-3 text-[#12223E] shadow-[6px_6px_14px_rgba(15,23,42,0.08),-6px_-6px_14px_rgba(255,255,255,0.8)] transition hover:border-[#12223E]/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 focus:ring-offset-1'
          >
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              Scheduled
            </option>
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              Incomplete
            </option>
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              Complete
            </option>
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              No-show
            </option>
            <option className='bg-[#F1F5FE] text-[#12223E]'>
              Cancelled
            </option>
          </select>
        </label>
      </div>

      <div className='mt-8'>
        <div>
          <h2 className='mb-4 text-lg font-semibold text-[#12223E]'>
            Clinical Notes
          </h2>

          {SOAP_SECTIONS.map((section)=> (
            <div key={section.key} className='mb-4'> 
            <div className='mb-2 flex items-center justify-between'>
              <label htmlFor={section.key} className='text-sm font-medium text-[#12223E]'>
                {section.label}
              </label>
              <button 
              type='button'
              onClick={()=> setExpanded(expanded===section.key? null : section.key)}
              >
                {expanded===section.key?'expand' : 'collapse'}
              </button>
            </div>

            <textarea
            id={section.key}
            value={notes[section.key]}
            onChange={(e)=> updateNote(section.key, e.target.value)}
            placeholder='write clients information here'
            rows={expanded===section.key ? 10 : 3}
            className='w-full resize-y rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-sm text-[#12223E] placeholder:text-slate-400 shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)] transition focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 focus:ring-offset-1'
            />
            </div>
          )
          )}
        </div>

        <div className='flex flex-col items-start justify-between gap-4 border-t border-[#12223E]/10 pt-5 sm:flex-row sm:items-center'>
          <span className='text-xs font-light text-[#12223E]/60'>
            Notes will auto save locally as you type, finalize to lock the record
          </span>
          <div className='flex w-full justify-end gap-3 sm:w-auto'>
            <button
            type='button'
            onClick={handleSaveDraft}
            className='rounded-2xl border border-white/60 bg-transparent px-5 py-3 text-sm font-medium text-[#12223E] shadow-[6px_6px_16px_rgba(15,23,42,0.10),-6px_-6px_16px_rgba(255,255,255,0.8)] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 active:shadow-[inset_4px_4px_10px_rgba(15,23,42,0.15),inset_-4px_-4px_10px_rgba(255,255,255,0.8)]'
            >
              Save draft
            </button>

            <button
            type='button'
            onClick={handleFinalize}
            disabled={isSaving}
            className='rounded-2xl bg-[#12223E] px-5 py-3 text-sm font-medium text-white shadow-[6px_6px_16px_rgba(15,23,42,0.18),-6px_-6px_16px_rgba(255,255,255,0.75)] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.2),inset_-4px_-4px_10px_rgba(255,255,255,0.15)]'
            >
              {isSaving ? 'Saving...' : 'Finalize session'}
            </button>
          </div>
          {saveError && <p className='w-full text-right text-sm text-red-600'>{saveError}</p>}
        </div>
      </div>
    </div>
  )
}

export default AddSessionForm
