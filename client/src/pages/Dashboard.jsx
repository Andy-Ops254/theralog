import React, { useEffect, useState } from 'react'
import DashboardCard from './DashboardCard'

function Dashboard() {
    const [dashStats, setDashStats] = useState({
        sessions:0,
        patients:0,
        referrals:0
    })

    const [tableRows, setTableRows] = useState([])

    let username = 'Clinician'

    const clinician = JSON.parse(localStorage.getItem('clinician'))
    if (clinician) {
        username =
            clinician.name ||
            clinician.email ||
            'clinician'
    }

    useEffect (() => {
        const token = localStorage.getItem('token')
        if (!token) {
            return ("Not Authorized!")
        }

        // parallel fetching for both dashstats and weekly sessions for a particular clinician
        Promise.all([
            fetch('http://127.0.0.1:5000/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('http://127.0.0.1:5000/weekly/sessions', {
                headers: { Authorization: `Bearer ${token}` }
            })
        ])
            .then(([res1, res2]) =>
            Promise.all([
                res1.json(),
                res2.status === 204 ? Promise.resolve([]) : res2.json()
            ])
            )
            .then(([stats, sessions]) => {
            setDashStats(stats)
            setTableRows(sessions)
            })
            .catch(err => {
            console.error('Dashboard fetch failed:', err)
            })
    }, [])

  return (
    <div className="space-y-8">
        <div className="rounded-4xl border border-white/40 bg-white/50 px-6 py-5 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
            <h1 className="text-2xl font-semibold text-[#12223E]">
                👋 Welcome, {username}
            </h1>
            <p className="mt-2 text-sm text-[#4A6EA0]">
                Here's what's happening in your clinic today.
            </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            <DashboardCard title="Sessions">
                {dashStats.sessions}
            </DashboardCard>
            <DashboardCard title="Referrals">
                {dashStats.referrals}
            </DashboardCard>
            <DashboardCard title="Patients">
                {dashStats.patients}
            </DashboardCard>
        </div>


        <div className="overflow-hidden rounded-4xl border border-white/40 bg-white/60 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
            <div className="border-b border-[#12223E]/10 bg-[#12223E]/5 px-4 py-4 sm:px-6 ">
                <h2 className="text-lg font-semibold text-[#12223E]">This Week's Sessions</h2>
                <p className="mt-1 text-sm text-[#4A6EA0]">A quick view of your weekly clinical activity.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#12223E]/10 text-sm text-[#12223E]">
                    <thead className="bg-[#12223E]/5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#4A6EA0]">
                        <tr>
                            <th className="px-4 py-3 sm:px-6">Patient</th>
                            <th className="px-4 py-3 sm:px-6">Clinician</th>
                            <th className="px-4 py-3 sm:px-6">Date</th>
                            <th className="px-4 py-3 sm:px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12223E]/10 bg-white/40">
                    {/* checks if the tabledata has any data if it does it maps if not it gives the no sessions yet */}
                        {tableRows.length > 0 ? (
                            tableRows.map((row, index) => (
                                <tr key={`${row.id || 'row'}-${index}`} className="transition hover:bg-cyan-50/60">
                                    <td className="px-4 py-3 sm:px-6">{row.patient_name || row.patient || '—'}</td>
                                    <td className="px-4 py-3 sm:px-6">{row.clinician_name || row.clinician || username}</td>
                                    <td className="px-4 py-3 sm:px-6">{row.session_date || row.date || '—'}</td>
                                    <td className="px-4 py-3 sm:px-6">
                                        <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                                            {row.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-6 text-center text-sm text-[#4A6EA0] sm:px-6">
                                    No recent sessions available yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Dashboard