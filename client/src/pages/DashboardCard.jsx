import React from 'react'

function DashboardCard({ title, children }) {
  return (
    <div className="flex h-36 w-64 flex-col justify-between rounded-[2rem] border border-white/40 bg-[linear-gradient(145deg,_rgba(255,255,255,0.95),_rgba(223,238,255,0.9))] p-5 shadow-[20px_20px_60px_rgba(15,23,42,0.14),-20px_-20px_60px_rgba(255,255,255,0.88)]">
        <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#12223E]/70">
                {title}
            </h3>
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500/80" />
        </div>

        <div className="mt-auto text-3xl font-semibold tracking-tight text-[#12223E]">
            
            {children}
        </div>

    </div>
  )
}

export default DashboardCard