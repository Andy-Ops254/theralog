import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeIcon, CalendarIcon, Users, UserIcon, ChartBarIcon, CogIcon, LogOut, BellDot, Moon } from 'lucide-react'
import SidebarLink from './SidebarLink'

function Sidebar({ isExpanded }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('clinician')
    // console.log('umbwa')
    navigate('/signin')
  }

    return (
    <aside className={`flex h-screen flex-col border-r border-white/20 bg-white/10 px-3 py-4 shadow-2xl shadow-slate-950/10 backdrop-blur-md backdrop-saturate-200 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
        <div className="flex items-center justify-between px-2 pb-4">
        <span className={`overflow-hidden text-sm font-semibold tracking-[0.2em] text-[#12223E] transition-all duration-200 ${isExpanded ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'}`}>
            MENU
        </span>
    </div>

        <nav className="flex flex-col gap-2">
            <SidebarLink icon={<HomeIcon />} label="Dashboard" href="/dashboard" isExpanded={isExpanded} />
            <SidebarLink icon={<UserIcon />} label="Patients" href="/patients" isExpanded={isExpanded} />
            <SidebarLink icon={<CalendarIcon />} label="Sessions" href="/sessions" isExpanded={isExpanded} />
            {/* <SidebarLink icon={<Users />} label="Psychologists" href="/psychologists" isExpanded={isExpanded} /> */}
            <SidebarLink icon={<ChartBarIcon />} label="Referrals" href="/referrals" isExpanded={isExpanded} />
            <SidebarLink icon={<CogIcon />} label="Settings" href="/settings" isExpanded={isExpanded} />
        </nav>

        <div className={`mt-auto flex flex-col gap-2 pt-6 ${isExpanded ? 'items-stretch px-2' : 'items-center px-0'}`}>
        <div className="flex flex-col gap-2 md:hidden">
            <button className={`flex w-full items-center rounded-xl px-3 py-2 text-[#12223E] transition-all duration-200 hover:scale-105 hover:bg-slate-100/40 ${isExpanded ? 'justify-start gap-3' : 'justify-center px-2'}`}>
            <span className="rounded-xl bg-white/20 p-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
                <BellDot className="h-5 w-5 text-cyan-500" />
            </span>
            <span className={`text-sm font-semibold ${isExpanded ? 'block' : 'hidden'}`}>Notifications</span>
            </button>

            <button className={`flex w-full items-center rounded-xl px-3 py-2 text-[#12223E] transition-all duration-200 hover:scale-105 hover:bg-slate-100/40 ${isExpanded ? 'justify-start gap-3' : 'justify-center px-2'}`}>
            <span className="rounded-xl bg-white/20 p-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
                <Moon className="h-5 w-5 text-cyan-500" />
            </span>
            <span className={`text-sm font-semibold ${isExpanded ? 'block' : 'hidden'}`}>Dark Mode</span>
            </button>
        </div>

        <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-[#12223E] transition-all duration-200 hover:bg-red-100/40 hover:text-red-500 ${isExpanded ? 'justify-start gap-3' : 'justify-center px-3'}`}
            >
            <span className="rounded-xl bg-white/20 p-2 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
            <LogOut className="h-5 w-5 text-cyan-500" />
            </span>
            <span className={`font-semibold ${isExpanded ? 'block' : 'hidden'}`}>Sign Out</span>
        </button>
        </div>
    </aside>
  )
}

export default Sidebar