import React from 'react'
import { Stethoscope, List, BellDot, LogOut, Moon } from 'lucide-react'

function Navbar({ onToggleSidebar }) {
  let username = 'Clinician'

  try {
    const clinician = JSON.parse(localStorage.getItem('clinician'))
    if (clinician) {
      username =
        clinician.username ||
        clinician.name ||
        (clinician.first_name ? `${clinician.first_name}${clinician.last_name ? ` ${clinician.last_name}` : ''}` : null) ||
        'Clinician'
    }
  } catch {
    username = 'Clinician'
  }

  function handleLogout (){
    localStorage.removeItem('clinician')
    localStorage.removeItem('token')
    window.location.href='/'
  }

  return (
    <nav className="mx-4 mb-4 flex items-center justify-between rounded-4xl border border-white/20 bg-white/10 px-6 py-3 text-slate-900 shadow-2xl shadow-slate-950/10 backdrop-blur-md backdrop-saturate-200">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#12223E] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30"
        >
          <List className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#12223E]/15 text-[#12223E] shadow-inner shadow-slate-950/20">
            <Stethoscope className="h-6 w-6" />
          </div>

          <div className="flex flex-col leading-tight">
            <h1 className="text-xl font-bold tracking-[0.18em] text-slate-900">THERALOG</h1>
            <p className="max-w-56 text-sm italic tracking-widest text-slate-700">CLINIC SYSTEM</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="max-w-[120px] truncate text-sm font-semibold text-[#12223E] whitespace-nowrap">
          Welcome, {username}
        </span>

        <div className="hidden items-center gap-2 rounded-2xl bg-white/10 px-2 py-2 text-slate-100 shadow-sm shadow-slate-950/10 sm:flex">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-[#12223E] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30">
            <BellDot className="h-5 w-5" />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-[#12223E] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30">
            <Moon className="h-5 w-5" />
          </button>
        </div>

        <button 
        type='button'
        onClick={handleLogout}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300/30 bg-white/20 px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 sm:px-4">
          <LogOut className="h-4 w-4 text-[#12223E]" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar