import React, { cloneElement } from 'react'
import { Link } from 'react-router-dom'

function SidebarLink({ icon, label, href, isExpanded }) {
  return (
    <Link
      to={href}
      className={`flex items-center rounded-xl px-4 py-3 font-semibold text-[#12223E] transition-all duration-200 hover:scale-105 hover:bg-slate-100/40 ${isExpanded ? 'gap-3' : 'justify-center px-3'}`}
    >
      <span className="rounded-xl bg-white/20 p-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
        {cloneElement(icon, { className: 'h-5 w-5 text-cyan-500' })}
      </span>
      <span className={`truncate transition-all duration-200 ${isExpanded ? 'block' : 'hidden'}`}>{label}</span>
    </Link>
  )
}

export default SidebarLink