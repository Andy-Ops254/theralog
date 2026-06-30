import React, { useEffect, useState } from 'react'
import DashboardCard from './DashboardCard'

function Dashboard() {
    const [dashStats, setDashStats] = useState({
        sessions:0,
        patients:0,
        referrals:0
    })


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

        fetch ('http://127.0.0.1:5000/dashboard/stats', {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then(res => res.json())
        .then(data => setDashStats(data))
    }, [])
  return (
    <div className="space-y-6">
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
    </div>
  )
}

export default Dashboard