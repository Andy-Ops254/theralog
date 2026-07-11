import React, { useState } from 'react'
import AddClientForm from '../components/AddClientForm'

function Patients() {
  const [tableRows, setTableRows] = useState([])
  const [search, setSearch] = useState('')

  const filteredRows = tableRows.filter(row =>
    (row.patient?.full_name || row.patient_name || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

    function handleClientAdded(newClient) {
      setTableRows (prev => [...prev,newClient])
    }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-4xl border border-white/40 bg-white/50 px-6 py-5 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#12223E]">Clients</h2>
          <p className="mt-1 text-sm text-[#4A6EA0]">
            Manage your clinic's client records
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-[#12223E] px-4 py-2 font-semibold text-white shadow-[6px_6px_12px_rgba(18,34,62,0.2),-6px_-6px_12px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:scale-105 cursor-pointer whitespace-nowrap">
          <span className="text-2xl leading-none">+</span>
          <span>Add New Client</span>
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="rounded-3xl border border-white/40 bg-white/50 px-4 py-3 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clients by name..."
          className="w-80 sm:64 bg-transparent text-sm text-[#12223E] placeholder-[#4A6EA0] outline-none"
        />
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-4xl border border-white/40 bg-white/60 shadow-[12px_12px_30px_rgba(15,23,42,0.08),-12px_-12px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm">
        <table className="min-w-full divide-y divide-[#12223E]/10 text-sm text-[#12223E]">
          <thead className="bg-[#12223E]/5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#4A6EA0]">
            <tr>
              <th className="px-4 py-3 sm:px-6">Name</th>
              <th className="px-4 py-3 sm:px-6">Sex</th>
              <th className="px-4 py-3 sm:px-6">Date Admitted</th>
              <th className="px-4 py-3 sm:px-6">Condition</th>
              <th className="px-4 py-3 sm:px-6">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#12223E]/10 bg-white/40">
            {filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <tr
                  key={`${row.id || 'row'}-${index}`}
                  className="transition hover:bg-cyan-50/60"
                >
                  <td className="px-4 py-3 sm:px-6 font-medium">
                    {row.patient?.full_name || row.patient_name || '—'}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    {row.patient?.sex || row.sex || '—'}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    {row.patient?.date_of_admission || row.date_of_admission || '—'}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    {row.patient?.condition || row.condition || '—'}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                      {row.patient?.status || row.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-sm text-[#4A6EA0] sm:px-6"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">🗂️</span>
                    <span className="font-medium">No clients found</span>
                    <span className="text-xs text-[#4A6EA0]/70">
                      {search
                        ? `No results for "${search}" — try a different name`
                        : 'Add your first client using the button above'}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddClientForm onClientAdded={handleClientAdded}/>

    </div>
  )
}

export default Patients