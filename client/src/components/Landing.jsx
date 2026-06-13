import React from 'react'
import { Stethoscope, ArrowUpRight, CalendarDays, FileText, Users, BarChart2 } from 'lucide-react'

const neuCard = `
    bg-[#F1F5FE]
    rounded-2xl
    shadow-[8px_8px_20px_rgba(18,34,62,0.10),-8px_-8px_20px_rgba(255,255,255,0.85)]
    transition-all duration-300 ease-out
    hover:shadow-[12px_12px_28px_rgba(18,34,62,0.13),-12px_-12px_28px_rgba(255,255,255,0.9)]
    hover:-translate-y-1
`

const features = [
    {
        icon: CalendarDays,
        title: 'Smart Scheduling',
        desc: 'Effortlessly manage appointments and recurring sessions without the back-and-forth.',
    },
    {
        icon: Users,
        title: 'Client Management',
        desc: 'Keep client records, histories and treatment plans organized in one place.',
    },
    {
        icon: FileText,
        title: 'Session Notes',
        desc: 'Capture and access clinical notes securely from anywhere, anytime.',
    },
    {
        icon: BarChart2,
        title: 'Practice Insights',
        desc: 'Track appointments, revenue, and practice performance at a glance.',
    },
]

function Landing() {
  return (
    <div className="min-h-screen bg-[#EEF2FB] font-sans">

      {/* ── Nav ── */}
        <nav className="flex items-center justify-between px-6 sm:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-cyan-500" />
            <span className="font-bold text-[#12223E] text-lg tracking-wide">theralog</span>
        </div>
        <button
            className="text-sm font-semibold text-[#4A6EA0] border border-[#4A6EA0]/30 px-5 py-2.5 rounded-xl
            shadow-[4px_4px_10px_rgba(18,34,62,0.08),-4px_-4px_10px_rgba(255,255,255,0.85)]
            hover:shadow-[6px_6px_14px_rgba(18,34,62,0.12),-6px_-6px_14px_rgba(255,255,255,0.9)]
            transition-all duration-300 hover:-translate-y-0.5"
        >
            Sign in
        </button>
        </nav>

      {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center pt-16 pb-20 px-6 sm:px-12 max-w-5xl mx-auto">

        {/* Eyebrow pill */}
        <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-xs font-semibold tracking-widest uppercase text-cyan-600
            bg-[#F1F5FE]
            shadow-[4px_4px_10px_rgba(18,34,62,0.08),-4px_-4px_10px_rgba(255,255,255,0.9)]"
        >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Built for psychologists
        </div>

        <h1 className="font-extrabold leading-tight tracking-tight text-[#12223E] mb-5
            text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
            Practice Smarter.{' '}
            <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Care Better.
            </span>
        </h1>

        <p className="font-light font-mono italic text-[#4A6EA0] max-w-xl text-sm sm:text-base leading-relaxed mb-12">
            Theralog helps psychologists manage appointments, client records,
            session notes, and schedules — all from one secure platform.
        </p>

        {/* CTA card */}
        <div className={`${neuCard} w-full max-w-xs p-8 flex flex-col items-center gap-5`}>
          {/* Icon with inner neumorphic well */}
            <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center
                shadow-[inset_4px_4px_10px_rgba(18,34,62,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]
                bg-[#E8EEFA]"
            >
            <Stethoscope className="w-9 h-9 text-cyan-500" />
            </div>

            <div>
                <h2 className="font-bold text-xl text-[#12223E] mb-1">Clinician Portal</h2>
                <p className="text-[#4A6EA0] font-light italic text-xs leading-relaxed">
                    Admit clients, schedule appointments,<br />create sessions and referrals
                </p>
            </div>

            <button
            className="w-full bg-[#12223E] px-6 py-3.5 flex items-center justify-center gap-2
                font-semibold text-white text-sm rounded-xl
                shadow-[4px_4px_14px_rgba(18,34,62,0.3),-2px_-2px_8px_rgba(255,255,255,0.6)]
                hover:bg-[#1a3260] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[6px_6px_18px_rgba(18,34,62,0.35)]"
            >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>
        </section>

      {/* ── Feature strip ── */}
        <section className="px-6 sm:px-12 pb-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="font-bold text-[#12223E] mb-2
            text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            Why Choose Theralog
            </h2>
            <p className="text-[#4A6EA0] font-light italic font-mono text-sm sm:text-base">
            Because your focus should be on people, not paperwork.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${neuCard} p-7 flex flex-col gap-4`}>
              {/* Icon well */}
                <div
                className="w-11 h-11 rounded-xl flex items-center justify-center
                    shadow-[inset_3px_3px_8px_rgba(18,34,62,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]
                    bg-[#E8EEFA]"
                >
                <Icon className="w-5 h-5 text-[#4A6EA0]" />
                </div>

                <div>
                <h3 className="font-bold text-[#12223E] text-base mb-1">{title}</h3>
                <p className="text-[#4A6EA0] font-light italic font-mono text-xs leading-relaxed">{desc}</p>
                </div>
            </div>
            ))}
        </div>
        </section>

      {/* ── Footer note ── */}
        <footer className="text-center pb-10 text-xs text-[#4A6EA0]/60 font-mono italic">
        © {new Date().getFullYear()} Theralog · Built for mental health professionals
        </footer>
    </div>
  )
}

export default Landing