import React from 'react'
import {Stethoscope, List, BellDot, LogOut, Moon} from 'lucide-react'

function Navbar() {
  return (
    <nav className="fixed inset-x-4 top-4 z-50 flex min-w-[calc(100%-2rem)] flex-col gap-4 rounded-[2rem] border border-slate-200/30 bg-white/15 px-4 py-3 shadow-2xl shadow-slate-950/20 backdrop-blur-xl text-slate-900 backdrop-saturate-150 sm:inset-x-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#12223E] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30"
        >
          <List className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#12223E]/15 text-[#12223E] shadow-inner shadow-slate-950/20">
            <Stethoscope className="h-6 w-6" />
          </div>

          <div className="flex flex-col leading-tight">
            <h1 className="text-xl font-bold tracking-[0.18em] text-slate-900">THERALOG</h1>
            <p className="max-w-[14rem] text-sm italic tracking-widest text-slate-700">
              CLINIC SYSTEM
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-2 py-2 text-slate-100 shadow-sm shadow-slate-950/10">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-[#12223E] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30">
            <BellDot className="h-5 w-5" />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-[#12223E] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30">
            <Moon className="h-5 w-5" />
          </button>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/30 bg-white/20 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30">
          <LogOut className="h-4 w-4 text-[#12223E]" />
          Sign out
        </button>
      </div>
    </nav>
  )
}

export default Navbar