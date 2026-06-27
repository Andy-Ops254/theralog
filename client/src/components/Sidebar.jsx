import React from 'react'
import { X, HomeIcon, CalendarIcon, Users, UserIcon, ChartBarIcon, CogIcon, LogOut } from 'lucide-react'
import SidebarLink from './SidebarLink'

function Sidebar({ isOpen, onClose }) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/signin'
  }

  return (
    <div className={`fixed top-0 left-0 h-full w-72 z-50 bg-white/10 backdrop-blur-md backdrop-saturate-200 border-r border-white/20 shadow-2xl shadow-slate-950/10 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col px-2 py-4">
        <div className="flex items-center justify-between px-4 pb-4">
            <span className="font-semibold text-[#12223E]">MENU</span>
            <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)] text-cyan-500 hover:bg-slate-100/40 hover:scale-105 transition-all duration-200"
            >
            <X className="w-5 h-5" />
            </button>
        </div>

        <nav className="flex flex-col gap-2 px-2">
            <SidebarLink icon={<HomeIcon />} label="Dashboard" href="/dashboard" />
            <SidebarLink icon={<CalendarIcon />} label="Sessions" href="/sessions" />
            <SidebarLink icon={<Users />} label="Psychologists" href="/psychologists" />
            <SidebarLink icon={<UserIcon />} label="Patients" href="/patients" />
            <SidebarLink icon={<ChartBarIcon />} label="Referrals" href="/referrals" />
            <SidebarLink icon={<CogIcon />} label="Settings" href="/settings" />
        </nav>

        <div className="mt-auto px-4 pt-6">
            <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-[#12223E] transition-all duration-200 hover:bg-red-100/40 hover:text-red-500"
            >
            <span className="p-2 rounded-xl bg-white/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
                <LogOut className="w-5 h-5 text-cyan-500" />
            </span>
            <span className="font-semibold">Sign Out</span>
            </button>
        </div>
        </div>
    </div>
  )
}

export default Sidebar