import React, { cloneElement } from 'react'
import { Link } from 'react-router-dom'

function SidebarLink({ icon, label, href }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#12223E] font-semibold transition-all duration-200 hover:scale-105 hover:bg-slate-100/40"
    >
      <span className="p-2 rounded-xl bg-white/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
        {cloneElement(icon, { className: 'w-5 h-5 text-cyan-500' })}
      </span>
      <span>{label}</span>
    </Link>
  )
}

export default SidebarLink