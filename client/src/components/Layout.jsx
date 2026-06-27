import React from 'react'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function Layout({children}) {
    const [sidebarOpen, setSidebarOpen]=useState(false)
  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-28 px-4 sm:px-6 lg:px-8">
            {children ? (
            children
            ) : (
            <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Welcome to Theralog</h2>
                <p className="mt-4 text-slate-600">Your dashboard layout is ready. Use the sidebar to navigate once you add pages.</p>
            </div>
            )}
        </main>

        {/* Sidebar toggle button on the left */}
        {!sidebarOpen && (
          <button
            type="button"
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white/10 backdrop-blur-md border border-white/20 shadow-md p-2 rounded-r-xl text-cyan-500 hover:bg-slate-100/40 hover:scale-105 transition-all duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        )}

        {/* Overlay — dims the page when sidebar is open */}
        {sidebarOpen && (
        <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
        />
        )}

         {/* Sidebar drawer */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}

export default Layout